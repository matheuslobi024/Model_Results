from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional
from financial_engine import DREEngine, DFCEngine, TaxCalculator

app = FastAPI(
    title="Model Results – Financial Analysis API",
    version="1.0.0",
    description="Backend Financial Engine supporting DRE Waterfall, DFC Cash Flow, and Tax Calculations with Decimal precision."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MonthlyDRERequest(BaseModel):
    gross_revenue: float
    rbt12: float = 180000.0
    variable_costs_unit_sum: float = 0.0
    sales_volume: float = 1.0
    fixed_expenses_total: float = 0.0
    monthly_depreciation: float = 0.0
    tax_regime: str = "SIMPLES_NACIONAL"
    tax_override_pct: Optional[float] = None

class MultiPeriodDFCRequest(BaseModel):
    dre_months: List[dict]
    initial_cash: float = 150000.0
    pmr_months: int = 1
    pmp_months: int = 1

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Model Results – Financial Analysis & Technology",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "active",
        "precision": "Decimal (2 places)"
    }

@app.post("/api/calculate-dre")
def calculate_dre(req: MonthlyDRERequest):
    dre_res = DREEngine.calculate_monthly_dre(
        gross_revenue=Decimal(str(req.gross_revenue)),
        rbt12=Decimal(str(req.rbt12)),
        variable_costs_unit_sum=Decimal(str(req.variable_costs_unit_sum)),
        sales_volume=Decimal(str(req.sales_volume)),
        fixed_expenses_total=Decimal(str(req.fixed_expenses_total)),
        monthly_depreciation=Decimal(str(req.monthly_depreciation)),
        tax_regime=req.tax_regime,
        tax_override_pct=Decimal(str(req.tax_override_pct)) if req.tax_override_pct is not None else None
    )
    return {k: float(v) for k, v in dre_res.items()}

@app.post("/api/calculate-dfc")
def calculate_dfc(req: MultiPeriodDFCRequest):
    dre_months_decimal = []
    for m in req.dre_months:
        dre_months_decimal.append({k: Decimal(str(v)) for k, v in m.items()})

    dfc_res = DFCEngine.calculate_multi_period_dfc(
        dre_months=dre_months_decimal,
        initial_cash=Decimal(str(req.initial_cash)),
        pmr_months=req.pmr_months,
        pmp_months=req.pmp_months
    )
    return [{k: float(v) if isinstance(v, Decimal) else v for k, v in c.items()} for c in dfc_res]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
