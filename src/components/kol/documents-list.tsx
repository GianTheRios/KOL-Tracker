'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KOLDocument, DocumentType } from '@/types';
import { Button, IconButton } from '@/components/ui/button';
import { getStorageService } from '@/lib/supabase/storage-service';
import { cn } from '@/lib/utils';
import {
  Plus,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  Upload,
  FolderOpen,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface DocumentsListProps {
  kolId: string;
  documents: KOLDocument[];
  onAddDocuments: (docs: KOLDocument[]) => void;
  onDeleteDocument: (doc: KOLDocument) => void;
}

// ============================================
// CONSTANTS
// ============================================

const documentTypeConfig: Record<DocumentType, {
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

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectDocumentType(filename: string): DocumentType {
  const lower = filename.toLowerCase();
  if (lower.includes('invoice') || lower.includes('inv_') || lower.includes('bill')) {
    return 'invoice';
  }
  if (lower.includes('msa') || lower.includes('master service')) {
    return 'msa';
  }
  if (lower.includes('contract') || lower.includes('agreement') || lower.includes('agmt')) {
    return 'contract';
  }
  return 'other';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ============================================
// SUB-COMPONENTS
// ============================================

function DocumentCard({
  doc,
  index,
  onDelete,
}: {
  doc: KOLDocument;
  index: number;
  onDelete: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const config = documentTypeConfig[doc.type];
  const storageService = getStorageService();

  const handleDownload = async () => {
    if (!doc.url) return;
    
    setIsDownloading(true);
    try {
      // If we have a file_path, get a fresh signed URL
      if (doc.file_path) {
        const url = await storageService.getSignedUrl(doc.file_path);
        if (url) {
          window.open(url, '_blank');
        }
      } else if (doc.url) {
        window.open(doc.url, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = async () => {
    if (doc.file_path) {
      const url = await storageService.getSignedUrl(doc.file_path);
      if (url) window.open(url, '_blank');
    } else if (doc.url) {
      window.open(doc.url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Document Icon */}
        <div className={cn('p-3 rounded-xl', config.bgColor)}>
          <FileText className={cn('h-6 w-6', config.color)} />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
              config.bgColor,
              config.borderColor,
              config.color,
            )}>
              <span>{config.icon}</span>
              {config.label}
            </span>
            {doc.file_path && (
              <span className="text-xs text-emerald-400">● Uploaded</span>
            )}
          </div>

          <p className="text-sm text-white font-medium truncate mb-1">
            {doc.name}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(doc.uploaded_at)}
            </span>
            <span>{formatFileSize(doc.size)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {(doc.url || doc.file_path) && (
            <IconButton
              variant="ghost"
              size="sm"
              icon={<ExternalLink className="h-4 w-4" />}
              onClick={handleView}
              className="text-zinc-500 hover:text-white"
            />
          )}
          <IconButton
            variant="ghost"
            size="sm"
            icon={isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            onClick={handleDownload}
            disabled={isDownloading || (!doc.url && !doc.file_path)}
            className="text-zinc-500 hover:text-white"
          />
          <IconButton
            variant="ghost"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={onDelete}
            className="text-zinc-500 hover:text-red-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 mb-4">
        <FolderOpen className="h-6 w-6 text-zinc-500" />
      </div>
      <h4 className="text-base font-medium text-white mb-2">No documents yet</h4>
      <p className="text-sm text-zinc-500 mb-4">
        Upload contracts, invoices, and MSAs
      </p>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Upload className="h-4 w-4" />}
        onClick={onUpload}
      >
        Upload Document
      </Button>
    </motion.div>
  );
}

function UploadZone({
  isOpen,
  onClose,
  onUpload,
  kolId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (docs: KOLDocument[]) => void;
  kolId: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const storageService = getStorageService();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (fileList: FileList) => {
    setError(null);
    setIsUploading(true);
    const newDocs: KOLDocument[] = [];
    const files = Array.from(fileList);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);

      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds 10MB limit`);
        continue;
      }

      try {
        // Upload to Supabase Storage
        const result = await storageService.uploadDocument(file, kolId);
        
        newDocs.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          kol_id: kolId,
          name: file.name,
          type: detectDocumentType(file.name),
          size: file.size,
          url: result.url,
          file_path: result.path,
          uploaded_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Upload error:', err);
        setError(`Failed to upload "${file.name}"`);
      }
    }

    setIsUploading(false);
    setUploadProgress('');

    if (newDocs.length > 0) {
      onUpload(newDocs);
      onClose();
    }
  }, [onUpload, onClose, kolId, storageService]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  }, [processFiles]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4"
    >
      <motion.label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center',
          'w-full h-32 rounded-xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200',
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
        )}
      >
        <input
          type="file"
          className="sr-only"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          multiple
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center text-center px-4">
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 mb-2 text-indigo-400 animate-spin" />
              <p className="text-sm text-white font-medium">Uploading...</p>
              <p className="text-xs text-zinc-500 mt-1">{uploadProgress}</p>
            </>
          ) : (
            <>
              <Upload className={cn(
                'h-6 w-6 mb-2',
                isDragging ? 'text-indigo-400' : 'text-zinc-400'
              )} />
              <p className="text-sm text-white font-medium">
                {isDragging ? 'Drop files here' : 'Drop documents here'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                PDF, DOC, XLS up to 10MB
              </p>
            </>
          )}
        </div>
      </motion.label>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mt-2 text-sm text-red-400"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      <div className="flex justify-end mt-2">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DocumentsList({
  kolId,
  documents,
  onAddDocuments,
  onDeleteDocument,
}: DocumentsListProps) {
  const [showUpload, setShowUpload] = useState(false);

  // Group documents by type
  const groupedDocs = {
    contract: documents.filter(d => d.type === 'contract'),
    msa: documents.filter(d => d.type === 'msa'),
    invoice: documents.filter(d => d.type === 'invoice'),
    other: documents.filter(d => d.type === 'other'),
  };

  const hasDocuments = documents.length > 0;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <AnimatePresence>
        <UploadZone
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={onAddDocuments}
          kolId={kolId}
        />
      </AnimatePresence>

      {/* Header with Upload Button */}
      {hasDocuments && !showUpload && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowUpload(true)}
          >
            Add Document
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!hasDocuments && !showUpload && (
        <EmptyState onUpload={() => setShowUpload(true)} />
      )}

      {/* Document Groups */}
      {hasDocuments && (
        <div className="space-y-6">
          {/* Contracts */}
          {groupedDocs.contract.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <span>📝</span> Contracts ({groupedDocs.contract.length})
              </h4>
              <div className="space-y-2">
                {groupedDocs.contract.map((doc, i) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    index={i}
                    onDelete={() => onDeleteDocument(doc)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* MSAs */}
          {groupedDocs.msa.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <span>📋</span> MSAs ({groupedDocs.msa.length})
              </h4>
              <div className="space-y-2">
                {groupedDocs.msa.map((doc, i) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    index={i}
                    onDelete={() => onDeleteDocument(doc)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {groupedDocs.invoice.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <span>💰</span> Invoices ({groupedDocs.invoice.length})
              </h4>
              <div className="space-y-2">
                {groupedDocs.invoice.map((doc, i) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    index={i}
                    onDelete={() => onDeleteDocument(doc)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other */}
          {groupedDocs.other.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <span>📄</span> Other Documents ({groupedDocs.other.length})
              </h4>
              <div className="space-y-2">
                {groupedDocs.other.map((doc, i) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    index={i}
                    onDelete={() => onDeleteDocument(doc)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

