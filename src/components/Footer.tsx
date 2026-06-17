/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, FileCode } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Metadata */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <FileCode className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span>TerraTrack Engine Blueprint</span>
            </div>
            <p className="text-center text-xs text-gray-500 md:text-left">
              &copy; {currentYear} TerraTrack. Designed with absolute compliance and modular components.
            </p>
          </div>

          {/* Core Specifications */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <span className="text-gray-500">React 19</span>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <span className="text-gray-500">TypeScript 5.8</span>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <span className="text-gray-500">Vite 6</span>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <span className="text-gray-500">Tailwind CSS 4</span>
          </div>

          {/* Actions & Links */}
          <div className="flex items-center gap-3">
            <a
              href="#top"
              className="rounded-md px-3 py-1 text-xs font-semibold text-gray-700 underline hover:text-emerald-700 hover:bg-gray-100 transition-colors"
              aria-label="Back to top of the page"
            >
              Back to Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
