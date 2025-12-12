import React from 'react';
import { Upload, AlertCircle, FileSpreadsheet, CheckCircle2, Trash2, Info } from 'lucide-react';
import { ServiceDB } from '../types';
import * as XLSX from 'xlsx';

interface DatabaseUploadProps {
  services: ServiceDB[];
  onUpload: (services: ServiceDB[]) => void;
}

const DatabaseUpload: React.FC<DatabaseUploadProps> = ({ services, onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length === 0) {
          alert("A planilha está vazia.");
          return;
        }

        let headerIndex = -1;
        let colServico = -1;
        let colUnidade = -1;
        let colValor = -1;
        let colEscopo = -1;

        // Procura cabeçalho nas primeiras 50 linhas
        for (let i = 0; i < Math.min(jsonData.length, 50); i++) {
          const row = jsonData[i].map(c => String(c || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
          
          const s = row.findIndex(h => h.includes('servico') || h.includes('item'));
          const u = row.findIndex(h => h.includes('unidade') || h.includes('unid'));
          const v = row.findIndex(h => h.includes('valor') || h.includes('preco') || h.includes('preço'));
          const esc = row.findIndex(h => h.includes('escopo') || h.includes('descricao') || h.includes('detalhe'));
          
          if (s !== -1 && u !== -1 && v !== -1) {
            headerIndex = i;
            colServico = s;
            colUnidade = u;
            colValor = v;
            colEscopo = esc;
            break;
          }
        }

        if (headerIndex === -1) {
          alert("Erro: Colunas 'SERVIÇO', 'UNIDADE' e 'VALOR' não encontradas.");
          return;
        }

        const parsedServices: ServiceDB[] = jsonData.slice(headerIndex + 1)
          .filter(row => row[colServico] && String(row[colServico]).trim() !== '') 
          .map(row => {
            let valorNum = 0;
            const rawValor = row[colValor];
            
            if (typeof rawValor === 'number') {
              valorNum = rawValor;
            } else {
              const cleaned = String(rawValor || '0')
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.');
              valorNum = parseFloat(cleaned) || 0;
            }

            return {
              servico: String(row[colServico]).trim(),
              unidade: String(row[colUnidade] || '').trim(),
              valor: valorNum,
              escopo: colEscopo !== -1 ? String(row[colEscopo] || '').trim() : undefined
            };
          });

        onUpload(parsedServices);
      } catch (error) {
        console.error("Excel Error:", error);
        alert("Erro ao processar o arquivo. Verifique o formato.");
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet size={22} className="text-green-600" />
          Base de Preços Kolbtec
        </h3>
        {services.length > 0 && (
          <button onClick={() => confirm("Apagar base de dados?") && onUpload([])} className="text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all">
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6 flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <div className="text-[11px] text-blue-800 leading-normal">
            Importe seu Excel (.xlsx). Detectamos automaticamente as colunas de <strong>serviço, unidade e valor</strong>, mesmo que haja linhas vazias no topo.
        </div>
      </div>

      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-300 transition-all cursor-pointer relative group">
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-all border border-slate-100">
          <Upload size={32} className="text-blue-500" />
        </div>
        <p className="text-sm font-bold text-slate-700">Arraste ou clique para enviar</p>
        <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">Planilha Excel Oficial</p>
      </div>

      {services.length > 0 && (
        <div className="mt-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              {services.length} itens carregados
            </h4>
            <div className="max-h-80 overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-50 bg-white shadow-inner">
                {services.map((s, i) => (
                    <div key={i} className="p-4 text-xs flex justify-between items-start hover:bg-blue-50/20 transition-colors group">
                        <div className="pr-4">
                            <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{s.servico}</div>
                            {s.escopo && <div className="text-[9px] text-slate-400 mt-1 line-clamp-1 italic">{s.escopo}</div>}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-blue-600">R$ {s.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">{s.unidade}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseUpload;