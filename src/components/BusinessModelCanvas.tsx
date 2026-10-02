import React, { useState } from 'react';
import { LayoutGrid, Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';
import { CanvasBlock } from '../types/financial';

interface BlockConfig {
  key: CanvasBlock;
  title: string;
  subtitle: string;
  gridArea?: string;
  badgeBg: string;
}

const BLOCKS: BlockConfig[] = [
  { key: 'KEY_PARTNERS', title: '1. Parcerias Chave', subtitle: 'Fornecedores & Aliados', badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { key: 'KEY_ACTIVITIES', title: '2. Atividades Chave', subtitle: 'Ações vitais do negócio', badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { key: 'KEY_RESOURCES', title: '3. Recursos Chave', subtitle: 'Ativos indispensáveis', badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  { key: 'VALUE_PROPOSITIONS', title: '4. Proposta de Valor', subtitle: 'Solução & Benefícios', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { key: 'CUSTOMER_RELATIONSHIPS', title: '5. Relacionamento', subtitle: 'Conexão com cliente', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { key: 'CHANNELS', title: '6. Canais de Vendas', subtitle: 'Pontos de contato', badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  { key: 'CUSTOMER_SEGMENTS', title: '7. Segmentos de Clientes', subtitle: 'Público-alvo & nichos', badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { key: 'COST_STRUCTURE', title: '8. Estrutura de Custos', subtitle: 'Despesas & Insumos', badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { key: 'REVENUE_STREAMS', title: '9. Fontes de Receita', subtitle: 'Monetização & Vendas', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
];

export const BusinessModelCanvasComponent: React.FC = () => {
  const { themeMode, canvasItems, addCanvasItem, deleteCanvasItem, catalogItems, fixedExpenses } = useFinancialStore();
  const isDark = themeMode === 'dark';

  const [activeAddingBlock, setActiveAddingBlock] = useState<CanvasBlock | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (block: CanvasBlock) => {
    if (!newItemText.trim()) return;
    addCanvasItem(block, newItemText.trim());
    setNewItemText('');
    setActiveAddingBlock(null);
  };

  return (
    <div className={`p-6 rounded-xl border space-y-6 ${isDark ? 'bg-[#202B36] border-[#2D3945] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LayoutGrid className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
          <div>
            <h3 className="font-bold text-base">Strategyzer Business Model Canvas (9 Blocos)</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Mapeamento visual dos pilares estratégicos diretamente sincronizado com a modelagem financeira.
            </p>
          </div>
        </div>
        <span className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
          isDark ? 'bg-[#C87A54]/10 text-[#E8A27C] border-[#C87A54]/30' : 'bg-[#002D4A]/10 text-[#002D4A] border-[#002D4A]/30'
        }`}>
          <Sparkles className="w-4 h-4" />
          Mapeamento Ativo
        </span>
      </div>

      {/* 9-Block Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {BLOCKS.slice(0, 7).map((blk) => {
          const items = canvasItems.filter((i) => i.block === blk.key);
          return (
            <div
              key={blk.key}
              className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-[160px] ${
                isDark ? 'bg-[#182129] border-[#2D3945]' : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${blk.badgeBg}`}>
                    {blk.title}
                  </span>
                  <button
                    onClick={() => setActiveAddingBlock(activeAddingBlock === blk.key ? null : blk.key)}
                    className={`p-1 rounded hover:bg-slate-700/20 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                    title="Adicionar item"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className={`text-[10px] font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{blk.subtitle}</p>

                <div className="space-y-1.5 mb-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`group flex items-start justify-between p-2 rounded text-xs leading-tight border transition-all ${
                        isDark ? 'bg-[#202B36] border-[#2D3945] text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <span className="flex-1 pr-1">{item.text}</span>
                      <button
                        onClick={() => deleteCanvasItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-0.5 transition-opacity"
                        title="Excluir item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {activeAddingBlock === blk.key && (
                <div className="mt-2 pt-2 border-t border-slate-700/30">
                  <input
                    type="text"
                    placeholder="Novo item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(blk.key)}
                    className={`w-full px-2 py-1 text-xs border rounded outline-none mb-1 ${
                      isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    autoFocus
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setActiveAddingBlock(null)}
                      className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleAddItem(blk.key)}
                      className={`px-2 py-0.5 text-[10px] font-bold text-white rounded ${
                        isDark ? 'bg-[#C87A54]' : 'bg-[#002D4A]'
                      }`}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Financial Blocks: Cost Structure & Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {BLOCKS.slice(7, 9).map((blk) => {
          const items = canvasItems.filter((i) => i.block === blk.key);
          const isRevenue = blk.key === 'REVENUE_STREAMS';

          return (
            <div
              key={blk.key}
              className={`p-4 rounded-xl border min-h-[160px] flex flex-col justify-between ${
                isDark ? 'bg-[#182129] border-[#2D3945]' : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded ${blk.badgeBg}`}>
                      {blk.title}
                    </span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{blk.subtitle}</span>
                  </div>
                  <button
                    onClick={() => setActiveAddingBlock(activeAddingBlock === blk.key ? null : blk.key)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border ${
                      isDark ? 'bg-[#202B36] border-[#2D3945] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {/* Sincronização Dinâmica com o Catálogo / Finanças */}
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <span className="font-bold text-emerald-500 flex items-center gap-1 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    {isRevenue ? 'Fontes Conectadas ao Catálogo:' : 'Custos Conectados às Finanças:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {isRevenue
                      ? catalogItems.map((ci) => (
                          <span key={ci.id} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                            {ci.name} (R$ {ci.unitSellingPrice.toFixed(2)})
                          </span>
                        ))
                      : fixedExpenses.map((fe) => (
                          <span key={fe.id} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-semibold">
                            {fe.name} (R$ {fe.baseMonthlyValue.toLocaleString('pt-BR')}/mês)
                          </span>
                        ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`group flex items-start justify-between p-2 rounded text-xs border ${
                        isDark ? 'bg-[#202B36] border-[#2D3945] text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <span className="flex-1 pr-1">{item.text}</span>
                      <button
                        onClick={() => deleteCanvasItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {activeAddingBlock === blk.key && (
                <div className="mt-3 pt-2 border-t border-slate-700/30 flex gap-2">
                  <input
                    type="text"
                    placeholder="Descreva a premissa de custo/receita..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(blk.key)}
                    className={`flex-1 px-3 py-1.5 text-xs border rounded outline-none ${
                      isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddItem(blk.key)}
                    className={`px-4 py-1.5 text-xs font-bold text-white rounded ${
                      isDark ? 'bg-[#C87A54]' : 'bg-[#002D4A]'
                    }`}
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
