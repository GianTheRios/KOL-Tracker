'use client';

import { useState, useEffect } from 'react';
import { Drawer, DrawerSection } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input, SelectInput } from '@/components/ui/input';
import { Platform, ContentPost } from '@/types';
import { Calendar, Link as LinkIcon } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface PostFormData {
  platform: Platform;
  url: string;
  title: string;
  posted_date: string;
  impressions: string;
  engagement: string;
  clicks: string;
  cost: string;
  notes: string;
}

interface AddPostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
  kolName: string;
  mode?: 'add' | 'edit';
  initialData?: ContentPost;
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

const createEmptyFormData = (): PostFormData => ({
  platform: 'youtube',
  url: '',
  title: '',
  posted_date: new Date().toISOString().split('T')[0],
  impressions: '',
  engagement: '',
  clicks: '',
  cost: '',
  notes: '',
});

const postToFormData = (post: ContentPost): PostFormData => ({
  platform: post.platform,
  url: post.url,
  title: post.title || '',
  posted_date: post.posted_date.split('T')[0],
  impressions: post.impressions.toString(),
  engagement: post.engagement?.toString() || '',
  clicks: post.clicks?.toString() || '',
  cost: post.cost?.toString() || '',
  notes: post.notes || '',
});

// ============================================
// COMPONENT
// ============================================

export function AddPostDrawer({
  isOpen,
  onClose,
  onSubmit,
  kolName,
  mode = 'add',
  initialData,
}: AddPostDrawerProps) {
  const [formData, setFormData] = useState<PostFormData>(createEmptyFormData());
  const [errors, setErrors] = useState<Partial<Record<keyof PostFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(postToFormData(initialData));
      } else {
        setFormData(createEmptyFormData());
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const updateField = <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PostFormData, string>> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'Post URL is required';
    } else if (!formData.url.startsWith('http')) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (!formData.posted_date) {
      newErrors.posted_date = 'Posted date is required';
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
      title={isEditMode ? 'Update Post Metrics' : 'Add Post'}
      description={`${isEditMode ? 'Update metrics for' : 'Track a new post from'} ${kolName}`}
      width="md"
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
            {isEditMode ? 'Update Metrics' : 'Add Post'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Post Details */}
        <DrawerSection title="Post Details">
          <div className="space-y-4">
            <SelectInput
              label="Platform"
              value={formData.platform}
              onChange={(e) => updateField('platform', e.target.value as Platform)}
              options={platformOptions}
            />

            <Input
              label="Post URL"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.url}
              onChange={(e) => updateField('url', e.target.value)}
              error={errors.url}
              required
            />

            <Input
              label="Title / Description"
              placeholder="Q4 Product Review Campaign"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
            />

            <Input
              label="Posted Date"
              type="date"
              value={formData.posted_date}
              onChange={(e) => updateField('posted_date', e.target.value)}
              error={errors.posted_date}
              required
            />
          </div>
        </DrawerSection>

        {/* Metrics */}
        <DrawerSection title="Metrics">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Impressions / Views"
              placeholder="e.g., 15000"
              value={formData.impressions}
              onChange={(e) => updateField('impressions', e.target.value)}
            />

            <Input
              label="Engagement"
              placeholder="Likes, comments, etc."
              value={formData.engagement}
              onChange={(e) => updateField('engagement', e.target.value)}
            />

            <Input
              label="Clicks"
              placeholder="Link clicks"
              value={formData.clicks}
              onChange={(e) => updateField('clicks', e.target.value)}
            />

            <Input
              label="Cost ($)"
              placeholder="Amount paid for this post"
              value={formData.cost}
              onChange={(e) => updateField('cost', e.target.value)}
            />
          </div>
        </DrawerSection>

        {/* Notes */}
        <DrawerSection title="Notes">
          <textarea
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
            rows={3}
            placeholder="Any additional notes about this post..."
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </DrawerSection>
      </div>
    </Drawer>
  );
}

