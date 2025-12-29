'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerSection } from '@/components/ui/drawer';
import { Button, IconButton } from '@/components/ui/button';
import { Input, SelectInput } from '@/components/ui/input';
import { FileUpload, UploadedFile } from '@/components/ui/file-upload';
import { KOLStatus, Platform, KOLProfile, KOLPlatform } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface PlatformEntry {
  id: string;
  platform: Platform;
  profileUrl: string;
  followerCount: string;
}

export interface KOLFormData {
  name: string;
  email: string;
  telegramHandle: string;
  status: KOLStatus;
  platforms: PlatformEntry[];
  documents: UploadedFile[];
}

interface KOLFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KOLFormData) => void;
  mode: 'add' | 'edit';
  /** KOL data to pre-populate when in edit mode */
  initialData?: KOLProfile & {
    platforms?: KOLPlatform[];
  };
}

// ============================================
// CONSTANTS
// ============================================

const platformOptions = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'in_contact', label: 'In Contact' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'contracted', label: 'Contracted' },
  { value: 'invoiced', label: 'Invoiced' },
  { value: 'paid', label: 'Paid' },
  { value: 'not_paid', label: 'Not Paid' },
  { value: 'completed', label: 'Completed' },
];

const createEmptyFormData = (): KOLFormData => ({
  name: '',
  email: '',
  telegramHandle: '',
  status: 'in_contact',
  platforms: [],
  documents: [],
});

/**
 * Convert KOLProfile to form data for edit mode
 */
const kolToFormData = (kol: KOLProfile & { platforms?: KOLPlatform[] }): KOLFormData => ({
  name: kol.name,
  email: kol.email || '',
  telegramHandle: kol.telegram_handle || '',
  status: kol.status,
  platforms: (kol.platforms || []).map(p => ({
    id: p.id,
    platform: p.platform,
    profileUrl: p.profile_url,
    followerCount: p.follower_count.toString(),
  })),
  documents: [], // Documents would need separate handling
});

// ============================================
// COMPONENT
// ============================================

export function KOLFormDrawer({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode,
  initialData,
}: KOLFormDrawerProps) {
  const [formData, setFormData] = useState<KOLFormData>(createEmptyFormData());
  const [errors, setErrors] = useState<Partial<Record<keyof KOLFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when drawer opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(kolToFormData(initialData));
      } else {
        setFormData(createEmptyFormData());
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const updateField = <K extends keyof KOLFormData>(field: K, value: KOLFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addPlatform = () => {
    const newPlatform: PlatformEntry = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: 'youtube',
      profileUrl: '',
      followerCount: '',
    };
    updateField('platforms', [...formData.platforms, newPlatform]);
  };

  const updatePlatform = (id: string, field: keyof PlatformEntry, value: string) => {
    updateField(
      'platforms',
      formData.platforms.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const removePlatform = (id: string) => {
    updateField('platforms', formData.platforms.filter(p => p.id !== id));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KOLFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onSubmit(formData);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(createEmptyFormData());
    setErrors({});
    onClose();
  };

  const isEditMode = mode === 'edit';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit KOL' : 'Add New KOL'}
      description={isEditMode 
        ? `Update ${initialData?.name || 'KOL'} profile` 
        : 'Add a Key Opinion Leader to your roster'
      }
      width="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            loading={isSubmitting}
            glow
          >
            {isEditMode ? 'Save Changes' : 'Add KOL'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <DrawerSection title="Basic Information">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Name"
              placeholder="Enter KOL name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
              />
              
              <Input
                label="Telegram"
                placeholder="@handle"
                value={formData.telegramHandle}
                onChange={(e) => updateField('telegramHandle', e.target.value)}
              />
            </div>

            <SelectInput
              label="Status"
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value as KOLStatus)}
              options={statusOptions}
            />
          </div>
        </DrawerSection>

        {/* Platforms */}
        <DrawerSection title="Platforms">
          <div className="space-y-3">
            {formData.platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
              >
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <SelectInput
                    label="Platform"
                    value={platform.platform}
                    onChange={(e) => updatePlatform(platform.id, 'platform', e.target.value)}
                    options={platformOptions}
                  />
                  <Input
                    label="Profile URL"
                    placeholder="https://..."
                    value={platform.profileUrl}
                    onChange={(e) => updatePlatform(platform.id, 'profileUrl', e.target.value)}
                  />
                  <Input
                    label="Followers"
                    placeholder="e.g., 50000"
                    value={platform.followerCount}
                    onChange={(e) => updatePlatform(platform.id, 'followerCount', e.target.value)}
                  />
                </div>
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => removePlatform(platform.id)}
                  className="text-zinc-500 hover:text-red-400 mt-6"
                />
              </motion.div>
            ))}

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={addPlatform}
              className="w-full"
            >
              Add Platform
            </Button>
          </div>
        </DrawerSection>

        {/* Documents */}
        <DrawerSection title="Documents">
          <FileUpload
            files={formData.documents}
            onFilesChange={(files) => updateField('documents', files)}
          />
        </DrawerSection>
      </div>
    </Drawer>
  );
}

// Re-export for backwards compatibility
export { KOLFormDrawer as AddKOLDrawer };

