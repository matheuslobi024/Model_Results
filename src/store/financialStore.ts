import { create } from "zustand";
import {
  BusinessType,
  TaxRegime,
  SimplesAnnex,
  CanvasBlock,
  CanvasItem,
  MacroAssumptions,
  CatalogItem,
  VariableCostItem,
  FixedExpenseItem,
  Scenario,
  ScenarioSalesProjection,
  CalculatedScenarioSummary,
  DREMonthlyResult,
  DFCMonthlyResult,
} from "../types/financial";

interface FinancialState {
  themeMode: "dark" | "light";
  projectId: string;
  projectName: string;
  businessType: BusinessType;
  timeHorizonYears: number;

  macroAssumptions: MacroAssumptions;
  canvasItems: CanvasItem[];

  activeScenarioId: string;
  scenarios: Scenario[];
  taxRegime: TaxRegime;
  simplesAnnex: SimplesAnnex;
  effectiveTaxRateOverridePct: number | null;
  rbt12: number;
  pmrDays: number;
  pmpDays: number;
  initialCapex: number;
  initialCashDeposit: number;
  monthlyDepreciation: number;
  catalogItems: CatalogItem[];
  variableCosts: VariableCostItem[];
  fixedExpenses: FixedExpenseItem[];
  salesProjections: ScenarioSalesProjection[];
  computedSummaries: Record<string, CalculatedScenarioSummary>;

  toggleTheme: () => void;
  updateProjectMetadata: (projectName: string, businessType: BusinessType, timeHorizonYears: number) => void;
  updateMacroAssumptions: (assumptions: Partial<MacroAssumptions>) => void;
  addCanvasItem: (block: CanvasBlock, text: string) => void;
  deleteCanvasItem: (id: string) => void;
  setActiveScenario: (scenarioId: string) => void;
  updateScenarioMultipliers: (scenarioId: string, priceGrowthMultiplier: number, costGrowthMultiplier: number) => void;
  updateTaxRegime: (regime: TaxRegime, annex?: SimplesAnnex, overridePct?: number | null) => void;
  updateWorkingCapital: (pmrDays: number, pmpDays: number, initialCashDeposit: number, initialCapex?: number, monthlyDepreciation?: number) => void;
  addCatalogItem: (item: CatalogItem) => void;
  updateCatalogItem: (id: string, updatedFields: Partial<CatalogItem>) => void;
  deleteCatalogItem: (id: string) => void;
  addVariableCost: (cost: VariableCostItem) => void;
  updateVariableCost: (id: string, updatedFields: Partial<VariableCostItem>) => void;
  deleteVariableCost: (id: string) => void;
  addFixedExpense: (expense: FixedExpenseItem) => void;
  updateFixedExpense: (id: string, updatedFields: Partial<FixedExpenseItem>) => void;
  deleteFixedExpense: (id: string) => void;
  updateSalesProjection: (scenarioId: string, catalogItemId: string, monthIndex: number, projectedVolume: number) => void;
  addScenario: (name: string, cloneFromScenarioId?: string) => void;
  recalculateAll: () => void;
}

const initialMacroAssumptions: MacroAssumptions = {
  ipcaPct: 4.5,
  igpmPct: 5.0,
  selicPct: 10.5,
  cdiPct: 10.4,
  usdRate: 5.20,
  salaryIncreasePct: 6.0,
};

