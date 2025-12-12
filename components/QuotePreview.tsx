
import React from 'react';
import { QuoteData, QuoteItem, QuoteSection } from '../types';

interface QuotePreviewProps {
  data: QuoteData;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
};

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(val);
};

const QuotePreview: React.FC<QuotePreviewProps> = ({ data }) => {
  
  const calculateItemTotal = (item: QuoteItem) => {
      return item.quantity * item.unitPrice;
  };

  const calculateSectionTotal = (section: QuoteSection) => {
    return section.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  };

  return (
    <div className="bg-white text-black shadow-2xl print-area w-full max-w-[210mm] mx-auto min-h-[297mm] text-[8.5pt] font-sans leading-tight relative border border-gray-200 print:border-none flex flex-col">
      <div className="p-10 print:p-[15mm] flex-1">
        
        {/* CABEÇALHO CORPORATIVO */}
        <div className="flex justify-between items-start mb-6">
            <div className="pt-2 max-w-[55%]">
                <div className="text-[7.5pt] font-black text-blue-600 mb-1 uppercase tracking-widest">À empresa / Cliente</div>
                <div className="text-base font-black text-slate-900 leading-none uppercase mb-1.5 tracking-tight">{data.client.name}</div>
                <div className="space-y-0.5 text-slate-600 font-medium text-[8.5pt]">
                    {data.client.contact && <div className="font-bold text-slate-800">{data.client.contact}</div>}
                    {data.client.phone && <div>Tel: {data.client.phone}</div>}
                    {data.client.address && <div className="leading-tight">{data.client.address}</div>}
                </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
                {data.company.logoUrl ? (
                    <img src={data.company.logoUrl} alt="Logo" className="h-12 mb-2 object-contain"/>
                ) : (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex flex-col items-end">
                             <span className="text-xl font-black italic text-slate-900 leading-none">KOLBTEC</span>
                             <span className="text-[6px] font-black tracking-[0.3em] text-blue-600 uppercase">SOLUÇÕES EFICIENTES</span>
                        </div>
                    </div>
                )}
                <div className="text-[7.5pt] text-slate-500 font-bold leading-tight">
                    <div className="text-slate-900 uppercase font-black">{data.company.name}</div>
                    <div className="font-normal">{data.company.address}</div>
                    <div>{data.company.phone}</div>
                    <div className="text-blue-600 font-black tracking-wider mt-0.5">{data.company.site}</div>
                </div>
            </div>
        </div>

        {/* IDENTIFICAÇÃO DO DOCUMENTO - Ajustado para não truncar assunto */}
        <div className="grid grid-cols-12 gap-0 mb-5 border border-slate-200 divide-x divide-slate-200 rounded-sm overflow-hidden">
            <div className="col-span-3 p-2 bg-slate-50">
                <div className="text-[6.5pt] font-black text-slate-400 uppercase mb-0.5">Referência</div>
                <div className="font-black text-slate-900 text-[9pt]">{data.reference}</div>
            </div>
            <div className="col-span-3 p-2">
                <div className="text-[6.5pt] font-black text-slate-400 uppercase mb-0.5">Data de Emissão</div>
                <div className="font-black text-slate-900 text-[9pt]">{data.date}</div>
            </div>
            <div className="col-span-6 p-2 bg-slate-50">
                <div className="text-[6.5pt] font-black text-slate-400 uppercase mb-0.5">Assunto</div>
                <div className="font-black text-blue-800 uppercase text-[9pt] leading-tight break-words">{data.subject}</div>
            </div>
        </div>

        {/* SAUDAÇÃO E INTRODUÇÃO */}
        <div className="mb-5 px-1">
            <div className="font-black text-[10pt] text-slate-900 mb-1">{data.salutation}</div>
            <p className="text-slate-700 leading-relaxed text-justify italic text-[9pt]">{data.introText}</p>
        </div>

        {/* LISTAGEM DE ÁREAS E ITENS */}
        <div className="space-y-8">
            {data.sections.map((section, idx) => {
                const sectionTotal = calculateSectionTotal(section);
                const totalPerM2 = section.areaSize > 0 ? sectionTotal / section.areaSize : 0;
                
                return (
                    <div key={section.id} className="break-inside-avoid">
                        {/* Título da Seção (Área) */}
                        <div className="flex items-end justify-between border-b-[1.5px] border-slate-900 pb-0.5 mb-1.5">
                           <div className="flex items-center gap-2">
                               <span className="bg-slate-900 text-white text-[8.5pt] font-black px-1.5 py-0.5">ITEM {idx + 1}</span>
                               <span className="text-[10pt] font-black text-slate-900 uppercase tracking-tight">{section.description || section.title}</span>
                           </div>
                           <div className="text-[8.5pt] font-bold text-slate-500">
                               ÁREA: <span className="text-slate-900 font-black">{new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(section.areaSize)} m²</span>
                           </div>
                        </div>
                        
                        {/* Exibição condicional do consumo */}
                        {section.consumption && section.consumption.trim() !== "" && (
                            <div className="mb-2 text-[7.5pt] font-medium text-slate-600 italic">
                                Informação técnica: Consumo estimado de {section.consumption} conforme especificação da Kolbtec.
                            </div>
                        )}

                        <table className="w-full border-collapse border border-slate-300 table-fixed">
                            <thead>
                                <tr className="bg-slate-100 text-[7.5pt] font-black text-slate-700 uppercase">
                                    <th className="border border-slate-300 py-1.5 px-2 text-left w-[44%]">Produto / Serviço</th>
                                    <th className="border border-slate-300 py-1.5 px-1 text-center w-[10%]">Unid.</th>
                                    <th className="border border-slate-300 py-1.5 px-1 text-center w-[16%]">Preço Unitário</th>
                                    <th className="border border-slate-300 py-1.5 px-1 text-center w-[15%]">Quantidade</th>
                                    <th className="border border-slate-300 py-1.5 px-2 text-right w-[15%]">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.items.map((item, iIdx) => (
                                    <tr key={item.id} className={`text-center ${iIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="border border-slate-300 py-2.5 px-2 font-black text-slate-900 text-left align-middle text-[9pt] leading-tight break-words">
                                            {item.serviceName}
                                        </td>
                                        <td className="border border-slate-300 py-2.5 px-1 text-slate-600 font-bold uppercase text-[8pt] align-middle">
                                            {item.unit}
                                        </td>
                                        <td className="border border-slate-300 py-2.5 px-1 font-bold text-slate-800 align-middle whitespace-nowrap text-[8.5pt]">
                                            R$ {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="border border-slate-300 py-2.5 px-1 font-black text-slate-900 align-middle text-[8.5pt]">
                                            {formatNumber(item.quantity)}
                                        </td>
                                        <td className="border border-slate-300 py-2.5 px-2 text-right font-black text-slate-900 align-middle whitespace-nowrap text-[9.5pt]">
                                            R$ {formatCurrency(calculateItemTotal(item))}
                                        </td>
                                    </tr>
                                ))}
                                {/* Subtotais da Seção */}
                                <tr className="bg-slate-50/80">
                                    <td colSpan={4} className="border border-slate-300 py-1.5 px-2 text-right font-bold uppercase text-[7.5pt] text-slate-500 tracking-wider">Total Materiais para esta área</td>
                                    <td className="border border-slate-300 py-1.5 px-2 text-right font-black bg-white text-slate-900 text-[9.5pt] whitespace-nowrap">R$ {formatCurrency(sectionTotal)}</td>
                                </tr>
                                <tr className="bg-blue-50/20 font-black">
                                    <td colSpan={4} className="border border-slate-300 py-1.5 px-2 text-right uppercase text-[7.5pt] text-blue-700 tracking-wider">Investimento estimado por m²</td>
                                    <td className="border border-slate-300 py-1.5 px-2 text-right bg-blue-50/50 text-blue-800 text-[9.5pt] whitespace-nowrap">R$ {formatCurrency(totalPerM2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>

        {/* CONDIÇÕES E OBSERVAÇÕES TÉCNICAS */}
        <div className="mt-12 break-inside-avoid border-t border-slate-200 pt-6">
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h4 className="font-black text-slate-900 uppercase text-[8.5pt] mb-2.5 border-l-2 border-blue-600 pl-2">Condições Gerais</h4>
                    <div className="space-y-0.5 text-[8.5pt]">
                        {[
                            { label: 'Condição de Pagamento', value: data.conditions.payment },
                            { label: 'Prazo de Entrega', value: data.conditions.shipping },
                            { label: 'Tipo de Frete', value: data.conditions.freight },
                            { label: 'Validade da Proposta', value: data.conditions.validity },
                            { label: 'Faturamento Mínimo', value: data.conditions.minBilling },
                            { label: 'Impostos', value: data.conditions.taxes },
                        ].map((cond, i) => (
                            <div key={i} className="flex justify-between border-b border-slate-50 py-1">
                                <span className="text-slate-400 font-bold uppercase tracking-tight">{cond.label}:</span>
                                <span className="text-slate-900 font-black">{cond.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 uppercase text-[8.5pt] mb-2.5 border-l-2 border-blue-600 pl-2">Notas Importantes</h4>
                    <div className="text-[8.5pt] text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 border border-slate-100 rounded-sm italic text-justify">
                        {data.notes || "Não foram inseridas observações adicionais."}
                    </div>
                </div>
            </div>
        </div>

        {/* ASSINATURA */}
        <div className="mt-20 flex justify-end">
            <div className="text-center w-64">
                <div className="border-t border-slate-900 pt-2.5">
                    <div className="font-black text-[10pt] uppercase text-slate-900 leading-none tracking-tight">{data.company.signatoryName || "Departamento Comercial"}</div>
                    <div className="text-[7.5pt] text-blue-600 font-black uppercase tracking-[0.15em] mt-1">KOLBTEC SOLUÇÕES</div>
                    {data.company.mobile && <div className="text-[8pt] text-slate-400 font-bold mt-1">{data.company.mobile}</div>}
                </div>
            </div>
        </div>

      </div>
      
      {/* Rodapé Visual no Final da Página */}
      <div className="bg-slate-900 text-white py-2.5 px-10 flex justify-between items-center no-print mt-auto">
          <div className="text-[7pt] font-bold tracking-widest uppercase opacity-40">Kolbtec Soluções em Impermeabilização</div>
          <div className="text-[7pt] font-bold tracking-widest uppercase opacity-40">{data.company.site}</div>
      </div>
    </div>
  );
};

export default QuotePreview;
