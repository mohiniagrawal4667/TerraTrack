/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchitectureItem, FileNode } from '../types';

export const DIRECTORY_LAYOUT: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    description: 'Root folder enclosing clean feature-by-feature modular code.',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: '/src/components',
        description: 'Houses atomic, presentation, and layout components under 200 lines.',
        children: [
          { name: 'Header.tsx', type: 'file', path: '/src/components/Header.tsx', description: 'Semantic, responsive header matching WCAG standards.' },
          { name: 'Footer.tsx', type: 'file', path: '/src/components/Footer.tsx', description: 'Semantic copyright and external linkages structure.' },
          { name: 'StructureExplorer.tsx', type: 'file', path: '/src/components/StructureExplorer.tsx', description: 'High-contrast widget representing package structures.' }
        ]
      },
      {
        name: 'hooks',
        type: 'folder',
        path: '/src/hooks',
        description: 'Hosts reusable, side-effect-free React hooks with precise type parameters.',
        children: [
          { name: 'useLocalStorage.ts', type: 'file', path: '/src/hooks/useLocalStorage.ts', description: 'Type-safe local state persistence module.' }
        ]
      },
      {
        name: 'lib',
        type: 'folder',
        path: '/src/lib',
        description: 'Stores system config, third-party settings, and global static states.',
        children: [
          { name: 'constants.ts', type: 'file', path: '/src/lib/constants.ts', description: 'Centralized architecture and naming declarations.' }
        ]
      },
      {
        name: 'types',
        type: 'folder',
        path: '/src/types',
        description: 'Contains TypeScript types/interfaces/enums to enforce robust type safety.',
        children: [
          { name: 'index.ts', type: 'file', path: '/src/types/index.ts', description: 'Strong interfaces defining system entities.' }
        ]
      },
      {
        name: 'tests',
        type: 'folder',
        path: '/src/tests',
        description: 'Includes automated, isolated logical validations.',
        children: [
          { name: 'structure.test.ts', type: 'file', path: '/src/tests/structure.test.ts', description: 'Basic testing configuration scaffolding.' }
        ]
      }
    ]
  }
];

export const ARCHITECTURE_ITEMS: ArchitectureItem[] = [
  {
    id: 'components',
    name: 'src/components/',
    purpose: 'Modular presentation elements strictly conforming to individual focus limits.',
    responsibilities: [
      'Render UI controls leveraging premium, high-contrast themes.',
      'Maintain semantic DOM layout hierarchy (buttons, headers, footers).',
      'Contain complete accessibility tags including aria, role, and focus-traps.'
    ],
    accessibilityNotes: 'Each component utilizes the native HTML keyboard triggers (Space/Enter) and explicit focus-ring colors.'
  },
  {
    id: 'hooks',
    name: 'src/hooks/',
    purpose: 'Abstracting core logical lifecycles completely out of view files.',
    responsibilities: [
      'Encapsulate local caches, window measurements, or element size watchers.',
      'Protect application views from complex and unstable side effects.',
      'Strictly return memoized setters and values to prevent unnecessary renders.'
    ],
    accessibilityNotes: 'Ensures state synchronization is isolated and safe, keeping keyboard-focusable items robust.'
  },
  {
    id: 'lib',
    name: 'src/lib/',
    purpose: 'Providing stable configurations and utility modules.',
    responsibilities: [
      'Host pure functional helpers and formatters.',
      'Declare immutable application constants and styling configuration tokens.',
      'Organize environment bindings elegantly without leaking private keys.'
    ],
    accessibilityNotes: 'Holds theme values that satisfy WCAG 2.1 AA 4.5:1 color contrast rules.'
  },
  {
    id: 'types',
    name: 'src/types/',
    purpose: 'Enforcing compiler verification and eliminating dangerous implicit "any" types.',
    responsibilities: [
      'Register solid structural schemas for business domain nodes.',
      'Formally define parameters, callbacks, events, and option payloads.',
      'Standardize compiler types to ensure pristine developer experiences.'
    ],
    accessibilityNotes: 'Guarantees that input element types are strictly checked against respective dynamic field models.'
  },
  {
    id: 'tests',
    name: 'src/tests/',
    purpose: 'Automating the validation of individual pure logic utilities.',
    responsibilities: [
      'Write highly deterministic specs with mock assertions.',
      'Validate accessibility boundaries or storage adapters automatically.',
      'Guard against future structural regressions.'
    ],
    accessibilityNotes: 'Ensures assertions cover essential keyboard interactors and custom dynamic behaviors.'
  }
];
