/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  description: string;
  children?: FileNode[];
}

export interface ArchitectureItem {
  id: string;
  name: string;
  purpose: string;
  responsibilities: string[];
  accessibilityNotes: string;
}
