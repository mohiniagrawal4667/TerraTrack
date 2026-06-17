/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white" aria-hidden="true">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              TerraTrack
            </h1>
            <p className="font-sans text-xs tracking-wide text-gray-500 uppercase">
              Project Scaffold
            </p>
          </div>
        </div>

        {/* Accessibility badge */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>WCAG 2.1 AA Compliant</span>
        </div>
      </div>
    </header>
  );
}
