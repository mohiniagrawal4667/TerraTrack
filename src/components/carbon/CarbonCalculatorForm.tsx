/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CarbonFormSchema, CarbonFormInput, CarbonFootprintResult } from '../../types/carbon';
import { calculateCarbonFootprint } from '../../lib/carbonCalculations';
import CarbonCategoryTransport from './CarbonCategoryTransport';
import CarbonCategoryElectricity from './CarbonCategoryElectricity';
import CarbonCategoryFood from './CarbonCategoryFood';
import CarbonCategoryWaste from './CarbonCategoryWaste';
import { ArrowRight, ArrowLeft, CheckCircle2, Navigation } from 'lucide-react';

interface Props {
  onSuccess: (result: CarbonFootprintResult) => void;
}

type TabType = 'transport' | 'electricity' | 'food' | 'waste';

export default function CarbonCalculatorForm({ onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('transport');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm<CarbonFormInput>({
    resolver: zodResolver(CarbonFormSchema),
    defaultValues: {
      carDistance: 450,
      fuelType: 'petrol',
      transitDistance: 120,
      flightHours: 1,
      electricityUsage: 310,
      heatingType: 'natural_gas',
      heatingUsage: 400,
      dietType: 'medium_meat',
      foodWastePct: 20,
      localFoodPct: 30,
      wasteBags: 3,
      recyclingLevel: 'some',
      compostsOrganics: false
    }
  });

  const tabs: { id: TabType; name: string }[] = [
    { id: 'transport', name: 'Transport' },
    { id: 'electricity', name: 'Home Utilities' },
    { id: 'food', name: 'Dietary habits' },
    { id: 'waste', name: 'Waste management' }
  ];

  const handleStepNext = async (current: TabType, next: TabType) => {
    // Validate current fields before switching tabs triggers
    let fieldsToVerify: (keyof CarbonFormInput)[] = [];
    if (current === 'transport') fieldsToVerify = ['carDistance', 'transitDistance', 'flightHours'];
    else if (current === 'electricity') fieldsToVerify = ['electricityUsage', 'heatingUsage'];
    
    const isValid = await trigger(fieldsToVerify);
    if (isValid) {
      setActiveTab(next);
    }
  };

  const onSubmit = (data: CarbonFormInput) => {
    const finalCalculations = calculateCarbonFootprint(data);
    onSuccess(finalCalculations);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Category Selection Tabs bar */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px gap-x-2" aria-label="Carbon categories">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStepNext(activeTab, tab.id)}
                className={`py-2.5 px-3 border-b-2 font-semibold text-xs tracking-wide uppercase cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
                  isSelected
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/25'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={isSelected ? 'page' : undefined}
                aria-label={`Switch to ${tab.name} section`}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Render subcomponents based on selected path */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col justify-between">
        <div className="flex-1">
          {activeTab === 'transport' && (
            <CarbonCategoryTransport register={register} errors={errors} />
          )}

          {activeTab === 'electricity' && (
            <CarbonCategoryElectricity register={register} errors={errors} />
          )}

          {activeTab === 'food' && (
            <CarbonCategoryFood register={register} watch={watch} errors={errors} />
          )}

          {activeTab === 'waste' && (
            <CarbonCategoryWaste register={register} watch={watch} errors={errors} />
          )}
        </div>

        {/* Sequential Stepper bottom control row */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div>
            {activeTab !== 'transport' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'electricity') setActiveTab('transport');
                  else if (activeTab === 'food') setActiveTab('electricity');
                  else if (activeTab === 'waste') setActiveTab('food');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer select-none"
                aria-label="Navigate to previous section"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div>
            {activeTab !== 'waste' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'transport') handleStepNext('transport', 'electricity');
                  else if (activeTab === 'electricity') handleStepNext('electricity', 'food');
                  else if (activeTab === 'food') handleStepNext('food', 'waste');
                }}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-lg text-white font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer select-none"
                aria-label="Confirm current values and skip to next section"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 text-xs font-mono font-bold rounded-lg text-white uppercase tracking-wider cursor-pointer border border-emerald-600 shadow-md select-none"
                aria-label="Calculate final carbon footprint summary report"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-white" aria-hidden="true" />
                <span>Calculate Footprint</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
