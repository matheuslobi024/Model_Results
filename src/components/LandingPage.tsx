import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface LandingPageProps {
  onStartClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartClick }) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#182129] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-8 flex justify-center">
            <img
              src={isDark ? "/logo-dark-full.jpg" : "/logo-light-full.jpg"}
              alt="Model Results Logo Full"
              className="h-28 w-auto object-contain"
            />
          </div>

          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border ${
            isDark
              ? 'bg-[#C87A54]/10 border-[#C87A54]/30 text-[#E8A27C]'
              : 'bg-[#002D4A]/10 border-[#002D4A]/30 text-[#002D4A]'
          }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            Simulação Financeira de Alta Precisão
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Valoração e Análise de Risco para Novos Negócios
          </h1>

          <p className={`mt-6 text-lg max-w-3xl mx-auto font-normal leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Combine premissas macroeconômicas, tributárias e operacionais em um painel interativo com projeções automáticas de DRE, Fluxo de Caixa (DFC) e Análise de Sensibilidade.
          </p>

          <div className="mt-10 flex justify-center">
            <button
              onClick={onStartClick}
              className={`flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl hover:scale-105 text-white ${
                isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
              }`}
            >
              <span>Acessar o Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 max-w-6xl mx-auto border-t ${isDark ? 'border-[#2D3945]' : 'border-slate-200'}`}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold">Fundamentação Metodológica Consagrada</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>O sistema combina a teoria consagrada de finanças às diretrizes dos maiores órgãos do setor.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "NYU Stern / Damodaran", desc: "Fluxo de Caixa Descontado (DCF), WACC e múltiplos de mercado." },
            { title: "SEBRAE Nacional", desc: "Métricas de viabilidade e indicadores para concessão de crédito bancário." },
            { title: "FGV IBRE", desc: "Tendências conjunturais, monitor da atividade econômica e projeções de inflação." },
            { title: "Strategyzer Canvas", desc: "Conversão direta dos 9 blocos estratégicos em premissas financeiras quantitativas." },
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
              <CheckCircle2 className={`w-8 h-8 mb-3 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
              <h3 className="font-bold text-base">{item.title}</h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
