'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import { KOLCard, KOLListItem } from '@/components/kol/kol-card';
import { KOLFormDrawer, KOLFormData } from '@/components/kol/kol-form-drawer';
import { KOLDetailDrawer } from '@/components/kol/kol-detail-drawer';
import { AddPostDrawer, PostFormData } from '@/components/kol/add-post-drawer';
import { ScrollReveal, AnimatedCounter } from '@/components/ui/scroll-reveal';
import { StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { useKOLs } from '@/hooks/use-kols';
import { KOLWithRelations } from '@/lib/supabase/kol-service';
import { ContentPost, KOLDocument } from '@/types';

// Drawer mode type
type DrawerMode = 'add' | 'edit' | 'view' | null;

// Post drawer mode
type PostDrawerMode = 'add' | 'edit' | null;

import {
  Plus,
  Grid3X3,
  List,
  Filter,
  Download,
  Upload,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function RosterPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the KOLs hook for data management
  const {
    kols,
    isLoading,
    error,
    addKOL,
    updateKOL,
    deleteKOL,
    addPost,
    updatePost,
    deletePost,
    addDocuments,
    deleteDocument,
  } = useKOLs();
  
  // Drawer state management
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedKOL, setSelectedKOL] = useState<KOLWithRelations | null>(null);
  
  // Post drawer state
  const [postDrawerMode, setPostDrawerMode] = useState<PostDrawerMode>(null);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  // ============================================
  // DRAWER HANDLERS
  // ============================================

  const openAddDrawer = () => {
    setSelectedKOL(null);
    setDrawerMode('add');
  };

  const openViewDrawer = (kol: KOLWithRelations) => {
    setSelectedKOL(kol);
    setDrawerMode('view');
  };

  const openEditDrawer = (kol: KOLWithRelations) => {
    setSelectedKOL(kol);
    setDrawerMode('edit');
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setTimeout(() => setSelectedKOL(null), 300);
  };

  const handleViewToEdit = () => {
    setDrawerMode('edit');
  };

  // ============================================
  // KOL OPERATIONS
  // ============================================

  const handleFormSubmit = async (formData: KOLFormData) => {
    if (drawerMode === 'add') {
      await addKOL({
        name: formData.name,
        email: formData.email || undefined,
        telegramHandle: formData.telegramHandle || undefined,
        status: formData.status,
        platforms: formData.platforms.map(p => ({
          platform: p.platform,
          profileUrl: p.profileUrl,
          followerCount: p.followerCount,
        })),
        documents: formData.documents.map(d => ({
          name: d.file.name,
          type: d.type,
          size: d.file.size,
        })),
      });
    } else if (drawerMode === 'edit' && selectedKOL) {
      await updateKOL(selectedKOL.id, {
        name: formData.name,
        email: formData.email || undefined,
        telegramHandle: formData.telegramHandle || undefined,
        status: formData.status,
        platforms: formData.platforms.map(p => ({
          platform: p.platform,
          profileUrl: p.profileUrl,
          followerCount: p.followerCount,
        })),
      });
      
      // Handle new documents
      if (formData.documents.length > 0) {
        await addDocuments(selectedKOL.id, formData.documents.map(d => ({
          name: d.file.name,
          type: d.type,
          size: d.file.size,
        })));
      }
    }
  };

  const handleDeleteKOL = async (kol: KOLWithRelations) => {
    if (confirm(`Are you sure you want to delete ${kol.name}?`)) {
      await deleteKOL(kol.id);
    }
  };

  // ============================================
  // POST HANDLERS
  // ============================================

  const openAddPostDrawer = () => {
    setSelectedPost(null);
    setPostDrawerMode('add');
  };

  const openEditPostDrawer = (post: ContentPost) => {
    setSelectedPost(post);
    setPostDrawerMode('edit');
  };

  const closePostDrawer = () => {
    setPostDrawerMode(null);
    setTimeout(() => setSelectedPost(null), 300);
  };

  const handlePostFormSubmit = async (formData: PostFormData) => {
    if (!selectedKOL) return;

    try {
      if (postDrawerMode === 'add') {
        await addPost(selectedKOL.id, {
          platform: formData.platform,
          url: formData.url,
          title: formData.title || undefined,
          posted_date: formData.posted_date,
          impressions: parseInt(formData.impressions) || 0,
          engagement: parseInt(formData.engagement) || undefined,
          clicks: parseInt(formData.clicks) || undefined,
          cost: parseFloat(formData.cost) || undefined,
          notes: formData.notes || undefined,
        });
        console.log('[ROSTER] Post added successfully');
      } else if (postDrawerMode === 'edit' && selectedPost) {
        await updatePost(selectedPost.id, {
          platform: formData.platform,
          url: formData.url,
          title: formData.title || undefined,
          posted_date: formData.posted_date,
          impressions: parseInt(formData.impressions) || 0,
          engagement: parseInt(formData.engagement) || undefined,
          clicks: parseInt(formData.clicks) || undefined,
          cost: parseFloat(formData.cost) || undefined,
          notes: formData.notes || undefined,
        });
        console.log('[ROSTER] Post updated successfully');
      }

      // Close the post drawer after successful save
      // The kols state has been updated by addPost/updatePost
      // syncedSelectedKOL will automatically reflect the changes on next render
      closePostDrawer();
    } catch (err) {
      console.error('[ROSTER] Failed to save post:', err);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleDeletePost = async (post: ContentPost) => {
    if (!selectedKOL) return;
    await deletePost(selectedKOL.id, post.id);
    
    // Refresh selectedKOL
    const updatedKOL = kols.find(k => k.id === selectedKOL.id);
    if (updatedKOL) setSelectedKOL(updatedKOL);
  };

  // ============================================
  // DOCUMENT HANDLERS
  // ============================================

  const handleAddDocuments = async (docs: KOLDocument[]) => {
    if (!selectedKOL) return;
    await addDocuments(selectedKOL.id, docs.map(d => ({
      name: d.name,
      type: d.type,
      size: d.size,
      url: d.url,
      file_path: d.file_path,
    })));

    // Refresh selectedKOL
    const updatedKOL = kols.find(k => k.id === selectedKOL.id);
    if (updatedKOL) setSelectedKOL(updatedKOL);
  };

  const handleDeleteDocument = async (doc: KOLDocument) => {
    if (!selectedKOL) return;
    await deleteDocument(selectedKOL.id, doc.id);

    // Refresh selectedKOL
    const updatedKOL = kols.find(k => k.id === selectedKOL.id);
    if (updatedKOL) setSelectedKOL(updatedKOL);
  };

  // Keep selectedKOL in sync with kols array
  const syncedSelectedKOL = selectedKOL 
    ? kols.find(k => k.id === selectedKOL.id) || selectedKOL 
    : null;

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const filteredKOLs = kols.filter(kol =>
    kol.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpend = kols.reduce((sum, kol) => sum + kol.total_cost, 0);
  const totalImpressions = kols.reduce((sum, kol) => sum + kol.total_impressions, 0);
  const totalPosts = kols.reduce((sum, kol) => sum + kol.num_posts, 0);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">

      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Influencer Roster</h1>
            <p className="text-zinc-400 mt-1">
              Manage and track your influencer partnerships
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
              Import
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Plus className="h-4 w-4" />} 
              onClick={openAddDrawer}
              glow
            >
              Add Influencer
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Influencers', value: kols.length, icon: Users, color: 'text-indigo-400' },
            { label: 'Total Spend', value: totalSpend, icon: DollarSign, color: 'text-emerald-500', format: 'currency' },
            { label: 'Total Impressions', value: totalImpressions, icon: Eye, color: 'text-blue-500', format: 'compact' },
            { label: 'Total Posts', value: totalPosts, icon: TrendingUp, color: 'text-amber-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                  <div className="text-xl font-bold text-white">
                    {stat.format === 'currency' && '$'}
                    <AnimatedCounter
                      value={stat.value}
                      formatFn={(v) => {
                        if (stat.format === 'compact') return Math.round(v).toLocaleString();
                        if (stat.format === 'cpm') return v.toFixed(2);
                        return Math.round(v).toLocaleString();
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Filters and search */}
      <ScrollReveal delay={0.2}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-80">
              <SearchInput
                placeholder="Search influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filters
            </Button>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
              }`}
              onClick={() => setViewMode('grid')}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3X3 className="h-4 w-4" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
              }`}
              onClick={() => setViewMode('list')}
              whileTap={{ scale: 0.95 }}
            >
              <List className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </ScrollReveal>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-400">{error.message}</p>
        </motion.div>
      )}

      {/* KOL Grid/List */}
      {!isLoading && (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <StaggerContainer>
                {filteredKOLs.map((kol) => (
                  <StaggerItem key={kol.id}>
                    <KOLCard
                      kol={kol}
                      onEdit={() => openEditDrawer(kol)}
                      onDelete={() => handleDeleteKOL(kol)}
                      onView={() => openViewDrawer(kol)}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredKOLs.map((kol, index) => (
                <KOLListItem
                  key={kol.id}
                  kol={kol}
                  index={index}
                  onEdit={() => openEditDrawer(kol)}
                  onView={() => openViewDrawer(kol)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Empty state */}
      {!isLoading && filteredKOLs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
            <Users className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">No influencers found</h3>
          <p className="text-zinc-400 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first influencer'}
          </p>
          <Button 
            variant="primary" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openAddDrawer}
          >
            Add Influencer
          </Button>
        </motion.div>
      )}

      {/* Form Drawer (Add/Edit) */}
      <KOLFormDrawer
        key={syncedSelectedKOL?.id || 'new'}
        isOpen={drawerMode === 'add' || drawerMode === 'edit'}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
        mode={drawerMode === 'edit' ? 'edit' : 'add'}
        initialData={syncedSelectedKOL || undefined}
      />

      {/* Detail Drawer (View) */}
      <KOLDetailDrawer
        isOpen={drawerMode === 'view'}
        onClose={closeDrawer}
        onEdit={handleViewToEdit}
        onAddPost={openAddPostDrawer}
        onEditPost={openEditPostDrawer}
        onDeletePost={handleDeletePost}
        onAddDocuments={handleAddDocuments}
        onDeleteDocument={handleDeleteDocument}
        kol={syncedSelectedKOL}
      />

      {/* Add/Edit Post Drawer */}
      <AddPostDrawer
        key={selectedPost?.id || 'new-post'}
        isOpen={postDrawerMode !== null}
        onClose={closePostDrawer}
        onSubmit={handlePostFormSubmit}
        kolName={syncedSelectedKOL?.name || ''}
        mode={postDrawerMode === 'edit' ? 'edit' : 'add'}
        initialData={selectedPost || undefined}
      />
    </div>
  );
}