const initialCanvasItems: CanvasItem[] = [
  { id: "cv_1", block: "KEY_PARTNERS", text: "Fornecedores de alimentos em atacado & bebidas" },
  { id: "cv_2", block: "KEY_PARTNERS", text: "Plataformas de pagamento e POS móvel" },
  { id: "cv_3", block: "KEY_ACTIVITIES", text: "Preparo contínuo e padrão de qualidade alimentar" },
  { id: "cv_4", block: "KEY_ACTIVITIES", text: "Gestão de estoque de perecíveis e atendimento rápido" },
  { id: "cv_5", block: "KEY_RESOURCES", text: "Cozinha industrial compacta e balcão de vendas" },
  { id: "cv_6", block: "KEY_RESOURCES", text: "Equipe de atendimento e gerente operacional" },
  { id: "cv_7", block: "VALUE_PROPOSITIONS", text: "Lanche rápido com ingredientes selecionados e entrega ágil" },
  { id: "cv_8", block: "VALUE_PROPOSITIONS", text: "Preço acessível e excelente custo-benefício para refeições diárias" },
  { id: "cv_9", block: "CUSTOMER_RELATIONSHIPS", text: "Atendimento presencial cortês e programa de fidelidade" },
  { id: "cv_10", block: "CHANNELS", text: "Loja física em ponto de alto fluxo de pedestres" },
  { id: "cv_11", block: "CHANNELS", text: "Totem de autoatendimento e aplicativo móvel" },
  { id: "cv_12", block: "CUSTOMER_SEGMENTS", text: "Estudantes e trabalhadores locais para almoço/lanche" },
  { id: "cv_13", block: "CUSTOMER_SEGMENTS", text: "Famílias e residentes da região comercial" },
  { id: "cv_14", block: "COST_STRUCTURE", text: "Custos com insumos (pão, salsicha, bebidas)" },
  { id: "cv_15", block: "COST_STRUCTURE", text: "Folha de pagamento + 68% encargos trabalhistas" },
  { id: "cv_16", block: "COST_STRUCTURE", text: "Aluguel comercial, luz, água e impostos" },
  { id: "cv_17", block: "REVENUE_STREAMS", text: "Venda direta de Cachorro Quente (R$ 15,00/un)" },
  { id: "cv_18", block: "REVENUE_STREAMS", text: "Venda de Bebidas e Refrigerantes (R$ 7,00/un)" },
];

const initialCatalogItems: CatalogItem[] = [
  { id: "prod_001", name: "Cachorro Quente 1 Salsicha", itemType: "PRODUTO", unitSellingPrice: 15.0 },
  { id: "prod_002", name: "Bebida / Refrigerante 350ml", itemType: "PRODUTO", unitSellingPrice: 7.0 },
];

const initialVariableCosts: VariableCostItem[] = [
  { id: "vc_101", catalogItemId: "prod_001", name: "Pão e Salsicha", category: "INSUMO_MATERIA_PRIMA", calculationType: "CURRENCY_PER_UNIT", value: 3.5 },
  { id: "vc_102", catalogItemId: "prod_001", name: "Comissão de Garçom", category: "COMISSAO_VENDAS", calculationType: "PERCENTAGE_OF_PRICE", value: 5.0 },
  { id: "vc_103", catalogItemId: "prod_001", name: "Taxa de Cartão", category: "TAXA_MEIOS_PAGAMENTO", calculationType: "PERCENTAGE_OF_PRICE", value: 2.5 },
  { id: "vc_104", catalogItemId: "prod_002", name: "Custo de Aquisição da Bebida", category: "INSUMO_MATERIA_PRIMA", calculationType: "CURRENCY_PER_UNIT", value: 2.8 },
];

const initialFixedExpenses: FixedExpenseItem[] = [
  { id: "fe_201", name: "Salários Gerência e Operação", category: "FOLHA_PESSOAL", baseMonthlyValue: 18000.0, socialChargesPct: 68.0, startMonth: 1, indexType: "REAJUSTE_SALARIAL" },
  { id: "fe_202", name: "Pró-Labore dos Sócios", category: "FOLHA_PESSOAL", baseMonthlyValue: 12000.0, socialChargesPct: 11.0, startMonth: 1, indexType: "IPCA" },
  { id: "fe_203", name: "Aluguel Comercial", category: "ESTRUTURA_OCUPACAO", baseMonthlyValue: 6500.0, socialChargesPct: 0.0, startMonth: 1, indexType: "IGPM" },
  { id: "fe_204", name: "Verba Tráfego Pago & Marketing", category: "MARKETING_VENDAS", baseMonthlyValue: 5000.0, socialChargesPct: 0.0, startMonth: 1, indexType: "NONE" },
];

