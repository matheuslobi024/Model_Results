export type BusinessType = 'SERVICOS' | 'COMERCIO' | 'INDUSTRIA' | 'PROJETO';
export type TaxRegime = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'ISENTO';
export type SimplesAnnex = 'ANEXO_I' | 'ANEXO_II' | 'ANEXO_III' | 'ANEXO_IV' | 'ANEXO_V';

export type CanvasBlock = 
  | 'KEY_PARTNERS'
  | 'KEY_ACTIVITIES'
  | 'KEY_RESOURCES'
  | 'VALUE_PROPOSITIONS'
  | 'CUSTOMER_RELATIONSHIPS'
  | 'CHANNELS'
  | 'CUSTOMER_SEGMENTS'
  | 'COST_STRUCTURE'
  | 'REVENUE_STREAMS';

export interface CanvasItem {
  id: string;
  block: CanvasBlock;
  text: string;
}

export interface MacroAssumptions {
  ipcaPct: number;
  igpmPct: number;
  selicPct: number;
  cdiPct: number;
  usdRate: number;
  salaryIncreasePct: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  itemType: 'PRODUTO' | 'SERVICO';
  unitSellingPrice: number;
}

export interface VariableCostItem {
  id: string;
  catalogItemId: string;
  name: string;
  category: 'INSUMO_MATERIA_PRIMA' | 'MAO_DE_OBRA_DIRETA' | 'EMBALAGEM_LOGISTICA' | 'COMISSAO_VENDAS' | 'TAXA_MEIOS_PAGAMENTO' | 'OUTROS_VARIAVEIS';
  calculationType: 'CURRENCY_PER_UNIT' | 'PERCENTAGE_OF_PRICE';
  value: number;
}

export interface FixedExpenseItem {
  id: string;
  name: string;
  category: 'FOLHA_PESSOAL' | 'ESTRUTURA_OCUPACAO' | 'SERVICOS_TERCEIROS_TI' | 'MARKETING_VENDAS' | 'DESPESAS_DIVERSAS';
  baseMonthlyValue: number;
  socialChargesPct: number;
  startMonth: number;
  endMonth?: number;
  indexType: 'NONE' | 'IPCA' | 'IGPM' | 'REAJUSTE_SALARIAL';
}

export interface Scenario {
  id: string;
  name: string;
  isDefault: boolean;
  priceGrowthMultiplier: number;
  costGrowthMultiplier: number;
}

export interface ScenarioSalesProjection {
  scenarioId: string;
  catalogItemId: string;
  monthIndex: number;
  projectedVolume: number;
  unitPriceOverride?: number;
}

export interface DREMonthlyResult {
  month: number;
  grossRevenue: number;
  revenueTaxes: number;
  netRevenue: number;
  totalVariableCosts: number;
  contributionMargin: number;
  contributionMarginPct: number;
  fixedExpenses: number;
  ebitda: number;
  ebitdaMarginPct: number;
  depreciation: number;
  ebit: number;
  netIncome: number;
  netMarginPct: number;
}

export interface DFCMonthlyResult {
  month: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeCashBalance: number;
  isNegativeAlert: boolean;
}

export interface CalculatedScenarioSummary {
  scenarioId: string;
  annualGrossRevenue: number;
  annualNetIncome: number;
  netMarginPct: number;
  ebitdaMarginPct: number;
  lowestCashBalance: number;
  monthlyBreakeven: number;
  hasInsolvencyRisk: boolean;
  monthlyDRE: DREMonthlyResult[];
  monthlyDFC: DFCMonthlyResult[];
}
