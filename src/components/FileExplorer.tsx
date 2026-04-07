'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, File, Code, Image, FileText, Archive, ChevronRight, ChevronDown } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
  extension?: string;
  children?: FileItem[];
  content?: string;
}

interface FileExplorerProps {
  className?: string;
}

export default function FileExplorer({ className = '' }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const fileSystem: FileItem[] = [
    {
      id: '1',
      name: 'projects',
      type: 'folder',
      modified: '2024-12-01',
      children: [
        {
          id: '1-1',
          name: 'portfolio',
          type: 'folder',
          modified: '2024-12-01',
          children: [
            {
              id: '1-1-1',
              name: 'app',
              type: 'folder',
              children: [
                {
                  id: '1-1-1-1',
                  name: 'page.tsx',
                  type: 'file',
                  extension: 'tsx',
                  size: '15.2 KB',
                  modified: '2024-12-01',
                  content: 'export default function Portfolio() { ... }'
                },
                {
                  id: '1-1-1-2',
                  name: 'layout.tsx',
                  type: 'file',
                  extension: 'tsx',
                  size: '3.8 KB',
                  modified: '2024-12-01',
                  content: 'export default function RootLayout() { ... }'
                }
              ]
            },
            {
              id: '1-1-2',
              name: 'src',
              type: 'folder',
              children: [
                {
                  id: '1-1-2-1',
                  name: 'components',
                  type: 'folder',
                  children: [
                    {
                      id: '1-1-2-1-1',
                      name: 'Terminal.tsx',
                      type: 'file',
                      extension: 'tsx',
                      size: '8.4 KB',
                      modified: '2024-12-01'
                    },
                    {
                      id: '1-1-2-1-2',
                      name: 'BootSequence.tsx',
                      type: 'file',
                      extension: 'tsx',
                      size: '4.2 KB',
                      modified: '2024-12-01'
                    }
                  ]
                },
                {
                  id: '1-1-2-2',
                  name: 'data',
                  type: 'folder',
                  children: [
                    {
                      id: '1-1-2-2-1',
                      name: 'portfolio.ts',
                      type: 'file',
                      extension: 'ts',
                      size: '2.1 KB',
                      modified: '2024-12-01'
                    }
                  ]
                }
              ]
            },
            {
              id: '1-1-3',
              name: 'package.json',
              type: 'file',
              extension: 'json',
              size: '1.8 KB',
              modified: '2024-12-01'
            },
            {
              id: '1-1-4',
              name: 'README.md',
              type: 'file',
              extension: 'md',
              size: '4.5 KB',
              modified: '2024-12-01'
            }
          ]
        },
        {
          id: '1-2',
          name: 'ecommerce',
          type: 'folder',
          modified: '2024-11-28',
          children: [
            {
              id: '1-2-1',
              name: 'index.js',
              type: 'file',
              extension: 'js',
              size: '22.1 KB',
              modified: '2024-11-28'
            },
            {
              id: '1-2-2',
              name: 'styles.css',
              type: 'file',
              extension: 'css',
              size: '8.7 KB',
              modified: '2024-11-28'
            }
          ]
        },
        {
          id: '1-3',
          name: 'cli-tool',
          type: 'folder',
          modified: '2024-11-25',
          children: [
            {
              id: '1-3-1',
              name: 'index.js',
              type: 'file',
              extension: 'js',
              size: '12.3 KB',
              modified: '2024-11-25'
            },
            {
              id: '1-3-2',
              name: 'package.json',
              type: 'file',
              extension: 'json',
              size: '1.2 KB',
              modified: '2024-11-25'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'config',
      type: 'folder',
      modified: '2024-12-01',
      children: [
        {
          id: '2-1',
          name: 'next.config.js',
          type: 'file',
          extension: 'js',
          size: '1.1 KB',
          modified: '2024-12-01'
        },
        {
          id: '2-2',
          name: 'tailwind.config.js',
          type: 'file',
          extension: 'js',
          size: '2.3 KB',
          modified: '2024-12-01'
        }
      ]
    },
    {
      id: '3',
      name: 'public',
      type: 'folder',
      modified: '2024-11-30',
      children: [
        {
          id: '3-1',
          name: 'projects',
          type: 'folder',
          children: [
            {
              id: '3-1-1',
              name: 'portfolio.png',
              type: 'file',
              extension: 'png',
              size: '245.8 KB',
              modified: '2024-11-30'
            },
            {
              id: '3-1-2',
              name: 'ecommerce.png',
              type: 'file',
              extension: 'png',
              size: '189.3 KB',
              modified: '2024-11-28'
            }
          ]
        },
        {
          id: '3-2',
          name: 'favicon.ico',
          type: 'file',
          extension: 'ico',
          size: '25.9 KB',
          modified: '2024-11-15'
        }
      ]
    },
    {
      id: '4',
      name: '.gitignore',
      type: 'file',
      extension: '',
      size: '0.5 KB',
      modified: '2024-11-01'
    },
    {
      id: '5',
      name: 'LICENSE',
      type: 'file',
      extension: '',
      size: '1.1 KB',
      modified: '2024-11-01'
    }
  ];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return expandedFolders.has(item.id) ? 
        <FolderOpen size={16} className="text-green-500" /> : 
        <Folder size={16} className="text-green-500" />;
    }

    const iconMap = {
      'js': <Code size={16} className="text-yellow-400" />,
      'jsx': <Code size={16} className="text-blue-400" />,
      'ts': <Code size={16} className="text-blue-500" />,
      'tsx': <Code size={16} className="text-cyan-400" />,
      'css': <FileText size={16} className="text-purple-400" />,
      'json': <FileText size={16} className="text-gray-400" />,
      'md': <FileText size={16} className="text-green-400" />,
      'png': <Image size={16} className="text-pink-400" />,
      'jpg': <Image size={16} className="text-pink-400" />,
      'jpeg': <Image size={16} className="text-pink-400" />,
      'ico': <Image size={16} className="text-orange-400" />,
      'zip': <Archive size={16} className="text-yellow-500" />
    };

    return iconMap[item.extension as keyof typeof iconMap] || 
           <File size={16} className="text-green-400" />;
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
      >
        <div
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-green-500/10 transition-colors rounded ${
            selectedFile?.id === item.id ? 'bg-green-500/20' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              setSelectedFile(item);
            }
          }}
        >
          {item.type === 'folder' && (
            <ChevronRight
              size={12}
              className={`text-green-600 transition-transform ${
                expandedFolders.has(item.id) ? 'rotate-90' : ''
              }`}
            />
          )}
          {getFileIcon(item)}
          <span className="text-green-300 font-mono text-sm">{item.name}</span>
          {item.type === 'file' && (
            <span className="text-green-600 text-xs ml-auto">
              {formatFileSize(item.size || '0 KB')}
            </span>
          )}
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </motion.div>
    ));
  };

  return (
    <div className={`border-2 border-green-500 bg-black font-mono text-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-green-500 bg-black/50 p-3 flex items-center gap-2">
        <Folder size={16} className="text-green-500" />
        <span className="text-green-500 font-bold">FILE_EXPLORER</span>
        <div className="flex-1 text-right text-xs text-green-600">
          {fileSystem.length} items
        </div>
      </div>

      <div className="flex">
        {/* File Tree */}
        <div className="flex-1 border-r border-green-500 max-h-96 overflow-y-auto p-2">
          {renderFileTree(fileSystem)}
        </div>

        {/* File Preview */}
        <div className="w-1/2 p-4">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile)}
                <span className="text-green-400 font-bold">{selectedFile.name}</span>
              </div>
              
              <div className="space-y-2 text-xs text-green-600">
                <div>Type: {selectedFile.type}</div>
                {selectedFile.size && <div>Size: {selectedFile.size}</div>}
                {selectedFile.modified && <div>Modified: {selectedFile.modified}</div>}
                {selectedFile.extension && <div>Extension: {selectedFile.extension}</div>}
              </div>

              {selectedFile.content && (
                <div className="border border-green-500 bg-black/50 p-3">
                  <div className="text-green-300 text-xs font-mono whitespace-pre-wrap">
                    {selectedFile.content}
                  </div>
                </div>
              )}

              {selectedFile.extension && ['js', 'jsx', 'ts', 'tsx', 'css', 'json', 'md'].includes(selectedFile.extension) && (
                <div className="text-green-600 text-xs">
                  Double-click to open in editor
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-green-600 py-8">
              <File size={32} className="mx-auto mb-2 opacity-50" />
              <div className="text-xs">Select a file to preview</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-500 bg-black/50 p-2">
        <div className="text-xs text-green-600 text-center">
          {selectedFile ? `Selected: ${selectedFile.name}` : 'No file selected'}
        </div>
      </div>
    </div>
  );
}
