/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { CarbonFormInput } from '../../types/carbon';
import { Trash2, Recycle, Compass, Info } from 'lucide-react';

interface Props {
  register: UseFormRegister<CarbonFormInput>;
  watch: UseFormWatch<CarbonFormInput>;
  errors: FieldErrors<CarbonFormInput>;
}

export default function CarbonCategoryWaste({ register, watch, errors }: Props) {
  const currentComposts = watch('compostsOrganics');

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Domestic Waste and Recycling Factors</legend>

      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Trash2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h3 className="text-base font-bold text-gray-900">4. Waste & Landfill</h3>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
        Anaerobic decay of household municipal trash inside dense landfills releases significant greenhouse gases. Recycled materials and composting help limit this flow.
      </p>

      {/* Amount of waste (Bags/month) */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div>
          <label htmlFor="wasteBags" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1.5">
            <Trash2 className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
            <span>Trash Generated (Standard Large Bags / month)</span>
          </label>
          <div className="relative mt-1">
            <input
              id="wasteBags"
              type="number"
              className="block w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="e.g. 4"
              aria-describedby="wasteBags-error wasteBags-hint"
              {...register('wasteBags', { valueAsNumber: true })}
            />
            <span id="wasteBags-hint" className="sr-only">Typical 30L standard household dry garbage bags generated each month</span>
          </div>
          {errors.wasteBags && (
            <p id="wasteBags-error" className="mt-1 text-xs font-semibold text-rose-600">
              {errors.wasteBags.message}
            </p>
          )}
        </div>
      </div>

      {/* Recycling level and Composting organic waste */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Recycling Level */}
          <div>
            <label htmlFor="recyclingLevel" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1.5">
              <Recycle className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
              <span>Household Recycling Commitment</span>
            </label>
            <select
              id="recyclingLevel"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              aria-describedby="recyclingLevel-hint"
              {...register('recyclingLevel')}
            >
              <option value="none">No Recycling (All goes to landfill)</option>
              <option value="some">Moderate Recycling (Paper, select metals)</option>
              <option value="all">Intensive Recycling (Paper, cardboard, plastics, metals, glass)</option>
            </select>
            <span id="recyclingLevel-hint" className="sr-only">Select recycling standard to see offsets in upstream processing and emissions redirection</span>
          </div>

          {/* Organic Composting Checkbox */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <input
                id="compostsOrganics"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 focus-visible:outline-2"
                {...register('compostsOrganics')}
              />
              <div className="text-left">
                <label htmlFor="compostsOrganics" className="text-xs font-semibold text-gray-800">
                  Compost Organic Food Waste
                </label>
                <p className="text-[10px] text-slate-600">Backyard compost or municipal organic collection bin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Key connection:</strong> Discarding organic food materials into standard landfills yields an anaerobic environment where microbes generate methane gas rather than carbon dioxide.
        </p>
      </div>
    </fieldset>
  );
}