const initialScenarios: Scenario[] = [
  { id: "sc_base", name: "Base", isDefault: true, priceGrowthMultiplier: 1.0, costGrowthMultiplier: 1.0 },
  { id: "sc_optimistic", name: "Otimista", isDefault: true, priceGrowthMultiplier: 1.15, costGrowthMultiplier: 0.95 },
  { id: "sc_pessimistic", name: "Pessimista", isDefault: true, priceGrowthMultiplier: 0.85, costGrowthMultiplier: 1.1 },
];

const generateInitialProjections = (): ScenarioSalesProjection[] => {
  const projections: ScenarioSalesProjection[] = [];
  const baseVolumes: Record<string, number> = { prod_001: 20000, prod_002: 23809 };
  initialScenarios.forEach((sc) => {
    initialCatalogItems.forEach((item) => {
      for (let m = 1; m <= 12; m++) {
        let volumeMultiplier = 1.0;
        if (sc.id === "sc_optimistic") volumeMultiplier = 1.25;
        if (sc.id === "sc_pessimistic") volumeMultiplier = 0.75;
        projections.push({
          scenarioId: sc.id,
          catalogItemId: item.id,
          monthIndex: m,
          projectedVolume: Math.round((baseVolumes[item.id] || 5000) * volumeMultiplier),
        });
      }
    });
  });
  return projections;
};

