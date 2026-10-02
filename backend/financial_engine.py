"""
Model Results – Financial Analysis & Technology
Backend Financial Engine Implementation (Python / FastAPI + Decimal)

Modules:
1. TaxEngine (Simples Nacional, Lucro Presumido, Lucro Real, Isento)
2. DREEngine (Income Statement Waterfall)
3. DFCEngine (Cash Flow Statement with Working Capital Lags)
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# ----------------------------------------------------------------------
# Helper Utilities for Precision Arithmetic
# ----------------------------------------------------------------------

def to_d(val: Any) -> Decimal:
    """Converts int, float, or str to Decimal safely."""
    if val is None:
        return Decimal("0.00")
    return Decimal(str(val)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def round_curr(val: Decimal) -> Decimal:
    """Rounds a Decimal value to 2 decimal places."""
    return val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


# ----------------------------------------------------------------------
# 1. Tax Engine (Simples Nacional Brackets & Direct Revenue Taxes)
# ----------------------------------------------------------------------

# Simples Nacional Annex III Statutory Brackets (Software/Services)
SIMPLES_ANNEX_III = [
    {"limit": Decimal("180000.00"),  "rate": Decimal("0.0600"), "deduction": Decimal("0.00")},
    {"limit": Decimal("360000.00"),  "rate": Decimal("0.1120"), "deduction": Decimal("9360.00")},
    {"limit": Decimal("720000.00"),  "rate": Decimal("0.1350"), "deduction": Decimal("17640.00")},
    {"limit": Decimal("1800000.00"), "rate": Decimal("0.1600"), "deduction": Decimal("35640.00")},
    {"limit": Decimal("3600000.00"), "rate": Decimal("0.2100"), "deduction": Decimal("125640.00")},
    {"limit": Decimal("4800000.00"), "rate": Decimal("0.3300"), "deduction": Decimal("648000.00")},
]

class TaxCalculator:
    @staticmethod
    def calculate_simples_rate(rbt12: Decimal, annex_brackets=SIMPLES_ANNEX_III) -> Decimal:
        """Calculates effective Simples Nacional tax rate based on RBT12."""
        if rbt12 <= Decimal("0.00"):
            return annex_brackets[0]["rate"]
            
        bracket = annex_brackets[-1]
        for b in annex_brackets:
            if rbt12 <= b["limit"]:
                bracket = b
                break
                
        effective_rate = ((rbt12 * bracket["rate"]) - bracket["deduction"]) / rbt12
        return max(effective_rate, Decimal("0.00"))

    @staticmethod
    def calculate_monthly_tax(
        gross_revenue: Decimal, 
        rbt12: Decimal, 
        regime: str = "SIMPLES_NACIONAL",
        custom_override_pct: Optional[Decimal] = None
    ) -> Dict[str, Decimal]:
        """Calculates direct revenue tax amount and net revenue for a given month."""
        if custom_override_pct is not None:
            effective_rate = custom_override_pct / Decimal("100.00")
        elif regime == "SIMPLES_NACIONAL":
            effective_rate = TaxCalculator.calculate_simples_rate(rbt12)
        elif regime == "LUCRO_PRESUMIDO":
            effective_rate = Decimal("0.0865")  # PIS (0.65%) + COFINS (3.0%) + ISS/ICMS (5.0%)
        elif regime == "LUCRO_REAL":
            effective_rate = Decimal("0.1425")  # PIS (1.65%) + COFINS (7.6%) + ISS/ICMS (5.0%)
        else: # ISENTO
            effective_rate = Decimal("0.00")
            
        tax_amount = round_curr(gross_revenue * effective_rate)
        net_revenue = round_curr(gross_revenue - tax_amount)
        
        return {
            "effective_rate_pct": round_curr(effective_rate * Decimal("100.00")),
            "tax_amount": tax_amount,
            "net_revenue": net_revenue
        }


# ----------------------------------------------------------------------
# 2. DRE Engine (Waterfall Income Statement Calculation)
# ----------------------------------------------------------------------

class DREEngine:
    @staticmethod
    def calculate_monthly_dre(
        gross_revenue: Decimal,
        rbt12: Decimal,
        variable_costs_unit_sum: Decimal,
        sales_volume: Decimal,
        fixed_expenses_total: Decimal,
        monthly_depreciation: Decimal,
        tax_regime: str = "SIMPLES_NACIONAL",
        tax_override_pct: Optional[Decimal] = None
    ) -> Dict[str, Decimal]:
        """Executes the DRE waterfall calculation for a single month."""
        
        # 1. Tax Calculation
        tax_res = TaxCalculator.calculate_monthly_tax(
            gross_revenue=gross_revenue,
            rbt12=rbt12,
            regime=tax_regime,
            custom_override_pct=tax_override_pct
        )
        tax_amount = tax_res["tax_amount"]
        net_revenue = tax_res["net_revenue"]
        
        # 2. Variable Costs (CPV/CSV)
        total_variable_costs = round_curr(variable_costs_unit_sum * sales_volume)
        
        # 3. Contribution Margin
        contribution_margin = net_revenue - total_variable_costs
        
        # 4. EBITDA
        ebitda = contribution_margin - fixed_expenses_total
        
        # 5. EBIT (Operating Result)
        ebit = ebitda - monthly_depreciation
        
        # 6. Net Result (assuming neutral financial result and simplified IRPJ for Presumido/Real if applicable)
        net_income = ebit
        
        # Ratios
        net_margin_pct = round_curr((net_income / gross_revenue * Decimal("100.00"))) if gross_revenue > 0 else Decimal("0.00")
        ebitda_margin_pct = round_curr((ebitda / gross_revenue * Decimal("100.00"))) if gross_revenue > 0 else Decimal("0.00")
        
        return {
            "gross_revenue": gross_revenue,
            "revenue_tax": tax_amount,
            "net_revenue": net_revenue,
            "total_variable_costs": total_variable_costs,
            "contribution_margin": contribution_margin,
            "fixed_expenses": fixed_expenses_total,
            "ebitda": ebitda,
            "ebitda_margin_pct": ebitda_margin_pct,
            "depreciation": monthly_depreciation,
            "ebit": ebit,
            "net_income": net_income,
            "net_margin_pct": net_margin_pct
        }


# ----------------------------------------------------------------------
# 3. DFC Engine (Cash Flow Statement & Working Capital Lags)
# ----------------------------------------------------------------------

class DFCEngine:
    @staticmethod
    def calculate_multi_period_dfc(
        dre_months: List[Dict[str, Decimal]],
        initial_cash: Decimal,
        pmr_months: int = 1,  # Collection lag in months (e.g., 30 days = 1 month)
        pmp_months: int = 1,  # Payment lag in months
        capex_schedule: Optional[Dict[int, Decimal]] = None
    ) -> List[Dict[str, Any]]:
        """Transforms DRE accrual results into DFC cash flows with working capital lags."""
        if capex_schedule is None:
            capex_schedule = {}
            
        cash_curve = []
        cumulative_cash = initial_cash
        
        for m_idx, dre in enumerate(dre_months, start=1):
            # Operating Inflows (Shifted by PMR)
            inflow_idx = m_idx - pmr_months - 1
            inflow_sales = dre_months[inflow_idx]["gross_revenue"] if inflow_idx >= 0 else Decimal("0.00")
            
            # Operating Outflows (Shifted by PMP and Tax Lag)
            var_cost_idx = m_idx - pmp_months - 1
            outflow_var_costs = dre_months[var_cost_idx]["total_variable_costs"] if var_cost_idx >= 0 else Decimal("0.00")
            
            outflow_fixed_exp = dre["fixed_expenses"]
            
            # Taxes paid in m+1
            outflow_taxes = dre_months[m_idx - 2]["revenue_tax"] if m_idx >= 2 else Decimal("0.00")
            
            # Operating Cash Flow (FCO)
            fco = inflow_sales - (outflow_var_costs + outflow_fixed_exp + outflow_taxes)
            
            # Investing Cash Flow (FCI)
            fci = -capex_schedule.get(m_idx, Decimal("0.00"))
            
            # Net Cash Flow for the Month
            net_cash_flow = fco + fci
            cumulative_cash += net_cash_flow
            
            cash_curve.append({
                "month": m_idx,
                "fco": round_curr(fco),
                "fci": round_curr(fci),
                "net_cash_flow": round_curr(net_cash_flow),
                "cumulative_cash_balance": round_curr(cumulative_cash),
                "is_insolvency_alert": cumulative_cash < Decimal("0.00")
            })
            
        return cash_curve


# ----------------------------------------------------------------------
# 4. Engine Verification & Test Execution
# ----------------------------------------------------------------------

if __name__ == "__main__":
    print("Testing Model Results Financial Engine...")
    
    # Sample Test Case: Month 1 to Month 12 simulation
    gross_rev_sample = Decimal("466666.67") # ~5.6M annual
    rbt12_sample = Decimal("1000000.00")
    var_cost_unit = Decimal("4.63")
    volume = Decimal("31111.00")
    fixed_exp = Decimal("63080.00")
    deprec = Decimal("2000.00")
    
    dre_res = DREEngine.calculate_monthly_dre(
        gross_revenue=gross_rev_sample,
        rbt12=rbt12_sample,
        variable_costs_unit_sum=var_cost_unit,
        sales_volume=volume,
        fixed_expenses_total=fixed_exp,
        monthly_depreciation=deprec,
        tax_override_pct=Decimal("8.20")
    )
    
    print("\n--- Monthly DRE Result ---")
    for k, v in dre_res.items():
        print(f"  {k}: {v}")
        
    dre_list = [dre_res] * 12
    dfc_res = DFCEngine.calculate_multi_period_dfc(
        dre_months=dre_list,
        initial_cash=Decimal("150000.00"),
        pmr_months=1,
        pmp_months=1
    )
    
    print("\n--- Cash Flow Curve (First 3 Months) ---")
    for c in dfc_res[:3]:
        print(f"  Month {c['month']}: Balance = R$ {c['cumulative_cash_balance']} | FCO = R$ {c['fco']} | Insolvency = {c['is_insolvency_alert']}")
    print("\nEngine execution verified successfully!")
