/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Folder, File, Sparkles, CheckCircle2, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { DIRECTORY_LAYOUT, ARCHITECTURE_ITEMS } from '../lib/constants';
import { FileNode, ArchitectureItem } from '../types';

export default function StructureExplorer() {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('components');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ '/src': true });

  const activeMetadata = ARCHITECTURE_ITEMS.find((item) => item.id === selectedFolderId) || ARCHITECTURE_ITEMS[0];

  const toggleExpand = (path: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderVisualTree = (nodes: FileNode[], depth = 0) => {
    return (
      <ul className="space-y-1" role="tree" aria-label="TerraTrack Project Directory System">
        {nodes.map((node) => {
          const isFolder = node.type === 'folder';
          const isExpanded = expandedNodes[node.path];
          const hasChildren = node.children && node.children.length > 0;
          const correspondingArchItem = ARCHITECTURE_ITEMS.find(item => `/src/${item.id}` === node.path || `/${item.id}` === node.path);
          const isSelected = correspondingArchItem?.id === selectedFolderId;

          return (
            <li key={node.path} role="treeitem" aria-expanded={isFolder ? isExpanded : undefined} className="block">
              <div 
                className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${
                  isSelected ? 'bg-emerald-50 border-l-4 border-emerald-600' : 'hover:bg-gray-100'
                }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {isFolder && hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleExpand(node.path)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 focus-visible:ring-2 focus-visible:ring-emerald-500"
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} folder ${node.name}`}
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  ) : (
                    <span className="w-5" />
                  )}

                  {isFolder ? (
                    <Folder className={`h-4 w-4 text-emerald-600 select-none flex-shrink-0`} aria-hidden="true" />
                  ) : (
                    <File className="h-4 w-4 text-gray-400 select-none flex-shrink-0" aria-hidden="true" />
                  )}

                  <span className={`font-mono text-sm tracking-tight truncate ${isFolder ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {node.name}
                  </span>
                </div>

                {correspondingArchItem && (
                  <button
                    type="button"
                    onClick={() => setSelectedFolderId(correspondingArchItem.id)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-emerald-500'
                    }`}
                    aria-label={`Inspect design specifications for ${node.name}`}
                  >
                    {isSelected ? 'Inspecting' : 'Inspect'}
                  </button>
                )}
              </div>

              {isFolder && isExpanded && hasChildren && node.children && (
                <div className="mt-1">
                  {renderVisualTree(node.children, depth + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const accessibilityStandards = [
    { rule: "Strict usage of semantic tags (<main>, <section>, <header>, <footer>)", focus: "Semantic layout accuracy" },
    { rule: "Sequential and clear heading layout structures with solid size hierarchies", focus: "Heading outlines" },
    { rule: "Complete absence of clickable raw generic elements or unlabelled links", focus: "Interaction flow" },
    { rule: "Strict native buttons (<button>) optimized with explicit tactile highlights", focus: "Screen reader ready" },
    { rule: "Absolute focus-visible halos surrounding active, keyboard selected nodes", focus: "Keyboard navigation" },
    { rule: "High levels of text color ratios (checked above WCAG 4.5:1 minimums)", focus: "Visual equity" }
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* File Tree Explorer (Cols 5) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-6" aria-labelledby="visual-tree-heading">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Layers className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h3 id="visual-tree-heading" className="text-lg font-bold text-gray-900">
            Interactive Tree Structure
          </h3>
        </div>
        <p className="text-xs text-gray-600 mb-4 font-sans leading-relaxed">
          The folders listed below represent the exact modular blueprint created. Choose <strong>Inspect</strong> to view code standards and module duties.
        </p>
        <div className="bg-gray-50/75 p-4 rounded-xl border border-gray-100 min-h-[340px]">
          {renderVisualTree(DIRECTORY_LAYOUT)}
        </div>
      </section>

      {/* Specification Desk and Checklist (Cols 6) */}
      <div className="space-y-6 lg:col-span-6">
        {/* Inspection Panel */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="inspection-heading">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <BookOpen className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 id="inspection-heading" className="text-lg font-bold text-gray-900">
              Module Duty Log: <span className="font-mono text-emerald-600 text-sm">{activeMetadata.name}</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Purpose</h4>
              <p className="text-sm text-gray-700 font-medium mt-1 leading-relaxed">
                {activeMetadata.purpose}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Core Responsibilities</h4>
              <ul className="mt-1.5 space-y-1.5">
                {activeMetadata.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Accessibility Directive
              </h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                {activeMetadata.accessibilityNotes}
              </p>
            </div>
          </div>
        </section>

        {/* Code of Ethics / Accessibility Checkoff */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="compliance-heading">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 id="compliance-heading" className="text-lg font-bold text-gray-900">
              WCAG AA Visual Checklist
            </h3>
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            These structural standards are guaranteed recursively within every node in this scaffolding:
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {accessibilityStandards.map((std, idx) => (
              <li 
                key={idx} 
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-gray-800">{std.focus}</p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[180px]" title={std.rule}>{std.rule}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
