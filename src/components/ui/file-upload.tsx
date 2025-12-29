'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Pencil,
} from 'lucide-react';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'invoice' | 'msa' | 'contract' | 'other';
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  autoDetected?: boolean;
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

const fileTypeConfig: Record<UploadedFile['type'], { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: string;
}> = {
  invoice: { 
    label: 'Invoice', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
    icon: '💰',
  },
  msa: { 
    label: 'MSA', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/30',
    icon: '📋',
  },
  contract: { 
    label: 'Contract', 
    color: 'text-violet-400', 
    bgColor: 'bg-violet-500/15',
    borderColor: 'border-violet-500/30',
    icon: '📝',
  },
  other: { 
    label: 'Document', 
    color: 'text-zinc-400', 
    bgColor: 'bg-zinc-500/15',
    borderColor: 'border-zinc-500/30',
    icon: '📄',
  },
};

const fileTypes: UploadedFile['type'][] = ['invoice', 'msa', 'contract', 'other'];

function detectFileType(filename: string): { type: UploadedFile['type']; confidence: 'high' | 'medium' | 'low' } {
  const lower = filename.toLowerCase();
  
  // High confidence matches
  if (lower.includes('invoice') || lower.includes('inv_') || lower.includes('inv-')) {
    return { type: 'invoice', confidence: 'high' };
  }
  if (lower.includes('msa') || lower.includes('master service') || lower.includes('master_service')) {
    return { type: 'msa', confidence: 'high' };
  }
  if (lower.includes('contract') || lower.includes('agreement') || lower.includes('agmt')) {
    return { type: 'contract', confidence: 'high' };
  }
  
  // Medium confidence matches
  if (lower.includes('bill') || lower.includes('payment') || lower.includes('receipt')) {
    return { type: 'invoice', confidence: 'medium' };
  }
  if (lower.includes('terms') || lower.includes('scope') || lower.includes('sow')) {
    return { type: 'contract', confidence: 'medium' };
  }
  
  return { type: 'other', confidence: 'low' };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Type Selector Component
function TypeSelector({ 
  currentType, 
  autoDetected,
  onChange,
}: { 
  currentType: UploadedFile['type'];
  autoDetected: boolean;
  onChange: (type: UploadedFile['type']) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const config = fileTypeConfig[currentType];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
          'hover:ring-2 hover:ring-indigo-500/30',
          config.bgColor,
          config.borderColor,
        )}
      >
        <span className="text-base">{config.icon}</span>
        <span className={cn('text-sm font-medium', config.color)}>
          {config.label}
        </span>
        <ChevronDown className={cn(
          'h-3.5 w-3.5 transition-transform',
          config.color,
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Auto-detected indicator */}
      <div className="flex items-center gap-1 mt-1.5">
        {autoDetected ? (
          <>
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] text-amber-400/80">Auto-detected</span>
          </>
        ) : (
          <>
            <Pencil className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-500">Manually set</span>
          </>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 z-20 min-w-[140px] py-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl"
            >
              {fileTypes.map((type) => {
                const typeConfig = fileTypeConfig[type];
                const isSelected = type === currentType;
                
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onChange(type);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2 text-left transition-colors',
                      isSelected 
                        ? 'bg-indigo-500/20 text-white' 
                        : 'text-zinc-300 hover:bg-zinc-700/50'
                    )}
                  >
                    <span className="text-base">{typeConfig.icon}</span>
                    <span className="text-sm">{typeConfig.label}</span>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileUpload({
  files,
  onFilesChange,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
  maxFiles = 10,
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList) => {
    setError(null);
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      // Check max files
      if (files.length + newFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
        return;
      }

      // Check for duplicates
      if (files.some(f => f.name === file.name)) {
        setError(`File "${file.name}" already added`);
        return;
      }

      const detection = detectFileType(file.name);

      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: detection.type,
        status: 'success',
        autoDetected: detection.confidence !== 'low',
      });
    });

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
    }
  }, [files, maxFiles, maxSize, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    // Reset input
    e.target.value = '';
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  const updateFileType = useCallback((id: string, type: UploadedFile['type']) => {
    onFilesChange(files.map(f => f.id === id ? { ...f, type, autoDetected: false } : f));
  }, [files, onFilesChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <motion.label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center',
          'w-full h-36 rounded-xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200',
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
        )}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      >
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple
          onChange={handleFileInput}
        />
        
        <motion.div
          animate={isDragging ? { y: -5 } : { y: 0 }}
          className="flex flex-col items-center text-center px-4"
        >
          <div className={cn(
            'p-3 rounded-full mb-3',
            isDragging ? 'bg-indigo-500/20' : 'bg-zinc-700/50'
          )}>
            <Upload className={cn(
              'h-5 w-5',
              isDragging ? 'text-indigo-400' : 'text-zinc-400'
            )} />
          </div>
          <p className="text-sm text-white font-medium">
            {isDragging ? 'Drop files here' : 'Drop documents here'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            MSAs, Invoices, Contracts • PDF, DOC, XLS up to {maxSize}MB
          </p>
        </motion.div>
      </motion.label>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List - Enhanced Cards */}
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative p-4 bg-zinc-800/70 rounded-xl border border-zinc-700/50 group"
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className={cn(
                'p-3 rounded-xl',
                fileTypeConfig[file.type].bgColor,
              )}>
                {file.name.endsWith('.pdf') ? (
                  <FileText className={cn('h-6 w-6', fileTypeConfig[file.type].color)} />
                ) : (
                  <File className={cn('h-6 w-6', fileTypeConfig[file.type].color)} />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate mb-1">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-500 mb-3">
                  {formatFileSize(file.size)}
                </p>

                {/* Type Selector */}
                <TypeSelector
                  currentType={file.type}
                  autoDetected={file.autoDetected ?? false}
                  onChange={(type) => updateFileType(file.id, type)}
                />
              </div>

              {/* Status & Remove */}
              <div className="flex flex-col items-end gap-2">
                {file.status === 'success' && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Uploaded</span>
                  </div>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