const calculateAnalytics = (
  scenario: Scenario,
  catalogItems: CatalogItem[],
  variableCosts: VariableCostItem[],
  fixedExpenses: FixedExpenseItem[],
  salesProjections: ScenarioSalesProjection[],
  taxRegime: TaxRegime,
  effectiveOverridePct: number | null,
  pmrDays: number,
  pmpDays: number,
  initialCashDeposit: number,
  monthlyDepreciation: number
): CalculatedScenarioSummary => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthlyDRE: DREMonthlyResult[] = [];
  const monthlyDFC: DFCMonthlyResult[] = [];
  let accumulatedCash = initialCashDeposit;
  let lowestCashBalance = initialCashDeposit;
  let hasInsolvencyRisk = false;

  months.forEach((m) => {
    let grossRevenue = 0;
    let totalVariableCosts = 0;
    catalogItems.forEach((item) => {
      const proj = salesProjections.find((p) => p.scenarioId === scenario.id && p.catalogItemId === item.id && p.monthIndex === m);
      const volume = proj ? proj.projectedVolume : 0;
      const unitPrice = (proj?.unitPriceOverride ?? item.unitSellingPrice) * scenario.priceGrowthMultiplier;
      grossRevenue += volume * unitPrice;

      const itemCosts = variableCosts.filter((vc) => vc.catalogItemId === item.id);
      let unitVarCost = 0;
      itemCosts.forEach((vc) => {
        if (vc.calculationType === "CURRENCY_PER_UNIT") {
          unitVarCost += vc.value * scenario.costGrowthMultiplier;
        } else {
          unitVarCost += (unitPrice * (vc.value / 100)) * scenario.costGrowthMultiplier;
        }
      });
      totalVariableCosts += volume * unitVarCost;
    });

    let effectiveTaxRate = 0.082;
    if (effectiveOverridePct !== null) effectiveTaxRate = effectiveOverridePct / 100;
    else if (taxRegime === "SIMPLES_NACIONAL") effectiveTaxRate = 0.06;
    else if (taxRegime === "LUCRO_PRESUMIDO") effectiveTaxRate = 0.1133;
    else if (taxRegime === "ISENTO") effectiveTaxRate = 0.0;

    const revenueTaxes = grossRevenue * effectiveTaxRate;
    const netRevenue = grossRevenue - revenueTaxes;
    const contributionMargin = netRevenue - totalVariableCosts;
    const contributionMarginPct = grossRevenue > 0 ? (contributionMargin / grossRevenue) * 100 : 0;

    let fixedExpMonth = 0;
    fixedExpenses.forEach((fe) => {
      if (m >= fe.startMonth && (!fe.endMonth || m <= fe.endMonth)) {
        fixedExpMonth += fe.baseMonthlyValue * (1 + fe.socialChargesPct / 100);
      }
    });

    const ebitda = contributionMargin - fixedExpMonth;
    const ebitdaMarginPct = grossRevenue > 0 ? (ebitda / grossRevenue) * 100 : 0;
    const ebit = ebitda - monthlyDepreciation;
    const netIncome = ebit;
    const netMarginPct = grossRevenue > 0 ? (netIncome / grossRevenue) * 100 : 0;

    monthlyDRE.push({
      month: m,
      grossRevenue,
      revenueTaxes,
      netRevenue,
      totalVariableCosts,
      contributionMargin,
      contributionMarginPct,
      fixedExpenses: fixedExpMonth,
      ebitda,
      ebitdaMarginPct,
      depreciation: monthlyDepreciation,
      ebit,
      netIncome,
      netMarginPct,
    });
  });

  months.forEach((m, idx) => {
    const dreCurr = monthlyDRE[idx];
    const pmrMonths = Math.floor(pmrDays / 30);
    const inMonthIdx = idx - pmrMonths;
    const inflowSales = inMonthIdx >= 0 ? monthlyDRE[inMonthIdx].grossRevenue : 0;

    const pmpMonths = Math.floor(pmpDays / 30);
    const outCostIdx = idx - pmpMonths;
    const outflowVarCosts = outCostIdx >= 0 ? monthlyDRE[outCostIdx].totalVariableCosts : 0;
    const outflowFixedExp = dreCurr.fixedExpenses;
    const outflowTaxes = idx >= 1 ? monthlyDRE[idx - 1].revenueTaxes : 0;

    const fco = inflowSales - (outflowVarCosts + outflowFixedExp + outflowTaxes);
    const netCashFlow = fco;
    accumulatedCash += netCashFlow;

    if (accumulatedCash < lowestCashBalance) lowestCashBalance = accumulatedCash;
    if (accumulatedCash < 0) hasInsolvencyRisk = true;

    monthlyDFC.push({
      month: m,
      operatingCashFlow: fco,
      investingCashFlow: 0,
      financingCashFlow: 0,
      netCashFlow,
      cumulativeCashBalance: accumulatedCash,
      isNegativeAlert: accumulatedCash < 0,
    });
  });

  const annualGrossRevenue = monthlyDRE.reduce((sum, d) => sum + d.grossRevenue, 0);
  const annualNetIncome = monthlyDRE.reduce((sum, d) => sum + d.netIncome, 0);
  const avgFixedExpenses = monthlyDRE.reduce((sum, d) => sum + d.fixedExpenses, 0) / 12;
  const avgContribRatio = annualGrossRevenue > 0 ? monthlyDRE.reduce((sum, d) => sum + d.contributionMargin, 0) / annualGrossRevenue : 1;
  const monthlyBreakeven = avgContribRatio > 0 ? avgFixedExpenses / avgContribRatio : 0;

  return {
    scenarioId: scenario.id,
    annualGrossRevenue,
    annualNetIncome,
    netMarginPct: annualGrossRevenue > 0 ? (annualNetIncome / annualGrossRevenue) * 100 : 0,
    ebitdaMarginPct: annualGrossRevenue > 0 ? (monthlyDRE.reduce((sum, d) => sum + d.ebitda, 0) / annualGrossRevenue) * 100 : 0,
    lowestCashBalance,
    monthlyBreakeven,
    hasInsolvencyRisk,
    monthlyDRE,
    monthlyDFC,
  };
};

