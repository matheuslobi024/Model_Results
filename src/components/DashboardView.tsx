import React from 'react';
import { KpiCard } from './KpiCard';
import { useFinancialStore } from '../store/financialStore';
import { Download, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeScenarioId, computedSummaries, scenarios, themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const summary = computedSummaries[activeScenarioId] || Object.values(computedSummaries)[0];

  const handleDownloadPdf = () => {
    window.open('/Relatorio_Executivo_Model_Results.pdf', '_blank');
  };

  const netIncome = summary ? summary.annualNetIncome : 796340;
  const netMarginPct = summary ? summary.netMarginPct.toFixed(1) : "14.2";
  const grossRevenue = summary ? summary.annualGrossRevenue : 5600000;
  const ebitdaMarginPct = summary ? summary.ebitdaMarginPct.toFixed(1) : "17.2";
  const lowestCash = summary ? summary.lowestCashBalance : 150000;

  return (
    <div className={`p-6 space-y-6 max-w-7xl mx-auto ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard Executivo de Viabilidade</h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Projeções calculadas ao vivo para o cenário <span className="font-bold text-emerald-500">{activeScenario?.name}</span>.
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md text-white ${
            isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Baixar Relatório Executivo em PDF</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Resultado Líquido Projetado"
          value={`R$ ${(netIncome / 1000).toFixed(0)}k`}
          subtitle={`Margem Líquida: ${netMarginPct}%`}
          highlight
        />
        <KpiCard
          title="Receita Bruta Anual"
          value={`R$ ${(grossRevenue / 1000000).toFixed(2)}M`}
          subtitle="Projeção para os 12 meses"
        />
        <KpiCard
          title="Margem EBITDA"
          value={`${ebitdaMarginPct}%`}
          subtitle="EBITDA Operacional"
        />
        <KpiCard
          title="Menor Saldo de Caixa"
          value={`R$ ${(lowestCash / 1000).toFixed(0)}k`}
          subtitle="Projetado para o Mês 1"
        />
      </div>

      {/* Dynamic Comparative Table across All Scenarios */}
      <div className={`p-6 rounded-xl border shadow-sm ${
        isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Análise Comparativa de Cenários Dinâmicos (DRE Waterfall)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`uppercase tracking-wider border-b ${
                isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                <th className="p-3">Cenário</th>
                <th className="p-3 text-right">Receita Bruta</th>
                <th className="p-3 text-right">Resultado Líquido</th>
                <th className="p-3 text-right">Margem Líquida</th>
                <th className="p-3 text-right">Margem EBITDA</th>
                <th className="p-3 text-right">Menor Saldo Caixa</th>
                <th className="p-3 text-center">Status Liquidez</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
              {scenarios.map((sc) => {
                const sum = computedSummaries[sc.id];
                const isActive = sc.id === activeScenarioId;

                return (
                  <tr key={sc.id} className={isActive ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50') : ''}>
                    <td className="p-3 font-bold flex items-center gap-2">
                      <span className={isDark ? 'text-white' : 'text-slate-900'}>{sc.name}</span>
                      {isActive && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-semibold">Ativo</span>}
                    </td>
                    <td className="p-3 text-right font-bold">R$ {sum ? (sum.annualGrossRevenue / 1000).toFixed(0) : '0'}k</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">R$ {sum ? (sum.annualNetIncome / 1000).toFixed(0) : '0'}k</td>
                    <td className="p-3 text-right font-semibold">{sum ? sum.netMarginPct.toFixed(1) : '0'}%</td>
                    <td className="p-3 text-right font-semibold">{sum ? sum.ebitdaMarginPct.toFixed(1) : '0'}%</td>
                    <td className={`p-3 text-right font-bold ${sum && sum.lowestCashBalance < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-300'}`}>
                      R$ {sum ? (sum.lowestCashBalance / 1000).toFixed(0) : '0'}k
                    </td>
                    <td className="p-3 text-center">
                      {sum && sum.hasInsolvencyRisk ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Alerta de Caixa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
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
    </div>
  );
};
