
import React, { useState } from 'react';
import { QuoteData, QuoteItem, QuoteSection, ServiceDB } from '../types';
import { Trash2, FolderPlus, Sparkles, Loader2 } from 'lucide-react';
import { refineNotes } from '../services/geminiService';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  serviceDatabase: ServiceDB[];
}

const QuoteForm: React.FC<QuoteFormProps> = ({ data, onChange, serviceDatabase }) => {
  const [isRefining, setIsRefining] = useState(false);
  
  const updateClient = (field: keyof typeof data.client, value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const addSection = () => {
    const newId = (data.sections.length + 1).toString();
    const newSection: QuoteSection = {
        id: newId,
        title: `Área ${newId}`,
        areaSize: 0,
        description: "",
        consumption: "",
        items: []
    };
    onChange({ ...data, sections: [...data.sections, newSection] });
  };

  const addItemToSection = (sectionId: string) => {
    const newItem: QuoteItem = {
        id: Math.random().toString(36).substr(2, 9),
        serviceName: "",
        description: "",
        unit: "M²",
        packaging: "",
        quantity: 0,
        unitPrice: 0,
        taxIpi: 0,
        taxIcms: 0,
        kits: 1
    };
    onChange({
        ...data,
        sections: data.sections.map(s => s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s)
    });
  };

  const handleServiceSelect = (sectionId: string, itemId: string, serviceName: string) => {
    const selected = serviceDatabase.find(s => s.servico === serviceName);
    if (!selected) return;

    onChange({
        ...data,
        sections: data.sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    items: s.items.map(item => item.id === itemId ? { 
                        ...item, 
                        serviceName: selected.servico,
                        unit: selected.unidade,
                        unitPrice: selected.valor,
                    } : item)
                };
            }
            return s;
        })
    });
  };

  const updateItem = (sectionId: string, itemId: string, field: keyof QuoteItem, value: any) => {
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

  const handleAIImprove = async () => {
    if (isRefining) return;
    setIsRefining(true);
    try {
      const improved = await refineNotes(data.notes, "Impermeabilização e Construção Civil");
      onChange({ ...data, notes: improved });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Dados do Orçamento
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referência</label>
                <input type="text" value={data.reference} onChange={(e) => onChange({...data, reference: e.target.value})} className="w-full border-slate-200 rounded-2xl text-sm p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data</label>
                <input type="text" value={data.date} onChange={(e) => onChange({...data, date: e.target.value})} className="w-full border-slate-200 rounded-2xl text-sm p-3 border focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Nome do Cliente / Empresa" value={data.client.name} onChange={(e) => updateClient('name', e.target.value)} className="w-full border-slate-200 rounded-2xl text-sm p-3 border focus:ring-2 focus:ring-blue-500 font-medium" />
          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="A/C Responsável" value={data.client.contact} onChange={(e) => updateClient('contact', e.target.value)} className="w-full border-slate-200 rounded-2xl text-sm p-3 border" />
             <input type="text" placeholder="Telefone" value={data.client.phone} onChange={(e) => updateClient('phone', e.target.value)} className="w-full border-slate-200 rounded-2xl text-sm p-3 border" />
          </div>
          <input type="text" placeholder="Assunto (Ex: Proposta Comercial Kolbtec)" value={data.subject} onChange={(e) => onChange({...data, subject: e.target.value})} className="w-full border-slate-200 rounded-2xl text-sm p-3 border" />
        </div>
      </div>

      {data.sections.map((section) => (
        <div key={section.id} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded">ÁREA {section.id}</span>
                    <input 
                        type="text" 
                        value={section.description} 
                        onChange={(e) => onChange({...data, sections: data.sections.map(s => s.id === section.id ? {...s, description: e.target.value} : s)})}
                        className="bg-transparent border-none text-white font-bold text-sm focus:ring-0 p-0 w-64 placeholder:text-slate-600"
                        placeholder="Nome do Serviço/Área"
                    />
                </div>
                <button onClick={() => onChange({...data, sections: data.sections.filter(s => s.id !== section.id)})} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tamanho da Área (m²)</label>
                        <input type="number" value={section.areaSize} onChange={(e) => onChange({...data, sections: data.sections.map(s => s.id === section.id ? {...s, areaSize: parseFloat(e.target.value) || 0} : s)})} className="w-full border-slate-200 rounded-2xl text-sm p-3 border font-black" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Consumo (opcional)</label>
                        <input type="text" value={section.consumption} onChange={(e) => onChange({...data, sections: data.sections.map(s => s.id === section.id ? {...s, consumption: e.target.value} : s)})} className="w-full border-slate-200 rounded-2xl text-sm p-3 border" placeholder="Ex: 120g/m²" />
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    {section.items.map((item) => (
                        <div key={item.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 relative group">
                             <button onClick={() => onChange({...data, sections: data.sections.map(s => s.id === section.id ? {...s, items: s.items.filter(i => i.id !== item.id)} : s)})} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                             
                             <div className="mb-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1 mb-1 tracking-widest">Serviço/Produto</label>
                                <select 
                                    className="w-full border-slate-200 rounded-2xl text-xs p-3.5 border bg-white font-bold"
                                    onChange={(e) => handleServiceSelect(section.id, item.id, e.target.value)}
                                    value={item.serviceName}
                                >
                                    <option value="">-- Escolha da Planilha --</option>
                                    {serviceDatabase.map((s, i) => (
                                        <option key={i} value={s.servico}>{s.servico}</option>
                                    ))}
                                </select>
                             </div>

                             <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Preço Unitário</label>
                                    <input type="number" value={item.unitPrice} onChange={(e) => updateItem(section.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full border-slate-200 rounded-xl text-xs p-3 border font-bold" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Quantidade</label>
                                    <input type="number" value={item.quantity} onChange={(e) => updateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full border-slate-200 rounded-xl text-xs p-3 border font-black text-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Unidade</label>
                                    <input type="text" value={item.unit} onChange={(e) => updateItem(section.id, item.id, 'unit', e.target.value)} className="w-full border-slate-200 rounded-xl text-xs p-3 border uppercase text-center" />
                                </div>
                             </div>
                        </div>
                    ))}
                    <button onClick={() => addItemToSection(section.id)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-blue-200 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                        <FolderPlus size={16}/> Adicionar Serviço à Área
                    </button>
                </div>
            </div>
        </div>
      ))}

      <button onClick={addSection} className="w-full py-6 bg-slate-800 text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-700 transition-all shadow-lg shadow-slate-200">
        <FolderPlus size={20} /> Adicionar Nova Área
      </button>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Observações Técnicas</h3>
            <button onClick={handleAIImprove} disabled={isRefining} className="text-blue-600 flex items-center gap-2 text-xs font-bold hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
                {isRefining ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Refinar com IA
            </button>
        </div>
        <textarea value={data.notes} onChange={(e) => onChange({...data, notes: e.target.value})} className="w-full border-slate-200 rounded-2xl text-xs p-4 border h-32 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed" />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Condição Pgto</label>
                <input type="text" value={data.conditions.payment} onChange={(e) => onChange({...data, conditions: {...data.conditions, payment: e.target.value}})} className="w-full border-slate-200 rounded-xl text-xs p-3 border" />
            </div>
            <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Prazo Entrega</label>
                <input type="text" value={data.conditions.shipping} onChange={(e) => onChange({...data, conditions: {...data.conditions, shipping: e.target.value}})} className="w-full border-slate-200 rounded-xl text-xs p-3 border" />
            </div>
            <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Validade Proposta</label>
                <input type="text" value={data.conditions.validity} onChange={(e) => onChange({...data, conditions: {...data.conditions, validity: e.target.value}})} className="w-full border-slate-200 rounded-xl text-xs p-3 border" />
            </div>
            <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Frete</label>
                <input type="text" value={data.conditions.freight} onChange={(e) => onChange({...data, conditions: {...data.conditions, freight: e.target.value}})} className="w-full border-slate-200 rounded-xl text-xs p-3 border" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