const computeInitialSummaries = () => {
  const summaries: Record<string, CalculatedScenarioSummary> = {};
  initialScenarios.forEach((sc) => {
    summaries[sc.id] = calculateAnalytics(
      sc, initialCatalogItems, initialVariableCosts, initialFixedExpenses,
      generateInitialProjections(), "SIMPLES_NACIONAL", 8.2, 30, 30, 150000, 2000
    );
  });
  return summaries;
};

export const useFinancialStore = create<FinancialState>((set, get) => ({
  themeMode: "light",
  projectId: "proj_987654",
  projectName: "Distribuidora Aurora",
  businessType: "COMERCIO",
  timeHorizonYears: 1,

  macroAssumptions: initialMacroAssumptions,
  canvasItems: initialCanvasItems,

  activeScenarioId: "sc_base",
  scenarios: initialScenarios,
  taxRegime: "SIMPLES_NACIONAL",
  simplesAnnex: "ANEXO_I",
  effectiveTaxRateOverridePct: 8.2,
  rbt12: 180000.0,
  pmrDays: 30,
  pmpDays: 30,
  initialCapex: 120000.0,
  initialCashDeposit: 150000.0,
  monthlyDepreciation: 2000.0,
  catalogItems: initialCatalogItems,
  variableCosts: initialVariableCosts,
  fixedExpenses: initialFixedExpenses,
  salesProjections: generateInitialProjections(),
  computedSummaries: computeInitialSummaries(),

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.themeMode === "dark" ? "light" : "dark";
      if (newTheme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { themeMode: newTheme };
    });
  },

  updateProjectMetadata: (projectName, businessType, timeHorizonYears) => {
    set({ projectName, businessType, timeHorizonYears });
    get().recalculateAll();
  },

  updateMacroAssumptions: (assumptions) => {
    set((state) => ({ macroAssumptions: { ...state.macroAssumptions, ...assumptions } }));
    get().recalculateAll();
  },

  addCanvasItem: (block, text) => {
    const newItem: CanvasItem = { id: `cv_${Date.now()}`, block, text };
    set((state) => ({ canvasItems: [...state.canvasItems, newItem] }));
  },

  deleteCanvasItem: (id) => {
    set((state) => ({ canvasItems: state.canvasItems.filter((item) => item.id !== id) }));
  },

  setActiveScenario: (scenarioId) => set({ activeScenarioId: scenarioId }),

  updateScenarioMultipliers: (scenarioId, priceGrowthMultiplier, costGrowthMultiplier) => {
    set((state) => ({
      scenarios: state.scenarios.map((sc) =>
        sc.id === scenarioId ? { ...sc, priceGrowthMultiplier, costGrowthMultiplier } : sc
      ),
    }));
    get().recalculateAll();
  },

  updateTaxRegime: (regime, annex = "ANEXO_I", overridePct = null) => {
    set({ taxRegime: regime, simplesAnnex: annex, effectiveTaxRateOverridePct: overridePct });
    get().recalculateAll();
  },

  updateWorkingCapital: (pmrDays, pmpDays, initialCashDeposit, initialCapex = 120000, monthlyDepreciation = 2000) => {
    set({ pmrDays, pmpDays, initialCashDeposit, initialCapex, monthlyDepreciation });
    get().recalculateAll();
  },

  addCatalogItem: (item) => {
    set((state) => {
      const newCatalog = [...state.catalogItems, item];
      const newProjections = [...state.salesProjections];
      state.scenarios.forEach((sc) => {
        for (let m = 1; m <= 12; m++) {
          newProjections.push({
            scenarioId: sc.id,
            catalogItemId: item.id,
            monthIndex: m,
            projectedVolume: 1000,
          });
        }
      });
      return { catalogItems: newCatalog, salesProjections: newProjections };
    });
    get().recalculateAll();
  },

  updateCatalogItem: (id, updatedFields) => {
    set((state) => ({
      catalogItems: state.catalogItems.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)),
    }));
    get().recalculateAll();
  },

  deleteCatalogItem: (id) => {
    set((state) => ({
      catalogItems: state.catalogItems.filter((item) => item.id !== id),
      variableCosts: state.variableCosts.filter((vc) => vc.catalogItemId !== id),
      salesProjections: state.salesProjections.filter((p) => p.catalogItemId !== id),
    }));
    get().recalculateAll();
  },

  addVariableCost: (cost) => {
    set((state) => ({ variableCosts: [...state.variableCosts, cost] }));
    get().recalculateAll();
  },

  updateVariableCost: (id, updatedFields) => {
    set((state) => ({
      variableCosts: state.variableCosts.map((vc) => (vc.id === id ? { ...vc, ...updatedFields } : vc)),
    }));
    get().recalculateAll();
  },

  deleteVariableCost: (id) => {
    set((state) => ({ variableCosts: state.variableCosts.filter((vc) => vc.id !== id) }));
    get().recalculateAll();
  },

  addFixedExpense: (expense) => {
    set((state) => ({ fixedExpenses: [...state.fixedExpenses, expense] }));
    get().recalculateAll();
  },

  updateFixedExpense: (id, updatedFields) => {
    set((state) => ({
      fixedExpenses: state.fixedExpenses.map((fe) => (fe.id === id ? { ...fe, ...updatedFields } : fe)),
    }));
    get().recalculateAll();
  },

  deleteFixedExpense: (id) => {
    set((state) => ({ fixedExpenses: state.fixedExpenses.filter((fe) => fe.id !== id) }));
    get().recalculateAll();
  },

  updateSalesProjection: (scenarioId, catalogItemId, monthIndex, projectedVolume) => {
    set((state) => {
      const idx = state.salesProjections.findIndex(
        (p) => p.scenarioId === scenarioId && p.catalogItemId === catalogItemId && p.monthIndex === monthIndex
      );
      let updated = [...state.salesProjections];
      if (idx >= 0) updated[idx] = { ...updated[idx], projectedVolume };
      else updated.push({ scenarioId, catalogItemId, monthIndex, projectedVolume });
      return { salesProjections: updated };
    });
    get().recalculateAll();
  },

  addScenario: (name, cloneFromScenarioId) => {
    const newId = `sc_${Date.now()}`;
    const newScenario: Scenario = { id: newId, name, isDefault: false, priceGrowthMultiplier: 1.0, costGrowthMultiplier: 1.0 };
    set((state) => {
      const cloned: ScenarioSalesProjection[] = [];
      if (cloneFromScenarioId) {
        state.salesProjections.filter((p) => p.scenarioId === cloneFromScenarioId).forEach((p) => {
          cloned.push({ ...p, scenarioId: newId });
        });
      } else {
        state.catalogItems.forEach((item) => {
          for (let m = 1; m <= 12; m++) {
            cloned.push({ scenarioId: newId, catalogItemId: item.id, monthIndex: m, projectedVolume: 1000 });
          }
        });
      }
      return {
        scenarios: [...state.scenarios, newScenario],
        salesProjections: [...state.salesProjections, ...cloned],
      };
    });
    get().recalculateAll();
  },

  recalculateAll: () => {
    const state = get();
    const newSummaries: Record<string, CalculatedScenarioSummary> = {};
    state.scenarios.forEach((sc) => {
      newSummaries[sc.id] = calculateAnalytics(
        sc, state.catalogItems, state.variableCosts, state.fixedExpenses,
        state.salesProjections, state.taxRegime, state.effectiveTaxRateOverridePct,
        state.pmrDays, state.pmpDays, state.initialCashDeposit, state.monthlyDepreciation
      );
    });
    set({ computedSummaries: newSummaries });
  },
}));
