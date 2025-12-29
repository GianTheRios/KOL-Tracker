'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  ArrowRight,
  RefreshCw,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ImportStep = 'upload' | 'mapping' | 'preview' | 'complete';

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      setStep('mapping');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStep('mapping');
    }
  };

  const handleImport = async () => {
    setImporting(true);
    // Simulate import
    await new Promise(resolve => setTimeout(resolve, 2000));
    setImporting(false);
    setStep('complete');
  };

  const resetImport = () => {
    setFile(null);
    setStep('upload');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
            <p className="text-zinc-400 mt-1">
              Import KOL data from Excel or CSV files
            </p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Download Template
          </Button>
        </div>
      </ScrollReveal>

      {/* Progress steps */}
      <ScrollReveal delay={0.1}>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {[
            { key: 'upload', label: 'Upload', icon: Upload },
            { key: 'mapping', label: 'Map Fields', icon: FileSpreadsheet },
            { key: 'preview', label: 'Preview', icon: Users },
            { key: 'complete', label: 'Complete', icon: CheckCircle },
          ].map((s, index) => {
            const stepIndex = ['upload', 'mapping', 'preview', 'complete'].indexOf(step);
            const currentIndex = index;
            const isActive = currentIndex === stepIndex;
            const isCompleted = currentIndex < stepIndex;
            const StepIcon = s.icon;

            return (
              <div key={s.key} className="flex items-center">
                <motion.div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
                    isActive && 'bg-indigo-500 text-white',
                    isCompleted && 'bg-emerald-500/15 text-emerald-500',
                    !isActive && !isCompleted && 'bg-zinc-800 text-zinc-500'
                  )}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                </motion.div>
                {index < 3 && (
                  <div className={cn(
                    'w-8 sm:w-12 h-0.5 mx-1 sm:mx-2',
                    isCompleted ? 'bg-emerald-500' : 'bg-border'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnimatedCard variant="glass" hover={false} className="p-8">
              <motion.div
                className={cn(
                  'border-2 border-dashed rounded-2xl p-12 text-center transition-all',
                  isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/15 text-indigo-400 mb-4"
                  animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                >
                  <Upload className="h-8 w-8" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {isDragging ? 'Drop your file here' : 'Upload your Excel file'}
                </h3>
                <p className="text-zinc-500 mb-6">
                  Drag and drop or click to browse. Supports .xlsx and .csv files.
                </p>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium cursor-pointer hover:from-violet-500 hover:to-indigo-500 transition-all duration-200">
                    Choose File
                  </span>
                </label>
              </motion.div>

              {/* Help section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Supported formats', desc: 'Excel (.xlsx) and CSV files' },
                  { title: 'Required fields', desc: 'Name, Platform, Profile URL' },
                  { title: 'Max file size', desc: 'Up to 10MB per file' },
                ].map((item) => (
                  <div key={item.title} className="text-center p-4 rounded-xl bg-zinc-800/50">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {step === 'mapping' && (
          <motion.div
            key="mapping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnimatedCard variant="glass" hover={false} className="p-6">
              {/* File info */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                  <div>
                    <p className="font-medium">{file?.name}</p>
                    <p className="text-sm text-zinc-500">
                      {((file?.size || 0) / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={resetImport}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Column mapping */}
              <h3 className="font-semibold mb-4">Map your columns</h3>
              <div className="space-y-3">
                {[
                  { source: 'Column A', target: 'Name', matched: true },
                  { source: 'Column B', target: 'Platform', matched: true },
                  { source: 'Column C', target: 'Profile Link', matched: true },
                  { source: 'Column D', target: 'YouTube Subscribers', matched: true },
                  { source: 'Column E', target: 'TikTok Followers', matched: true },
                  { source: 'Column F', target: 'Status', matched: false },
                  { source: 'Column K', target: 'Email', matched: true },
                  { source: 'Column L', target: 'Budget', matched: true },
                ].map((mapping, index) => (
                  <motion.div
                    key={mapping.source}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium">{mapping.source}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-500" />
                    <div className="flex-1">
                      <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
                        <option>{mapping.target}</option>
                        <option>Skip this column</option>
                      </select>
                    </div>
                    {mapping.matched ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={resetImport}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setStep('preview')} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue to Preview
                </Button>
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnimatedCard variant="glass" hover={false} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Preview Import</h3>
                  <p className="text-sm text-zinc-500">16 KOLs will be imported</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-sm text-emerald-500">
                    <CheckCircle className="h-4 w-4" />
                    14 valid
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-amber-500">
                    <AlertCircle className="h-4 w-4" />
                    2 warnings
                  </span>
                </div>
              </div>

              {/* Preview table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-700">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Name</th>
                      <th>Platforms</th>
                      <th>Followers</th>
                      <th>Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { valid: true, name: 'Crypto Wendy', platforms: 'YouTube, TikTok', followers: '557K', budget: '$15,000' },
                      { valid: true, name: 'Joshua Jake', platforms: 'TikTok', followers: '705K', budget: '$22,500' },
                      { valid: true, name: 'Rise Up Morning Show', platforms: 'TikTok, Twitter', followers: '485K', budget: '$18,000' },
                      { valid: false, name: 'Coach Ty', platforms: 'TikTok, Instagram', followers: '825K', budget: 'Missing' },
                      { valid: true, name: 'Jolly Green Investor', platforms: 'TikTok, Instagram', followers: '528K', budget: '$12,000' },
                    ].map((row, index) => (
                      <motion.tr
                        key={row.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>
                          {row.valid ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </td>
                        <td className="font-medium">{row.name}</td>
                        <td>{row.platforms}</td>
                        <td>{row.followers}</td>
                        <td className={!row.valid ? 'text-amber-500' : ''}>{row.budget}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep('mapping')} leftIcon={<ArrowRight className="h-4 w-4 rotate-180" />}>
                  Back to Mapping
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleImport} 
                  loading={importing}
                  leftIcon={<Upload className="h-4 w-4" />}
                  glow
                >
                  Import 16 KOLs
                </Button>
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mb-6"
            >
              <CheckCircle className="h-10 w-10" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Import Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-500 mb-8"
            >
              Successfully imported 16 KOLs to your roster
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-4"
            >
              <Button variant="secondary" onClick={resetImport} leftIcon={<RefreshCw className="h-4 w-4" />}>
                Import More
              </Button>
              <Button variant="primary" leftIcon={<Users className="h-4 w-4" />}>
                View Roster
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

