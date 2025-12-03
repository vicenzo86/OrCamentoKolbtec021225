import React, { useState } from 'react';
import { QuoteData, initialQuoteData } from './types';
import QuoteForm from './components/QuoteForm';
import QuotePreview from './components/QuotePreview';
import CompanyForm from './components/CompanyForm';
import { Printer, Edit3, Eye, Settings, Building2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<QuoteData>(initialQuoteData);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'settings'>('editor');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white shadow-md no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">KB</div>
               <span className="font-bold text-xl tracking-tight">Kolbtec</span>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Navigation Tabs */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                    <button 
                        onClick={() => setActiveTab('editor')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Edit3 size={16} /> <span className="hidden md:inline">Editar</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Building2 size={16} /> <span className="hidden md:inline">Empresa</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Eye size={16} /> <span className="hidden md:inline">Ver</span>
                    </button>
                </div>

                <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Printer size={18} />
                    <span className="hidden sm:inline">Imprimir</span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 md:p-6 gap-8 grid lg:grid-cols-12">
        
        {/* Editor Side */}
        <div className={`lg:col-span-5 xl:col-span-4 h-full no-print ${(activeTab === 'editor' || activeTab === 'settings') ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin pr-2">
                {activeTab === 'settings' ? (
                    <CompanyForm data={data.company} onChange={(c) => setData({...data, company: c})} />
                ) : (
                    <QuoteForm data={data} onChange={setData} />
                )}
            </div>
        </div>

        {/* Preview Side */}
        <div className={`lg:col-span-7 xl:col-span-8 flex justify-center items-start ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
             <div className="w-full max-w-[210mm] print:w-full print:max-w-none transform scale-100 origin-top lg:scale-[0.85] xl:scale-100 transition-transform">
                <QuotePreview data={data} />
            </div>
        </div>

      </main>
    </div>
  );
}