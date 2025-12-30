'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getKOLService, KOLWithRelations } from '@/lib/supabase/kol-service';
import { KOLStatus, Platform, ContentPost, KOLDocument, DocumentType } from '@/types';

// ============================================
// HOOK INTERFACE
// ============================================

export interface UseKOLsReturn {
  kols: KOLWithRelations[];
  isLoading: boolean;
  error: Error | null;
  
  // KOL operations
  addKOL: (data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
    documents: { name: string; type: DocumentType; size: number }[];
  }) => Promise<void>;
  updateKOL: (id: string, data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
  }) => Promise<void>;
  deleteKOL: (id: string) => Promise<void>;
  
  // Post operations
  addPost: (kolId: string, post: Omit<ContentPost, 'id' | 'kol_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePost: (postId: string, post: Partial<ContentPost>) => Promise<void>;
  deletePost: (kolId: string, postId: string) => Promise<void>;
  
  // Document operations
  addDocuments: (kolId: string, docs: { name: string; type: DocumentType; size: number; url?: string; file_path?: string }[]) => Promise<void>;
  deleteDocument: (kolId: string, docId: string) => Promise<void>;
  
  // Refresh
  refresh: () => Promise<void>;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useKOLs(): UseKOLsReturn {
  const [kols, setKols] = useState<KOLWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref for service to avoid stale closures
  const serviceRef = useRef(getKOLService());
  const service = serviceRef.current;

  // ============================================
  // FETCH ALL KOLs FROM SUPABASE
  // ============================================
  
  const fetchKOLs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!service.isAvailable()) {
        throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      }

      const data = await service.fetchAllKOLs();
      setKols(data);
    } catch (err) {
      console.error('Failed to fetch KOLs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch KOLs'));
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchKOLs();
  }, [fetchKOLs]);

  // ============================================
  // KOL OPERATIONS
  // ============================================

  const addKOL = useCallback(async (data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
    documents: { name: string; type: DocumentType; size: number }[];
  }) => {
    const newKOL = await service.createKOL({
      name: data.name,
      email: data.email,
      telegram_handle: data.telegramHandle,
      status: data.status,
      platforms: data.platforms.map(p => ({
        platform: p.platform,
        profile_url: p.profileUrl,
        follower_count: parseInt(p.followerCount) || 0,
      })),
      documents: data.documents.map(d => ({
        name: d.name,
        type: d.type,
        size: d.size,
      })),
    });
    
    setKols(prev => [newKOL, ...prev]);
  }, [service]);

  const updateKOL = useCallback(async (id: string, data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
  }) => {
    const updatedKOL = await service.updateKOL({
      id,
      name: data.name,
      email: data.email,
      telegram_handle: data.telegramHandle,
      status: data.status,
      platforms: data.platforms.map(p => ({
        platform: p.platform,
        profile_url: p.profileUrl,
        follower_count: parseInt(p.followerCount) || 0,
      })),
    });
    
    if (updatedKOL) {
      setKols(prev => prev.map(kol => kol.id === id ? updatedKOL : kol));
    }
  }, [service]);

  const deleteKOL = useCallback(async (id: string) => {
    await service.deleteKOL(id);
    setKols(prev => prev.filter(kol => kol.id !== id));
  }, [service]);

  // ============================================
  // POST OPERATIONS
  // ============================================

  const addPost = useCallback(async (kolId: string, post: Omit<ContentPost, 'id' | 'kol_id' | 'created_at' | 'updated_at'>) => {
    const newPost = await service.createPost({
      kol_id: kolId,
      platform: post.platform,
      url: post.url,
      title: post.title,
      posted_date: post.posted_date,
      impressions: post.impressions,
      engagement: post.engagement,
      clicks: post.clicks,
      cost: post.cost,
      notes: post.notes,
    });

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      const posts = [...kol.posts, newPost];
      const total_impressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const total_cost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
      return {
        ...kol,
        posts,
        num_posts: posts.length,
        total_impressions,
        total_cost,
        average_cpm: total_impressions > 0 ? (total_cost / total_impressions) * 1000 : 0,
      };
    }));
  }, [service]);

  const updatePost = useCallback(async (postId: string, post: Partial<ContentPost>) => {
    const updatedPost = await service.updatePost(postId, post);
    
    setKols(prev => prev.map(kol => {
      const postIndex = kol.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return kol;
      
      const posts = [...kol.posts];
      posts[postIndex] = updatedPost;
      
      const total_impressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const total_cost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
      
      return {
        ...kol,
        posts,
        total_impressions,
        total_cost,
        average_cpm: total_impressions > 0 ? (total_cost / total_impressions) * 1000 : 0,
      };
    }));
  }, [service]);

  const deletePost = useCallback(async (kolId: string, postId: string) => {
    await service.deletePost(postId);

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      const posts = kol.posts.filter(p => p.id !== postId);
      const total_impressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const total_cost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
      return {
        ...kol,
        posts,
        num_posts: posts.length,
        total_impressions,
        total_cost,
        average_cpm: total_impressions > 0 ? (total_cost / total_impressions) * 1000 : 0,
      };
    }));
  }, [service]);

  // ============================================
  // DOCUMENT OPERATIONS
  // ============================================

  const addDocuments = useCallback(async (kolId: string, docs: { name: string; type: DocumentType; size: number; url?: string; file_path?: string }[]) => {
    const newDocs = await service.createDocuments(docs.map(d => ({
      kol_id: kolId,
      name: d.name,
      type: d.type,
      size: d.size,
      url: d.url,
      file_path: d.file_path,
    })));

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: [...kol.documents, ...newDocs],
      };
    }));
  }, [service]);

  const deleteDocument = useCallback(async (kolId: string, docId: string) => {
    await service.deleteDocument(docId);

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: kol.documents.filter(d => d.id !== docId),
      };
    }));
  }, [service]);

  // ============================================
  // RETURN
  // ============================================

  return {
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
    refresh: fetchKOLs,
  };
}
