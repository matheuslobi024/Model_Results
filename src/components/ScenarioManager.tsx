import React, { useState } from 'react';
import { GitBranch, Plus, Sliders, TrendingUp, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

export const ScenarioManager: React.FC = () => {
  const {
    themeMode,
    scenarios,
    activeScenarioId,
    catalogItems,
    salesProjections,
    computedSummaries,
    setActiveScenario,
    addScenario,
    updateScenarioMultipliers,
    updateSalesProjection,
  } = useFinancialStore();

  const isDark = themeMode === 'dark';

  const [newScenarioName, setNewScenarioName] = useState('');
  const [cloneFromId, setCloneFromId] = useState<string>('sc_base');
  const [editingProjectionScenarioId, setEditingProjectionScenarioId] = useState<string>(activeScenarioId);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioName.trim()) return;
    addScenario(newScenarioName.trim(), cloneFromId);
    setNewScenarioName('');
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header Banner */}
      <div className="flex items-center gap-3">
        <div className={`p-2.5 border rounded-xl ${isDark ? 'bg-[#C87A54]/10 border-[#C87A54]/30 text-[#C87A54]' : 'bg-[#002D4A]/10 border-[#002D4A]/30 text-[#002D4A]'}`}>
          <GitBranch className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestor de Cenários & Análise de Sensibilidade</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Crie cenários ilimitados, ajuste multiplicadores de preços/custos e edite a curva de volumes mensais por produto.
          </p>
        </div>
      </div>

      {/* Grid: Scenario Selector/Creator & Sensitivity Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Seleção e Criação de Cenários */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className="font-bold text-base">Cenários de Simulação Cadastrados</h3>

          <div className="flex flex-wrap gap-2">
            {scenarios.map((sc) => {
              const isActive = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                    isActive
                      ? isDark ? 'bg-[#C87A54] text-white border-[#C87A54]' : 'bg-[#002D4A] text-white border-[#002D4A]'
                      : isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {sc.name}
                  {sc.isDefault && <span className="ml-1 opacity-60 text-[10px]">(Padrão)</span>}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCreateScenario} className="pt-2 border-t border-slate-500/20 space-y-3">
            <h4 className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Criar Novo Cenário Personalizado</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nome do novo cenário..."
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                className={`px-3 py-2 border rounded-lg text-xs outline-none font-semibold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />

              <select
                value={cloneFromId}
                onChange={(e) => setCloneFromId(e.target.value)}
                className={`px-3 py-2 border rounded-lg text-xs outline-none ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    Clonar volumes de: {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-1.5 font-bold py-2.5 rounded-lg text-xs text-white ${
                isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Salvar e Ativar Novo Cenário</span>
            </button>
          </form>
        </div>

        {/* Card 2: Multiplicadores de Sensibilidade do Cenário Ativo */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Sensibilidade do Cenário Ativo: <span className="text-emerald-500">{activeScenario?.name}</span></h3>
            <span className="text-[11px] text-slate-400 font-mono">ID: {activeScenario?.id}</span>
          </div>

          {/* Slider Preços */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Multiplicador de Preços de Venda:</span>
              <span className="font-bold text-emerald-500 font-mono">
                {activeScenario ? (activeScenario.priceGrowthMultiplier * 100).toFixed(0) : 100}%
                ({activeScenario && activeScenario.priceGrowthMultiplier >= 1 ? '+' : ''}
                {activeScenario ? ((activeScenario.priceGrowthMultiplier - 1) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={activeScenario?.priceGrowthMultiplier || 1.0}
              onChange={(e) =>
                updateScenarioMultipliers(activeScenarioId, Number(e.target.value), activeScenario?.costGrowthMultiplier || 1.0)
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider Custos */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Multiplicador de Custos Variáveis:</span>
              <span className="font-bold text-rose-400 font-mono">
                {activeScenario ? (activeScenario.costGrowthMultiplier * 100).toFixed(0) : 100}%
                ({activeScenario && activeScenario.costGrowthMultiplier >= 1 ? '+' : ''}
                {activeScenario ? ((activeScenario.costGrowthMultiplier - 1) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={activeScenario?.costGrowthMultiplier || 1.0}
              onChange={(e) =>
                updateScenarioMultipliers(activeScenarioId, activeScenario?.priceGrowthMultiplier || 1.0, Number(e.target.value))
              }
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Tabela Comparativa de Sensibilidade entre TODOS os Cenários */}
      <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h3 className="font-bold text-base">Matriz Comparativa de Resultados por Cenário</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <th className="p-3">Cenário</th>
                <th className="p-3 text-right">Mult. Preço</th>
                <th className="p-3 text-right">Mult. Custo</th>
                <th className="p-3 text-right">Receita Bruta Anual</th>
                <th className="p-3 text-right">Lucro Líquido Anual</th>
                <th className="p-3 text-right">Margem Líquida</th>
                <th className="p-3 text-right">Menor Saldo de Caixa</th>
                <th className="p-3 text-center">Status Insolvência</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
              {scenarios.map((sc) => {
                const sum = computedSummaries[sc.id];
                const isCurrentActive = sc.id === activeScenarioId;

                return (
                  <tr key={sc.id} className={isCurrentActive ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50') : ''}>
                    <td className="p-3 font-bold flex items-center gap-2">
                      <span>{sc.name}</span>
                      {isCurrentActive && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">Ativo</span>}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold">{(sc.priceGrowthMultiplier * 100).toFixed(0)}%</td>
                    <td className="p-3 text-right font-mono font-semibold">{(sc.costGrowthMultiplier * 100).toFixed(0)}%</td>
                    <td className="p-3 text-right font-bold">R$ {sum ? (sum.annualGrossRevenue / 1000).toFixed(0) : '0'}k</td>
                    <td className="p-3 text-right font-bold text-emerald-500">R$ {sum ? (sum.annualNetIncome / 1000).toFixed(0) : '0'}k</td>
                    <td className="p-3 text-right font-semibold">{sum ? sum.netMarginPct.toFixed(1) : '0'}%</td>
                    <td className={`p-3 text-right font-bold ${sum && sum.lowestCashBalance < 0 ? 'text-red-500' : 'text-slate-300'}`}>
                      R$ {sum ? (sum.lowestCashBalance / 1000).toFixed(0) : '0'}k
                    </td>
                    <td className="p-3 text-center">
                      {sum && sum.hasInsolvencyRisk ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Risco Caixa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Solvente
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 4: Matriz de Projeção de Volumes de Vendas Mensais (Meses 1 a 12) */}
      <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base">Curva de Projeção de Volumes Mensais de Vendas (Meses 1 a 12)</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Edite diretamente o volume projetado para cada mês e produto do cenário selecionado.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Editar volumes para:</span>
            <select
              value={editingProjectionScenarioId}
              onChange={(e) => setEditingProjectionScenarioId(e.target.value)}
              className={`px-3 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <th className="p-2 min-w-[160px]">Produto / Serviço</th>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <th key={m} className="p-2 text-center font-mono">
                    Mês {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
              {catalogItems.map((item) => (
                <tr key={item.id} className={isDark ? 'hover:bg-[#182129]/50' : 'hover:bg-slate-50'}>
                  <td className="p-2 font-bold">{item.name}</td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                    const proj = salesProjections.find(
                      (p) => p.scenarioId === editingProjectionScenarioId && p.catalogItemId === item.id && p.monthIndex === m
                    );
                    const vol = proj ? proj.projectedVolume : 0;

                    return (
                      <td key={m} className="p-1 text-center">
                        <input
                          type="number"
                          step="100"
                          value={vol}
                          onChange={(e) =>
                            updateSalesProjection(editingProjectionScenarioId, item.id, m, Math.max(0, Number(e.target.value)))
                          }
                          className={`w-16 px-1 py-1 text-center border rounded text-[11px] font-mono outline-none ${
                            isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
