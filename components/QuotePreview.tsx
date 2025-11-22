
import React from 'react';
import { QuoteData, QuoteItem, QuoteSection } from '../types';

interface QuotePreviewProps {
  data: QuoteData;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatNumber = (val: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
};

const QuotePreview: React.FC<QuotePreviewProps> = ({ data }) => {
  
  const calculateItemTotal = (item: QuoteItem) => {
      const totalWeight = item.packagingWeight * item.kits;
      return totalWeight * item.pricePerKg;
  };

  const calculateSectionTotal = (section: QuoteSection) => {
    return section.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  };

  const calculateGrandTotal = () => {
    return data.sections.reduce((acc, section) => acc + calculateSectionTotal(section), 0);
  };

  return (
    <div className="bg-white text-black p-8 md:p-10 shadow-2xl print-area max-w-[210mm] mx-auto min-h-[297mm] text-[11px] font-sans leading-snug relative">
      
      {/* Header - Keep together */}
      <div className="break-inside-avoid mb-6">
        <div className="flex justify-between items-start">
            {/* Left - Client Address Scope */}
            <div className="w-1/2 pt-4">
                <div className="font-bold text-sm mb-1">À</div>
                <div className="font-bold text-base mb-1">{data.client.name}</div>
                <div>{data.client.contact}</div>
                <div>{data.client.phone}</div>
                <div className="mt-2">
                    <span className="font-bold">Data:</span> {data.date}
                </div>
                <div>
                    <span className="font-bold">Referência:</span> {data.reference}
                </div>
                <div className="mt-2">
                    <span className="font-bold">Assunto:</span> {data.subject}
                </div>
            </div>

            {/* Right - Company Info */}
            <div className="w-1/2 text-right flex flex-col items-end">
                {data.company.logoUrl ? (
                    <img src={data.company.logoUrl} alt="Logo" className="h-32 w-auto object-contain mb-2"/>
                ) : (
                    <h1 className="text-3xl font-bold text-blue-800 italic mb-4">{data.company.name}</h1>
                )}
                
                <div className="text-xs text-gray-700 mt-2">
                    <div className="font-bold">{data.company.name}</div>
                    <div>{data.company.address}</div>
                    <div>Tel.: {data.company.phone}</div>
                    <a href={`https://${data.company.site}`} className="text-blue-600 underline">{data.company.site}</a>
                </div>
            </div>
        </div>

        <div className="mt-6 border-t border-black pt-4">
            <p>Prezado {data.client.contact.replace('A/C ', '')}</p>
            <p>Conforme solicitado, enviamos abaixo nossa proposta de materiais, conforme descrição abaixo:</p>
        </div>
      </div>

      {/* SECTIONS LOOP */}
      {data.sections.map((section) => {
          const sectionTotal = calculateSectionTotal(section);
          const totalPerSqm = section.areaSize > 0 ? sectionTotal / section.areaSize : 0;

          return (
            /* break-inside-avoid ensures a section (title + table + totals) tries to stay on one page */
            <div key={section.id} className="mb-6 break-inside-avoid page-break-block">
                {/* Section Title Header */}
                <div className="font-bold bg-gray-100 p-1 border border-black mb-1 text-xs">
                    {section.title}: {formatNumber(section.areaSize)} m² {section.description}
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-black text-[10px]">
                    <thead>
                        <tr className="text-center font-bold">
                            <th className="border border-black p-1 w-[15%]">Produto</th>
                            <th className="border border-black p-1 w-[20%]">Descrição</th>
                            <th className="border border-black p-1 w-[15%]">Embalagem (kg)</th>
                            <th className="border border-black p-1 w-[8%]">R$ / kg</th>
                            <th className="border border-black p-1 w-[5%]">Ipi</th>
                            <th className="border border-black p-1 w-[5%]">Icms</th>
                            <th className="border border-black p-1 w-[5%]">Kits</th>
                            <th className="border border-black p-1 w-[10%]">Quant, (kg)</th>
                            <th className="border border-black p-1 w-[12%]">Total (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {section.items.map((item) => {
                            const totalWeight = item.kits * item.packagingWeight;
                            const totalPrice = totalWeight * item.pricePerKg;

                            return (
                                <tr key={item.id} className="text-center">
                                    <td className="border border-black p-1 font-bold">{item.product}</td>
                                    <td className="border border-black p-1 text-left">{item.description}</td>
                                    <td className="border border-black p-1 text-left pl-2">
                                        <span className="mr-1">{item.packagingType}</span>
                                        <span className="float-right">{formatNumber(item.packagingWeight, 3)} kg</span>
                                    </td>
                                    <td className="border border-black p-1">
                                        <span className="float-left">R$</span>
                                        {formatNumber(item.pricePerKg)} / kg
                                    </td>
                                    <td className="border border-black p-1">{formatNumber(item.ipi)}%</td>
                                    <td className="border border-black p-1">{formatNumber(item.icms)}%</td>
                                    <td className="border border-black p-1">{item.kits}</td>
                                    <td className="border border-black p-1">{formatNumber(totalWeight, 3)}</td>
                                    <td className="border border-black p-1 text-right">{formatCurrency(totalPrice)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Section Totals */}
                <div className="border border-t-0 border-black flex justify-between items-center px-2 py-1">
                    <span className="font-bold">Total do item</span>
                    <span className="font-bold">{formatCurrency(sectionTotal)}</span>
                </div>
                <div className="border border-t-0 border-black flex justify-between items-center px-2 py-1 mb-2">
                    <span className="font-bold">Total do item por m²</span>
                    <span className="font-bold">{formatCurrency(totalPerSqm)}</span>
                </div>
            </div>
          );
      })}

      {/* Grand Total - Keep with items if possible, or move to next */}
      <div className="break-inside-avoid mb-6">
        <div className="border border-black flex justify-between items-center px-2 py-2 text-sm bg-gray-50">
            <span className="font-bold">Total da proposta</span>
            <span className="font-bold">{formatCurrency(calculateGrandTotal())}</span>
        </div>
      </div>

      {/* Conditions - Strict Block */}
      <div className="mb-8 text-[10px] break-inside-avoid border border-transparent">
          <h3 className="font-bold mb-2 text-xs border-b border-gray-200 pb-1 inline-block">Condições de Fornecimento</h3>
          <div className="grid grid-cols-[120px_1fr] gap-y-1">
              <div className="font-bold">Faturamento:</div>
              <div>{data.conditions.payment}</div>

              <div className="font-bold">Frete:</div>
              <div>{data.conditions.freight}</div>

              <div className="font-bold">Impostos:</div>
              <div>{data.conditions.taxes}</div>

              <div className="font-bold">Faturamento mínimo:</div>
              <div>{data.conditions.minBilling}</div>

              <div className="font-bold">Embarque:</div>
              <div>{data.conditions.shipping}</div>

              <div className="font-bold">Validade da proposta:</div>
              <div>{data.conditions.validity}</div>
          </div>
      </div>

      {/* Notes and Signature Group - Ensure they don't split weirdly */}
      <div className="break-inside-avoid">
          {/* Footer Notes */}
          <div className="text-[9px] text-justify leading-tight space-y-2 mb-12">
              <div className="whitespace-pre-line">{data.notes}</div>
          </div>

          {/* Signature and Footer Block */}
          <div className="flex justify-between items-end border-t border-gray-400 pt-4">
                <div className="text-xs mb-8">
                    Atenciosamente,
                </div>

                <div className="text-right text-[10px] leading-relaxed">
                    <div className="font-bold text-xs mb-1">{data.company.signatoryName}</div>
                    <div>{data.company.mobile}</div>
                    <div>{data.company.phone}</div>
                    <div className="text-blue-600 underline">
                        <a href={`mailto:${data.company.secondaryEmail}`}>{data.company.secondaryEmail}</a>
                    </div>
                    <div className="text-blue-600 underline">
                        <a href={`mailto:${data.company.email}`}>{data.company.email}</a>
                    </div>
                </div>
          </div>
      </div>

    </div>
  );
};

export default QuotePreview;
