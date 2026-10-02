import React, { useState } from 'react';
import { FileSpreadsheet, DollarSign, Percent, Calculator, Plus, Trash2, Calendar, ShieldCheck, Wallet } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';
import { TaxRegime, SimplesAnnex, VariableCostItem, FixedExpenseItem } from '../types/financial';

export const ProjectSpecifications: React.FC = () => {
  const {
    themeMode,
    taxRegime,
    simplesAnnex,
    effectiveTaxRateOverridePct,
    pmrDays,
    pmpDays,
    initialCashDeposit,
    initialCapex,
    monthlyDepreciation,
    catalogItems,
    variableCosts,
    fixedExpenses,
    updateTaxRegime,
    updateWorkingCapital,
    addVariableCost,
    deleteVariableCost,
    addFixedExpense,
    deleteFixedExpense,
  } = useFinancialStore();

  const isDark = themeMode === 'dark';

  // Tax Override % local input state
  const [overrideInput, setOverrideInput] = useState<string>(
    effectiveTaxRateOverridePct !== null ? String(effectiveTaxRateOverridePct) : '8.2'
  );

  // Form State for Variable Cost
  const [vcName, setVcName] = useState('');
  const [vcCatalogItemId, setVcCatalogItemId] = useState(catalogItems[0]?.id || '');
  const [vcCategory, setVcCategory] = useState<VariableCostItem['category']>('INSUMO_MATERIA_PRIMA');
  const [vcCalcType, setVcCalcType] = useState<'CURRENCY_PER_UNIT' | 'PERCENTAGE_OF_PRICE'>('CURRENCY_PER_UNIT');
  const [vcValue, setVcValue] = useState<number>(3.5);

  // Form State for Fixed Expense
  const [feName, setFeName] = useState('');
  const [feCategory, setFeCategory] = useState<FixedExpenseItem['category']>('FOLHA_PESSOAL');
  const [feValue, setFeValue] = useState<number>(5000);
  const [feChargesPct, setFeChargesPct] = useState<number>(68);
  const [feStartMonth, setFeStartMonth] = useState<number>(1);
  const [feIndexType, setFeIndexType] = useState<FixedExpenseItem['indexType']>('REAJUSTE_SALARIAL');

  const handleSaveTaxOverride = () => {
    const val = parseFloat(overrideInput);
    if (!isNaN(val) && val >= 0) {
      updateTaxRegime(taxRegime, simplesAnnex, val);
    } else {
      updateTaxRegime(taxRegime, simplesAnnex, null);
    }
  };

  const handleAddVc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vcName.trim() || !vcCatalogItemId) return;
    addVariableCost({
      id: `vc_${Date.now()}`,
      catalogItemId: vcCatalogItemId,
      name: vcName.trim(),
      category: vcCategory,
      calculationType: vcCalcType,
      value: Number(vcValue),
    });
    setVcName('');
  };

  const handleAddFe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feName.trim()) return;
    addFixedExpense({
      id: `fe_${Date.now()}`,
      name: feName.trim(),
      category: feCategory,
      baseMonthlyValue: Number(feValue),
      socialChargesPct: Number(feChargesPct),
      startMonth: Number(feStartMonth),
      indexType: feIndexType,
    });
    setFeName('');
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header Banner */}
      <div className="flex items-center gap-3">
        <div className={`p-2.5 border rounded-xl ${isDark ? 'bg-[#C87A54]/10 border-[#C87A54]/30 text-[#C87A54]' : 'bg-[#002D4A]/10 border-[#002D4A]/30 text-[#002D4A]'}`}>
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Especificações do Projeto & Custos</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Configuração 100% editável do regime tributário, prazos de capital de giro, custos variáveis e despesas fixas.
          </p>
        </div>
      </div>

      {/* Grid: Tax Specifications & Working Capital */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Regime Tributário */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <h3 className="font-bold text-base">Estrutura Tributária & Impostos sobre Vendas</h3>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Regime Tributário Ativo</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'SIMPLES_NACIONAL', label: 'Simples Nacional' },
                { key: 'LUCRO_PRESUMIDO', label: 'Lucro Presumido' },
                { key: 'LUCRO_REAL', label: 'Lucro Real' },
                { key: 'ISENTO', label: 'Isento' },
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => updateTaxRegime(r.key as TaxRegime, simplesAnnex, effectiveTaxRateOverridePct)}
                  className={`p-2.5 rounded-lg text-xs font-bold text-center border transition-all ${
                    taxRegime === r.key
                      ? isDark ? 'bg-[#C87A54] text-white border-[#C87A54]' : 'bg-[#002D4A] text-white border-[#002D4A]'
                      : isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Anexo do Simples Nacional</label>
              <select
                value={simplesAnnex}
                onChange={(e) => updateTaxRegime('SIMPLES_NACIONAL', e.target.value as SimplesAnnex, effectiveTaxRateOverridePct)}
                className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="ANEXO_I">Anexo I - Comércio (4.0% - 19.0%)</option>
                <option value="ANEXO_II">Anexo II - Indústria (4.5% - 30.0%)</option>
                <option value="ANEXO_III">Anexo III - Serviços e Software (6.0% - 33.0%)</option>
                <option value="ANEXO_IV">Anexo IV - Serviços com INSS Aparte (4.5% - 33.0%)</option>
                <option value="ANEXO_V">Anexo V - Serviços Fator R &lt; 28% (15.5% - 30.5%)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Alíquota Efetiva Customizada (%)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.1"
                    value={overrideInput}
                    onChange={(e) => setOverrideInput(e.target.value)}
                    className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-bold ${
                      isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    placeholder="Ex: 8.2"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
                </div>
                <button
                  onClick={handleSaveTaxOverride}
                  className={`px-3 py-2 rounded-lg text-xs font-bold text-white ${
                    isDark ? 'bg-[#C87A54]' : 'bg-[#002D4A]'
                  }`}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Capital de Giro (NCG) & CAPEX */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <h3 className="font-bold text-base">Necessidade de Capital de Giro & CAPEX</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Prazo Médio Recebimento (PMR)</label>
              <select
                value={pmrDays}
                onChange={(e) => updateWorkingCapital(Number(e.target.value), pmpDays, initialCashDeposit, initialCapex, monthlyDepreciation)}
                className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>À Vista (0 dias)</option>
                <option value={30}>30 Dias</option>
                <option value={60}>60 Dias</option>
                <option value={90}>90 Dias</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Prazo Médio Pagamento (PMP)</label>
              <select
                value={pmpDays}
                onChange={(e) => updateWorkingCapital(pmrDays, Number(e.target.value), initialCashDeposit, initialCapex, monthlyDepreciation)}
                className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>À Vista (0 dias)</option>
                <option value={30}>30 Dias</option>
                <option value={60}>60 Dias</option>
                <option value={90}>90 Dias</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Caixa Inicial (R$)</label>
              <input
                type="number"
                step="5000"
                value={initialCashDeposit}
                onChange={(e) => updateWorkingCapital(pmrDays, pmpDays, Number(e.target.value), initialCapex, monthlyDepreciation)}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>CAPEX Inicial (R$)</label>
              <input
                type="number"
                step="5000"
                value={initialCapex}
                onChange={(e) => updateWorkingCapital(pmrDays, pmpDays, initialCashDeposit, Number(e.target.value), monthlyDepreciation)}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Depreciação/Mês (R$)</label>
              <input
                type="number"
                step="500"
                value={monthlyDepreciation}
                onChange={(e) => updateWorkingCapital(pmrDays, pmpDays, initialCashDeposit, initialCapex, Number(e.target.value))}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Custos Variáveis (CPV / CSV) */}
      <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <div>
              <h3 className="font-bold text-base">Custos Variáveis por Item de Produto/Serviço (CPV / CSV)</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Insumos, comissões de vendas e taxas de cartão vinculadas às vendas.</p>
            </div>
          </div>
        </div>

        {/* Add VC Form */}
        <form onSubmit={handleAddVc} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-xl border bg-slate-500/5 border-slate-500/20">
          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Descrição do Custo</label>
            <input
              type="text"
              placeholder="Ex: Embalagem Térmica"
              value={vcName}
              onChange={(e) => setVcName(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Item do Catálogo</label>
            <select
              value={vcCatalogItemId}
              onChange={(e) => setVcCatalogItemId(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {catalogItems.map((ci) => (
                <option key={ci.id} value={ci.id}>
                  {ci.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipo de Cálculo</label>
            <select
              value={vcCalcType}
              onChange={(e) => setVcCalcType(e.target.value as any)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="CURRENCY_PER_UNIT">Valor Fixo (R$ / unidade)</option>
              <option value="PERCENTAGE_OF_PRICE">% sobre o Preço de Venda</option>
            </select>
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Valor ({vcCalcType === 'CURRENCY_PER_UNIT' ? 'R$' : '%'})</label>
            <input
              type="number"
              step="0.1"
              value={vcValue}
              onChange={(e) => setVcValue(Number(e.target.value))}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-1.5 font-bold py-2 rounded-lg text-xs text-white ${
                isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Custo</span>
            </button>
          </div>
        </form>

        {/* VC Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <th className="p-3">Descrição do Custo</th>
                <th className="p-3">Item Vinculado</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Valor Unitário</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
              {variableCosts.map((vc) => {
                const linkedItem = catalogItems.find((ci) => ci.id === vc.catalogItemId);
                return (
                  <tr key={vc.id} className={isDark ? 'hover:bg-[#182129]/50' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-semibold">{vc.name}</td>
                    <td className="p-3 font-medium text-slate-400">{linkedItem ? linkedItem.name : '—'}</td>
                    <td className="p-3 text-[11px] text-slate-400">{vc.category.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-right font-bold text-amber-500">
                      {vc.calculationType === 'CURRENCY_PER_UNIT' ? `R$ ${vc.value.toFixed(2)} /un` : `${vc.value}% do preço`}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => deleteVariableCost(vc.id)} className="text-red-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 4: Despesas Fixas Operacionais */}
      <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <div>
              <h3 className="font-bold text-base">Despesas Fixas Operacionais & Encargos Trabalhistas</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Folha de pagamento, pró-labore, aluguel, TI e marketing.</p>
            </div>
          </div>
        </div>

        {/* Add FE Form */}
        <form onSubmit={handleAddFe} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-xl border bg-slate-500/5 border-slate-500/20">
          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Descrição da Despesa</label>
            <input
              type="text"
              placeholder="Ex: Aluguel do Galpão"
              value={feName}
              onChange={(e) => setFeName(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Valor Base Mensal (R$)</label>
            <input
              type="number"
              step="500"
              value={feValue}
              onChange={(e) => setFeValue(Number(e.target.value))}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Encargos (%)</label>
            <input
              type="number"
              step="1"
              value={feChargesPct}
              onChange={(e) => setFeChargesPct(Number(e.target.value))}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              placeholder="Ex: 68% folha"
            />
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Categoria</label>
            <select
              value={feCategory}
              onChange={(e) => setFeCategory(e.target.value as any)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="FOLHA_PESSOAL">Folha de Pessoal</option>
              <option value="ESTRUTURA_OCUPACAO">Estrutura e Ocupação</option>
              <option value="SERVICOS_TERCEIROS_TI">Serviços Terceiros / TI</option>
              <option value="MARKETING_VENDAS">Marketing e Vendas</option>
              <option value="DESPESAS_DIVERSAS">Despesas Diversas</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-1.5 font-bold py-2 rounded-lg text-xs text-white ${
                isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Despesa</span>
            </button>
          </div>
        </form>

        {/* FE Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <th className="p-3">Descrição da Despesa</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Valor Base</th>
                <th className="p-3 text-right">Encargos (%)</th>
                <th className="p-3 text-right font-bold">Custo Total Mensal</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
              {fixedExpenses.map((fe) => {
                const totalCost = fe.baseMonthlyValue * (1 + fe.socialChargesPct / 100);
                return (
                  <tr key={fe.id} className={isDark ? 'hover:bg-[#182129]/50' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-semibold">{fe.name}</td>
                    <td className="p-3 text-slate-400">{fe.category.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-right">R$ {fe.baseMonthlyValue.toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-right text-slate-400">+{fe.socialChargesPct}%</td>
                    <td className="p-3 text-right font-bold text-rose-500">R$ {totalCost.toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => deleteFixedExpense(fe.id)} className="text-red-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
