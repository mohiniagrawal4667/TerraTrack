/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CarbonCalculatorForm from './components/carbon/CarbonCalculatorForm';
import CarbonResultDashboard from './components/carbon/CarbonResultDashboard';
import StructureExplorer from './components/StructureExplorer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CarbonFootprintResult, HistoricalFootprintItem } from './types/carbon';
import { Calculator, Box, Compass, Sparkles, History } from 'lucide-react';

export default function App() {
  const [activePortalTab, setActivePortalTab] = useState<'calculator' | 'blueprint'>('calculator');
  const [footprintResult, setFootprintResult] = useState<CarbonFootprintResult | null>(null);
  const [history, setHistory] = useLocalStorage<HistoricalFootprintItem[]>('terratrack_history', []);

  const handleCalculationsSuccess = (result: CarbonFootprintResult) => {
    setFootprintResult(result);
    
    const newItem: HistoricalFootprintItem = {
      id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 9) + Date.now(),
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      transport: result.transport,
      electricity: result.electricity,
      food: result.food,
      waste: result.waste,
      total: result.total,
    };
    
    setHistory((prev) => [newItem, ...prev]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* Semantic accessible header */}
      <Header />

      {/* Primary content area */}
      <main className="flex-1" id="main-content">
        
        {/* Core Hero Branding Section */}
        <div className="bg-slate-900 text-white py-12 px-4 shadow-sm sm:py-16 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-wider uppercase mb-3">
                <Sparkles className="h-4 w-4" />
                <span>Greenhouse Gas Management Suite</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                TerraTrack Carbon Footprint Engine
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Estimate, analyze, and offset your domestic greenhouse emissions. Enter transport distances, electricity usage, waste generation, and dietary choices to compute a comprehensive carbon budget.
              </p>
            </div>
          </div>
        </div>

        {/* Global tab choices section */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 pb-4">
            
            {/* Left label */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {activePortalTab === 'calculator' ? 'Emission Calculator Portal' : 'Workspace Specifications'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {activePortalTab === 'calculator' 
                  ? 'Input household metrics to view personalized ecological breakdowns.' 
                  : 'Examine files, directory assignments, and strict testing blueprints.'}
              </p>
            </div>

            {/* Portal Tab Switcher */}
            <div className="flex items-center p-1 bg-gray-200/80 rounded-xl border border-gray-300/40" role="tablist" aria-label="Toggle utility panels">
              <button
                type="button"
                role="tab"
                onClick={() => setActivePortalTab('calculator')}
                aria-selected={activePortalTab === 'calculator'}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  activePortalTab === 'calculator'
                    ? 'bg-white text-gray-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Access carbon footprint calculator"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                <span>Carbon Calculator</span>
              </button>

              <button
                type="button"
                role="tab"
                onClick={() => setActivePortalTab('blueprint')}
                aria-selected={activePortalTab === 'blueprint'}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  activePortalTab === 'blueprint'
                    ? 'bg-white text-gray-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="View structural file directives"
              >
                <Box className="h-4 w-4" aria-hidden="true" />
                <span>Architecture Blueprint</span>
              </button>
            </div>
          </div>

          {/* Render Active View Panel */}
          <div className="mt-4" role="tabpanel">
            {activePortalTab === 'calculator' ? (
              <div className="max-w-4xl mx-auto space-y-8">
                {footprintResult ? (
                  <CarbonResultDashboard 
                    result={footprintResult} 
                    onReset={() => setFootprintResult(null)} 
                  />
                ) : (
                  <CarbonCalculatorForm 
                    onSuccess={handleCalculationsSuccess} 
                  />
                )}

                {/* Calculation History Log section conforming strictly to WCAG 2.1 specifications */}
                <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="history-title">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      <h3 id="history-title" className="text-base font-bold text-gray-900">Calculation History Log</h3>
                    </div>
                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to clear your local calculation history?')) {
                            setHistory([]);
                          }
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        aria-label="Clear all carbon records"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      <p className="font-semibold text-gray-600">No calculation logs captured yet.</p>
                      <p className="text-gray-600 mt-1">Complete a metric form section above to track emission histories.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100" role="list">
                      {history.map((item) => (
                        <li key={item.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-500 font-mono">{item.date}</span>
                              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                                {item.total.toLocaleString()} kg CO2e
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                              <span>Transit: <strong className="font-semibold text-gray-700">{item.transport} kg</strong></span>
                              <span>Power: <strong className="font-semibold text-gray-700">{item.electricity} kg</strong></span>
                              <span>Food: <strong className="font-semibold text-gray-700">{item.food} kg</strong></span>
                              <span>Waste: <strong className="font-semibold text-gray-700">{item.waste} kg</strong></span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setHistory((prev) => prev.filter((i) => i.id !== item.id))}
                            className="self-start sm:self-auto text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1 rounded-md transition-colors cursor-pointer select-none"
                            aria-label={`Delete record of ${item.total} kg computed on ${item.date}`}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    <span>Project Scaffold Tree Specification</span>
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-prose mt-1">
                    This file system map indicates of how we organize separate pure files. Click on inspect details to review strict WCAG criteria.
                  </p>
                </div>
                <StructureExplorer />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Accessible footer landmark */}
      <Footer />
    </div>
  );
}

