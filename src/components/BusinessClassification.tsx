import React, { useState } from 'react';
import { Sliders, Building2, Calendar, TrendingUp, Plus, Trash2, Edit2, DollarSign, Package } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';
import { BusinessModelCanvasComponent } from './BusinessModelCanvas';
import { BusinessType } from '../types/financial';

export const BusinessClassification: React.FC = () => {
  const {
    themeMode,
    projectName,
    businessType,
    timeHorizonYears,
    macroAssumptions,
    catalogItems,
    updateProjectMetadata,
    updateMacroAssumptions,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
  } = useFinancialStore();

  const isDark = themeMode === 'dark';

  // State for Catalog Item Form
  const [newItemName, setNewItemText] = useState('');
  const [newItemType, setNewItemType] = useState<'PRODUTO' | 'SERVICO'>('PRODUTO');
  const [newItemPrice, setNewItemPrice] = useState<number>(20.0);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemPrice <= 0) return;
    addCatalogItem({
      id: `prod_${Date.now()}`,
      name: newItemName.trim(),
      itemType: newItemType,
      unitSellingPrice: Number(newItemPrice),
    });
    setNewItemText('');
    setNewItemPrice(20.0);
  };

  const handleSavePriceEdit = (id: string) => {
    if (editPriceVal > 0) {
      updateCatalogItem(id, { unitSellingPrice: editPriceVal });
    }
    setEditingItemId(null);
  };

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 border rounded-xl ${isDark ? 'bg-[#C87A54]/10 border-[#C87A54]/30 text-[#C87A54]' : 'bg-[#002D4A]/10 border-[#002D4A]/30 text-[#002D4A]'}`}>
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Classificação do Negócio & Canvas Estratégico</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Defina o perfil do empreendimento, premissas macroeconômicas, catálogo de ofertas e mapeamento do Business Model Canvas.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Business Profile & Macroeconomic Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Perfil do Empreendimento */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <h3 className="font-bold text-base">Perfil do Empreendimento</h3>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nome do Projeto / Empresa</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => updateProjectMetadata(e.target.value, businessType, timeHorizonYears)}
              className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipo de Negócio</label>
              <select
                value={businessType}
                onChange={(e) => updateProjectMetadata(projectName, e.target.value as BusinessType, timeHorizonYears)}
                className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="COMERCIO">Comércio (Venda de Produtos)</option>
                <option value="SERVICOS">Prestação de Serviços</option>
                <option value="INDUSTRIA">Indústria e Transformação</option>
                <option value="PROJETO">Projeto / Startup Especial</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Horizonte de Projeção</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={timeHorizonYears}
                  onChange={(e) => updateProjectMetadata(projectName, businessType, Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs border rounded-lg outline-none font-semibold ${
                    isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {[1, 2, 3, 5, 10].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === 1 ? 'Ano (12 Meses)' : 'Anos'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Premissas Macroeconômicas */}
        <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <h3 className="font-bold text-base">Premissas Macroeconômicas de Referência</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'IPCA (% a.a.)', key: 'ipcaPct', val: macroAssumptions.ipcaPct },
              { label: 'IGP-M (% a.a.)', key: 'igpmPct', val: macroAssumptions.igpmPct },
              { label: 'Taxa SELIC (%)', key: 'selicPct', val: macroAssumptions.selicPct },
              { label: 'CDI (%)', key: 'cdiPct', val: macroAssumptions.cdiPct },
              { label: 'Câmbio USD/BRL', key: 'usdRate', val: macroAssumptions.usdRate },
              { label: 'Reajuste Salarial (%)', key: 'salaryIncreasePct', val: macroAssumptions.salaryIncreasePct },
            ].map((m) => (
              <div key={m.key} className={`p-2.5 rounded-lg border ${isDark ? 'bg-[#182129] border-[#2D3945]' : 'bg-slate-50 border-slate-200'}`}>
                <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={m.val}
                  onChange={(e) => updateMacroAssumptions({ [m.key]: Number(e.target.value) })}
                  className={`w-full px-2 py-1 text-xs border rounded font-bold outline-none ${
                    isDark ? 'bg-[#202B36] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Catálogo de Produtos e Serviços */}
      <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className={`w-5 h-5 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
            <div>
              <h3 className="font-bold text-base">Catálogo de Produtos & Serviços Comercializados</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Cadastre e edite os itens que compõem a receita do negócio.</p>
            </div>
          </div>
        </div>

        {/* Add Catalog Item Form */}
        <form onSubmit={handleAddCatalogItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border bg-slate-500/5 border-slate-500/20">
          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nome do Item</label>
            <input
              type="text"
              placeholder="Ex: Combo Almoço Executivo"
              value={newItemName}
              onChange={(e) => setNewItemText(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipo de Item</label>
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as any)}
              className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none ${
                isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="PRODUTO">Produto Físico</option>
              <option value="SERVICO">Serviço / Assinatura</option>
            </select>
          </div>

          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Preço de Venda Unitário (R$)</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">R$</span>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className={`w-full pl-8 pr-3 py-1.5 text-xs border rounded-lg outline-none font-bold ${
                  isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-1.5 font-bold py-2 rounded-lg text-xs text-white transition-all ${
                isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar ao Catálogo</span>
            </button>
          </div>
        </form>

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#182129] text-slate-300 border-[#2D3945]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                <th className="p-3">Nome do Item</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-right">Preço de Venda Unitário</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#2D3945] text-slate-200' : 'divide-slate-200 text-slate-800'}`}>
              {catalogItems.map((item) => (
                <tr key={item.id} className={isDark ? 'hover:bg-[#182129]/50' : 'hover:bg-slate-50'}>
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.itemType === 'PRODUTO' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {item.itemType}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-500">
                    {editingItemId === item.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={editPriceVal}
                          onChange={(e) => setEditPriceVal(Number(e.target.value))}
                          className={`w-24 px-2 py-0.5 border rounded text-xs outline-none ${
                            isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePriceEdit(item.id)}
                          className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span>R$ {item.unitSellingPrice.toFixed(2)}</span>
                        <button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setEditPriceVal(item.unitSellingPrice);
                          }}
                          className="text-slate-400 hover:text-slate-200"
                          title="Editar preço"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteCatalogItem(item.id)}
                      className="text-red-400 hover:text-red-500 p-1"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9-Block Strategyzer Canvas */}
      <BusinessModelCanvasComponent />
    </div>
  );
};
