/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { CarbonFormInput } from '../../types/carbon';
import { Apple, Percent, Home, Info } from 'lucide-react';

interface Props {
  register: UseFormRegister<CarbonFormInput>;
  watch: UseFormWatch<CarbonFormInput>;
  errors: FieldErrors<CarbonFormInput>;
}

export default function CarbonCategoryFood({ register, watch, errors }: Props) {
  const currentFoodWaste = watch('foodWastePct') || 0;
  const currentLocalFood = watch('localFoodPct') || 0;

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Dietary Carbon Factors</legend>

      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Apple className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h3 className="text-base font-bold text-gray-900">3. Dietary Footprint</h3>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
        Agriculture and land-use represent up to 30% of total global carbon footprint. Choose your daily diet style and estimate supply metrics.
      </p>

      {/* Diet Type Select */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div>
          <label htmlFor="dietType" className="block text-xs font-semibold text-gray-700 tracking-wide">
            Your Primary Dietary Style
          </label>
          <select
            id="dietType"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            aria-describedby="dietType-hint"
            {...register('dietType')}
          >
            <option value="heavy_meat">Heavy Meat Eater (Frequent beef/pork/lamb)</option>
            <option value="medium_meat">Average Meat Eater (Moderate poultry & red meats)</option>
            <option value="vegetarian_poultry">Low Red Meat Diet (Only poultry, fish, eggs, dairy)</option>
            <option value="vegetarian">Vegetarian (No meats, includes eggs/dairy products)</option>
            <option value="vegan">Vegan (Strictly plant-based nutrition)</option>
          </select>
          <span id="dietType-hint" className="sr-only">Selecting meat-heavy diets scales greenhouse emissions upwards due to methane and intensive feedstock acreage</span>
        </div>
      </div>

      {/* Grid for percentages/sliders */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        {/* Food Waste percentage Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 tracking-wide">
            <label htmlFor="foodWastePct">
              Estimated Food Waste
            </label>
            <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
              {currentFoodWaste}%
            </span>
          </div>
          <input
            id="foodWastePct"
            type="range"
            min="0"
            max="100"
            step="5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-500"
            aria-describedby="foodWastePct-hint"
            {...register('foodWastePct', { valueAsNumber: true })}
          />
          <span id="foodWastePct-hint" className="sr-only">Slider for percent of total food purchase discarded instead of consumed</span>
          <p className="text-[10px] text-slate-600">
            Average household discards roughly 25% of fresh purchases!
          </p>
        </div>

        {/* Local food percentage slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 tracking-wide">
            <label htmlFor="localFoodPct">
              Sourced Locally (%)
            </label>
            <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
              {currentLocalFood}%
            </span>
          </div>
          <input
            id="localFoodPct"
            type="range"
            min="0"
            max="100"
            step="5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-500"
            aria-describedby="localFoodPct-hint"
            {...register('localFoodPct', { valueAsNumber: true })}
          />
          <span id="localFoodPct-hint" className="sr-only">Slider for percent of purchase manufactured or grown within 150km range</span>
          <p className="text-[10px] text-slate-600">
            Higher local scores shrink complex global oceanic shipping miles.
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Key connection:</strong> Enteric fermentation in livestock (cows and sheep) is a strong emitter of biogenic methane gas, which yields ~28x more heat-trapping power than standard fuel CO2.
        </p>
      </div>
    </fieldset>
  );
}
