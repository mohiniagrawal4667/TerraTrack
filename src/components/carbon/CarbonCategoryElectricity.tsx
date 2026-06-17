/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CarbonFormInput } from '../../types/carbon';
import { Flame, Lightbulb, Fuel, Info } from 'lucide-react';

interface Props {
  register: UseFormRegister<CarbonFormInput>;
  errors: FieldErrors<CarbonFormInput>;
}

export default function CarbonCategoryElectricity({ register, errors }: Props) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Home Utility Carbon Factors</legend>

      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Lightbulb className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h3 className="text-base font-bold text-gray-900">2. Home Utilities & Power</h3>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
        Domestic energy represents a massive share of household emissions. Record the kilowatt-hours of power and heating your home consumes.
      </p>

      {/* Grid Electricity */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div>
          <label htmlFor="electricityUsage" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            <span>Monthly Grid Electricity (kWh)</span>
          </label>
          <div className="relative mt-1">
            <input
              id="electricityUsage"
              type="number"
              step="any"
              className="block w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="e.g. 350"
              aria-describedby="electricityUsage-error electricityUsage-hint"
              {...register('electricityUsage', { valueAsNumber: true })}
            />
            <span id="electricityUsage-hint" className="sr-only">Average kilowatt-hours of electrical usage on your monthly utility bill</span>
          </div>
          {errors.electricityUsage && (
            <p id="electricityUsage-error" className="mt-1 text-xs font-semibold text-rose-600">
              {errors.electricityUsage.message}
            </p>
          )}
        </div>
      </div>

      {/* Heating Fuels Grid */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Heating Fuel Type */}
          <div>
            <label htmlFor="heatingType" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              <span>Primary Home Heating Fuel</span>
            </label>
            <select
              id="heatingType"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              aria-describedby="heatingType-hint"
              {...register('heatingType')}
            >
              <option value="natural_gas">Natural Gas Burner</option>
              <option value="heating_oil">Commercial Heating Oil</option>
              <option value="electricity">Electric Heat (Heat Pump / Furnace)</option>
              <option value="biomass">Biomass / Firewood / Wood Pellets</option>
            </select>
            <span id="heatingType-hint" className="sr-only">Type of heating fuel source used to warm the rooms and heat running water</span>
          </div>

          {/* Heating Usage */}
          <div>
            <label htmlFor="heatingUsage" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
              <span>Heating Fuel Consumed (kWh / month)</span>
            </label>
            <div className="relative mt-1">
              <input
                id="heatingUsage"
                type="number"
                step="any"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="e.g. 500"
                aria-describedby="heatingUsage-error heatingUsage-hint"
                {...register('heatingUsage', { valueAsNumber: true })}
              />
              <span id="heatingUsage-hint" className="sr-only">Assumed heating fuel energy rating converted to kilowatt-hours</span>
            </div>
            {errors.heatingUsage && (
              <p id="heatingUsage-error" className="mt-1 text-xs font-semibold text-rose-600">
                {errors.heatingUsage.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Pro-tip:</strong> Electric heat pumps typically achieve efficiency levels of 300% to 400% (COPs of 3–4), which slashes primary thermodynamic emissions down to a third compared to natural gas boilers.
        </p>
      </div>
    </fieldset>
  );
}
