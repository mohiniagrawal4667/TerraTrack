/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { CarbonFootprintResult } from '../../types/carbon';
import { getComparativeAnalysis, getRecommendations } from '../../lib/carbonCalculations';
import { Leaf, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface Props {
  result: CarbonFootprintResult;
  onReset: () => void;
}

export default function CarbonResultDashboard({ result, onReset }: Props) {
  const analysis = useMemo(() => getComparativeAnalysis(result.total), [result.total]);
  const recData = useMemo(() => getRecommendations(result), [result]);

  // Specific data for Recharts, formatted defensively
  const chartData = useMemo(() => [
    { name: 'Transport', value: Number(result.transport.toFixed(1)), color: '#10b981' },
    { name: 'Utilities', value: Number(result.electricity.toFixed(1)), color: '#0ea5e9' },
    { name: 'Diet', value: Number(result.food.toFixed(1)), color: '#f59e0b' },
    { name: 'Waste', value: Number(result.waste.toFixed(1)), color: '#f43f5e' }
  ], [result.transport, result.electricity, result.food, result.waste]);

  return (
    <div className="space-y-6" role="region" aria-label="Carbon Footprint Assessment Results">
      {/* Visual Badge Score Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-1">
              <Leaf className="h-4 w-4" />
              <span>Assessment Summary</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">Your Carbon Budget</h3>
          </div>
          
          <div className={`text-xs font-bold px-3 py-1 rounded-full border ${analysis.ratingColor}`}>
            Scoring: {analysis.rating}
          </div>
        </div>

        {/* Big Footprint Metric */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <span className="text-5xl font-black text-white tracking-tight">
            {result.total.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            kg CO2e / month
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed max-w-prose">
          This accounts for {analysis.percentageOfAverage}% of the national monthly consumer baseline ({analysis.averageMonthly} kg). 
          To hit the global heating threshold of 1.5C, your budget target is <strong>{analysis.targetMonthly} kg CO2e</strong> per person.
        </p>
      </div>

      {/* Interactive Category Chart */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="chart-title">
        <h4 id="chart-title" className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Categorical Emissions Breakdown
        </h4>

        {/* Accessible screen reader description table (satisfying WCAG requirements) */}
        <table className="sr-only">
          <caption>Monthly Greenhouse Gas Emissions Categorical breakdown</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Emissions (kg CO2e)</th>
              <th scope="col">Percentage Share</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((cat, idx) => (
              <tr key={idx}>
                <td>{cat.name}</td>
                <td>{cat.value} kg</td>
                <td>{result.total > 0 ? Math.round((cat.value / result.total) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Decorative charts hidden from assistive screen readers */}
        <div aria-hidden="true" className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[220px]">
          {/* Bar Diagram */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Diagram */}
          <div className="h-56 flex flex-col items-center justify-center">
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Visual labels */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-600">
              {chartData.map((cat, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                  {cat.name} ({result.total > 0 ? Math.round((cat.value / result.total) * 100) : 0}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rule-based target mitigation recommendations adhering to WCAG 2.1 contrast rules and semantic styling */}
      <section className="bg-slate-50 p-6 rounded-2xl border border-gray-200" aria-labelledby="advice-title">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h4 id="advice-title" className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Primary Mitigation Advice
          </h4>
        </div>
        
        <p className="text-xs text-gray-700 mb-4 leading-relaxed">
          Your largest emissions source is <strong className="font-bold text-gray-950">{recData.category}</strong>. Based on this profile, we recommend the following target reduction strategies:
        </p>

        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden bg-white" role="list">
          {recData.items.map((item) => (
            <li key={item.id} className="p-3.5 flex items-start gap-3 hover:bg-gray-50/30 transition-colors">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider select-none ${
                item.impactLevel === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                item.impactLevel === 'Medium' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                'bg-emerald-50 text-emerald-800 border border-emerald-100'
              }`}>
                {item.impactLevel} Impact
              </span>
              <span className="text-xs text-gray-700 font-medium leading-relaxed">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions row */}
      <div className="flex pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto bg-gray-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer text-center select-none"
          aria-label="Reset Calculator and recalculate inputs"
        >
          Recalculate Footprint
        </button>
      </div>
    </div>
  );
}
