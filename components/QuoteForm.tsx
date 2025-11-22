
import React, { useState } from 'react';
import { QuoteData, QuoteItem, QuoteSection, SupplyConditions, QuoteSupplemental } from '../types';
import { Plus, Trash2, Layers, FolderPlus, Wand2, Loader2, Coins, Truck } from 'lucide-react';
import { suggestDescription } from '../services/geminiService';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ data, onChange }) => {
    const [loadingSuggestion, setLoadingSuggestion] = useState<string | null>(null);

  const updateClient = (field: keyof typeof data.client, value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const updateConditions = (field: keyof SupplyConditions, value: string) => {
      onChange({ ...data, conditions: { ...data.conditions, [field]: value } });
  };

  // -- Section Management --

  const addSection = () => {
    const newSection: QuoteSection = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Área ${data.sections.length + 1}`,
        areaSize: 0,
        description: "Descrição da área...",
        items: [],
        supplemental: []
    };
    onChange({ ...data, sections: [...data.sections, newSection] });
  };

  const removeSection = (sectionId: string) => {
      if (data.sections.length <= 1) {
          alert("É necessário ter pelo menos uma seção no orçamento.");
          return;
      }
      if (confirm("Tem certeza que deseja remover esta área inteira do orçamento?")) {
        onChange({ ...data, sections: data.sections.filter(s => s.id !== sectionId) });
      }
  };

  const updateSection = (sectionId: string, field: keyof QuoteSection, value: string | number) => {
      onChange({
          ...data,
          sections: data.sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s)
      });
  };

  // -- Item Management --

  const addItemToSection = (sectionId: string) => {
    const newItem: QuoteItem = {
        id: Math.random().toString(36).substr(2, 9),
        product: "Novo Produto",
        description: "Descrição do produto",
        packagingType: "Emb.",
        packagingWeight: 1,
        pricePerKg: 0,
        ipi: 0,
        icms: 0,
        kits: 1
    };

    onChange({
        ...data,
        sections: data.sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, items: [...s.items, newItem] };
            }
            return s;
        })
    });
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof QuoteItem,
    value: string | number
  ) => {
    onChange({
        ...data,
        sections: data.sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    items: s.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
                };
            }
            return s;
        })
    });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    onChange({
        ...data,
        sections: data.sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    items: s.items.filter(item => item.id !== itemId)
                };
            }
            return s;
        })
    });
  };

    const handleAiDescription = async (sectionId: string, itemId: string, currentVal: string) => {
      setLoadingSuggestion(itemId);
      const suggested = await suggestDescription('material', currentVal);
      updateItem(sectionId, itemId, 'description', suggested);
      setLoadingSuggestion(null);
    };

    // -- Supplemental Fields Management (Section) --

    const addSupplementalToSection = (sectionId: string) => {
        const newSup: QuoteSupplemental = {
            id: Math.random().toString(36).substr(2, 9),
            description: "DIFAL / ST",
            value: 0
        };

        onChange({
            ...data,
            sections: data.sections.map(s => {
                if (s.id === sectionId) {
                    return { ...s, supplemental: [...(s.supplemental || []), newSup] };
                }
                return s;
            })
        });
    };

    const updateSupplemental = (sectionId: string, supId: string, field: keyof QuoteSupplemental, value: string | number) => {
         onChange({
            ...data,
            sections: data.sections.map(s => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        supplemental: (s.supplemental || []).map(sup => sup.id === supId ? { ...sup, [field]: value } : sup)
                    };
                }
                return s;
            })
        });
    };

    const removeSupplemental = (sectionId: string, supId: string) => {
        onChange({
            ...data,
            sections: data.sections.map(s => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        supplemental: (s.supplemental || []).filter(sup => sup.id !== supId)
                    };
                }
                return s;
            })
        });
    };

    // -- Global Extras Management (Freight) --

    const addGlobalExtra = () => {
        const newExtra: QuoteSupplemental = {
            id: Math.random().toString(36).substr(2, 9),
            description: "Frete / Outros",
            value: 0
        };
        onChange({ ...data, globalExtras: [...(data.globalExtras || []), newExtra] });
    };

    const updateGlobalExtra = (extraId: string, field: keyof QuoteSupplemental, value: string | number) => {
        onChange({
            ...data,
            globalExtras: (data.globalExtras || []).map(ex => ex.id === extraId ? { ...ex, [field]: value } : ex)
        });
    };

    const removeGlobalExtra = (extraId: string) => {
        onChange({
            ...data,
            globalExtras: (data.globalExtras || []).filter(ex => ex.id !== extraId)
        });
    };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cabeçalho da Proposta</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Referência</label>
                <input
                    type="text"
                    value={data.reference}
                    onChange={(e) => onChange({...data, reference: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Assunto</label>
                <input
                    type="text"
                    value={data.subject}
                    onChange={(e) => onChange({...data, subject: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                />
            </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Data</label>
                <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChange({...data, date: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                />
            </div>
        </div>

        <h4 className="text-sm font-bold text-gray-700 mt-6 mb-3 border-b pb-2">Dados do Cliente</h4>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nome / Empresa</label>
            <input
              type="text"
              value={data.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">A/C (Contato)</label>
                <input
                type="text"
                value={data.client.contact}
                onChange={(e) => updateClient('contact', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                />
            </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Telefone</label>
                <input
                type="text"
                value={data.client.phone}
                onChange={(e) => updateClient('phone', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Endereço Completo (Cliente)</label>
            <input
              type="text"
              value={data.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
            />
          </div>
        </div>
      </div>

      {/* SECTIONS Loop */}
      {data.sections.map((section, index) => (
        <div key={section.id} className="bg-white p-6 rounded-lg shadow-md border border-blue-100 relative">
            {/* Section Header */}
            <div className="flex flex-col gap-3 mb-6 bg-blue-50 -mx-6 -mt-6 p-4 rounded-t-lg border-b border-blue-100">
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                            {index + 1}
                        </div>
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            className="bg-transparent border-none focus:ring-0 font-bold text-blue-800 text-lg p-0 w-32"
                        />
                     </div>
                     <button 
                        onClick={() => removeSection(section.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Remover área"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <label className="block text-[10px] text-blue-600 font-bold uppercase mb-1">Área Total (m²)</label>
                        <input
                            type="number"
                            value={section.areaSize}
                            onChange={(e) => updateSection(section.id, 'areaSize', parseFloat(e.target.value) || 0)}
                            className="w-full border-blue-300 rounded-md text-sm p-1.5 border focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="col-span-9">
                        <label className="block text-[10px] text-blue-600 font-bold uppercase mb-1">Descrição da Área / Serviço</label>
                        <input
                            type="text"
                            value={section.description}
                            onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                            className="w-full border-blue-300 rounded-md text-sm p-1.5 border focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Materials Table */}
            <div>
                <div className="space-y-4 mb-4">
                {section.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 relative group">
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeItem(section.id, item.id)} className="text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm border">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-3 mb-2">
                             <div className="col-span-4">
                                <label className="block text-[9px] text-gray-500 uppercase">Produto</label>
                                <input
                                    type="text"
                                    value={item.product}
                                    onChange={(e) => updateItem(section.id, item.id, 'product', e.target.value)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border font-semibold"
                                    placeholder="Nome do Produto"
                                />
                            </div>
                            <div className="col-span-8">
                                <label className="block text-[9px] text-gray-500 uppercase">Descrição</label>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                                        className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                        placeholder="Descrição técnica"
                                    />
                                    <button 
                                        onClick={() => handleAiDescription(section.id, item.id, item.description)}
                                        className="bg-purple-100 text-purple-600 px-2 rounded-md hover:bg-purple-200"
                                        title="Sugerir descrição com IA"
                                    >
                                        {loadingSuggestion === item.id ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 gap-3">
                            <div>
                                <label className="block text-[9px] text-gray-500 uppercase">Emb. Tipo</label>
                                <input
                                    type="text"
                                    value={item.packagingType}
                                    onChange={(e) => updateItem(section.id, item.id, 'packagingType', e.target.value)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                    placeholder="Ex: Parte A"
                                />
                            </div>
                             <div>
                                <label className="block text-[9px] text-gray-500 uppercase">Peso (kg)</label>
                                <input
                                    type="number"
                                    value={item.packagingWeight}
                                    onChange={(e) => updateItem(section.id, item.id, 'packagingWeight', parseFloat(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                />
                            </div>
                             <div>
                                <label className="block text-[9px] text-gray-500 uppercase">R$ / kg</label>
                                <input
                                    type="number"
                                    value={item.pricePerKg}
                                    onChange={(e) => updateItem(section.id, item.id, 'pricePerKg', parseFloat(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] text-gray-500 uppercase">IPI (%)</label>
                                <input
                                    type="number"
                                    value={item.ipi}
                                    onChange={(e) => updateItem(section.id, item.id, 'ipi', parseFloat(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] text-gray-500 uppercase">ICMS (%)</label>
                                <input
                                    type="number"
                                    value={item.icms}
                                    onChange={(e) => updateItem(section.id, item.id, 'icms', parseFloat(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-md text-xs p-1.5 border"
                                />
                            </div>
                             <div>
                                <label className="block text-[9px] text-gray-500 uppercase bg-yellow-100 px-1 rounded w-fit">KITS</label>
                                <input
                                    type="number"
                                    value={item.kits}
                                    onChange={(e) => updateItem(section.id, item.id, 'kits', parseFloat(e.target.value) || 0)}
                                    className="w-full border-yellow-300 bg-yellow-50 rounded-md text-xs p-1.5 border font-bold"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-2 text-[10px] text-gray-400 flex justify-end gap-4">
                             <span>Total Kg: {(item.kits * item.packagingWeight).toFixed(3)} kg</span>
                             <span>Total R$: {(((item.kits * item.packagingWeight) * item.pricePerKg) * (1 + (item.ipi || 0) / 100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                        </div>

                    </div>
                ))}
                
                 <button 
                    onClick={() => addItemToSection(section.id)} 
                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2 text-xs font-medium transition-colors"
                >
                    <Plus size={14} /> Adicionar Produto
                </button>
                </div>

                {/* Supplemental Fields (Section Specific - DIFAL/ST) */}
                <div className="mt-6 border-t pt-4">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2 mb-2">
                        <Coins size={14} />
                        Custos da Área (DIFAL, ST, etc.)
                    </label>
                    <div className="space-y-2">
                        {(section.supplemental || []).map(sup => (
                            <div key={sup.id} className="flex gap-2 items-center">
                                <input 
                                    type="text"
                                    placeholder="Descrição (ex: DIFAL, ST)"
                                    value={sup.description}
                                    onChange={(e) => updateSupplemental(section.id, sup.id, 'description', e.target.value)}
                                    className="flex-grow border-gray-300 rounded-md text-xs p-1.5 border"
                                />
                                <input 
                                    type="number"
                                    placeholder="Valor (R$)"
                                    value={sup.value}
                                    onChange={(e) => updateSupplemental(section.id, sup.id, 'value', parseFloat(e.target.value) || 0)}
                                    className="w-32 border-gray-300 rounded-md text-xs p-1.5 border text-right"
                                />
                                <button onClick={() => removeSupplemental(section.id, sup.id)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                         <button 
                            onClick={() => addSupplementalToSection(section.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium mt-1"
                        >
                            <Plus size={12} /> Adicionar Custo de Área
                        </button>
                    </div>
                </div>
            </div>
        </div>
      ))}

      {/* Add Section Button */}
      <button 
        onClick={addSection}
        className="w-full border-2 border-dashed border-blue-300 rounded-lg p-4 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 hover:border-blue-500 transition-all font-medium"
      >
        <FolderPlus size={20} />
        Adicionar Nova Área
      </button>

      {/* Global Extras (Freight) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Truck size={20} />
              Custos Globais (Frete / Entregas)
          </h3>
          <div className="space-y-2 mb-4">
              {(data.globalExtras || []).map(extra => (
                  <div key={extra.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                      <input 
                          type="text"
                          placeholder="Descrição (ex: Frete, Taxa de entrega)"
                          value={extra.description}
                          onChange={(e) => updateGlobalExtra(extra.id, 'description', e.target.value)}
                          className="flex-grow border-gray-300 rounded-md text-xs p-2 border"
                      />
                      <input 
                          type="number"
                          placeholder="Valor (R$)"
                          value={extra.value}
                          onChange={(e) => updateGlobalExtra(extra.id, 'value', parseFloat(e.target.value) || 0)}
                          className="w-32 border-gray-300 rounded-md text-xs p-2 border text-right font-semibold"
                      />
                      <button onClick={() => removeGlobalExtra(extra.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 size={16} />
                      </button>
                  </div>
              ))}
          </div>
          <button 
              onClick={addGlobalExtra}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium border border-blue-200 rounded px-3 py-1.5 bg-blue-50"
          >
              <Plus size={14} /> Adicionar Frete / Custo Global
          </button>
      </div>

      {/* Supply Conditions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Condições de Fornecimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.conditions).map(([key, value]) => (
                 <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                        {key === 'minBilling' ? 'Faturamento Mínimo' : 
                         key === 'taxes' ? 'Impostos' : 
                         key === 'shipping' ? 'Embarque' : 
                         key === 'freight' ? 'Frete (Texto)' : 
                         key === 'payment' ? 'Faturamento' : 
                         key === 'validity' ? 'Validade da Proposta' : key}
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateConditions(key as keyof SupplyConditions, e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border"
                    />
                </div>
            ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Observações Gerais (Rodapé)</h3>
        <textarea
          rows={6}
          value={data.notes}
          onChange={(e) => onChange({...data, notes: e.target.value})}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
        />
      </div>
    </div>
  );
};

export default QuoteForm;
