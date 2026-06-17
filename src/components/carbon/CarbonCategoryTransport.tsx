/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CarbonFormInput } from '../../types/carbon';
import { Car, Keyboard, Plane, Info } from 'lucide-react';

interface Props {
  register: UseFormRegister<CarbonFormInput>;
  errors: FieldErrors<CarbonFormInput>;
}

export default function CarbonCategoryTransport({ register, errors }: Props) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Transportation Carbon Factors</legend>
      
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Car className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h3 className="text-base font-bold text-gray-900">1. Transportation Footprint</h3>
      </div>
      
      <p className="text-xs text-gray-500 leading-relaxed max-w-prose">
        Transport counts for over 25% of average consumer greenhouse gas emissions. Enter your monthly travel habits below.
      </p>

      {/* Car Driving Field Block */}
      <div className="space-y-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Distance Driven */}
          <div>
            <label htmlFor="carDistance" className="block text-xs font-semibold text-gray-700 tracking-wide">
              Driving Distance (km / month)
            </label>
            <div className="relative mt-1">
              <input
                id="carDistance"
                type="number"
                step="any"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="e.g. 800"
                aria-describedby="carDistance-error carDistance-hint"
                {...register('carDistance', { valueAsNumber: true })}
              />
              <span id="carDistance-hint" className="sr-only">How many kilometers you drive your private car each month</span>
            </div>
            {errors.carDistance && (
              <p id="carDistance-error" className="mt-1 text-xs font-semibold text-rose-600">
                {errors.carDistance.message}
              </p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <label htmlFor="fuelType" className="block text-xs font-semibold text-gray-700 tracking-wide">
              Primary Vehicle Fuel & Powertrain
            </label>
            <select
              id="fuelType"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              aria-describedby="fuelType-hint"
              {...register('fuelType')}
            >
              <option value="petrol">Petrol (Standard Gasoline)</option>
              <option value="diesel">Diesel Powertrain</option>
              <option value="hybrid">Hybrid (Self-charging/Plug-in)</option>
              <option value="electric">Electric Vehicle (Grid Charged)</option>
            </select>
            <span id="fuelType-hint" className="sr-only">Select vehicle fuel type to estimate exact engine combustion factors</span>
          </div>
        </div>
      </div>

      {/* Public Transit Field Block */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="transitDistance" className="block text-xs font-semibold text-gray-700 tracking-wide">
            Public Transit Travel (km / month)
          </label>
          <div className="relative mt-1">
            <input
              id="transitDistance"
              type="number"
              step="any"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="e.g. 150"
              aria-describedby="transitDistance-error transitDistance-hint"
              {...register('transitDistance', { valueAsNumber: true })}
            />
            <span id="transitDistance-hint" className="sr-only">Total distance on commuter trains, subways, and municipal buses</span>
          </div>
          {errors.transitDistance && (
            <p id="transitDistance-error" className="mt-1 text-xs font-semibold text-rose-600">
              {errors.transitDistance.message}
            </p>
          )}
        </div>

        {/* Flight hours */}
        <div>
          <label htmlFor="flightHours" className="block text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1">
            <Plane className="h-3 w-3 text-gray-400" aria-hidden="true" />
            <span>Flight Duration (hours / month)</span>
          </label>
          <div className="relative mt-1">
            <input
              id="flightHours"
              type="number"
              step="any"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="e.g. 2"
              aria-describedby="flightHours-error flightHours-hint"
              {...register('flightHours', { valueAsNumber: true })}
            />
            <span id="flightHours-hint" className="sr-only">Average hours spent in flight per month (total annual duration divided by 12)</span>
          </div>
          {errors.flightHours && (
            <p id="flightHours-error" className="mt-1 text-xs font-semibold text-rose-600">
              {errors.flightHours.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Key insight:</strong> High-altitude flight loops produce double the warming effect of simple fuel combustion due to radiative forcing and vapor lanes.
        </p>
      </div>
    </fieldset>
  );
}
