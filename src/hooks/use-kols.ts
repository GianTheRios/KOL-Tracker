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
// HOOK IMPLEMENTATION - NO DEMO MODE
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
    console.log('[USE-KOLS] fetchKOLs: Starting fetch from Supabase...');
    setIsLoading(true);
    setError(null);

    try {
      if (!service.isAvailable()) {
        throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      }

      const data = await service.fetchAllKOLs();
      console.log('[USE-KOLS] fetchKOLs: SUCCESS - Loaded', data.length, 'KOLs from Supabase');
      setKols(data);
    } catch (err) {
      console.error('[USE-KOLS] fetchKOLs: FAILED -', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch KOLs'));
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchKOLs();
  }, [fetchKOLs]);

  // ============================================
  // KOL OPERATIONS - ALL GO THROUGH SUPABASE
  // ============================================

  const addKOL = useCallback(async (data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
    documents: { name: string; type: DocumentType; size: number }[];
  }) => {
    console.log('[USE-KOLS] addKOL: Creating new KOL...', data.name);
    
    try {
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
      
      console.log('[USE-KOLS] addKOL: SUCCESS - Created KOL:', newKOL.id);
      setKols(prev => [newKOL, ...prev]);
    } catch (err) {
      console.error('[USE-KOLS] addKOL: FAILED -', err);
      throw err;
    }
  }, [service]);

  const updateKOL = useCallback(async (id: string, data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
  }) => {
    console.log('[USE-KOLS] updateKOL: Updating KOL...', id);
    
    try {
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
        console.log('[USE-KOLS] updateKOL: SUCCESS');
      setKols(prev => prev.map(kol => kol.id === id ? updatedKOL : kol));
      }
    } catch (err) {
      console.error('[USE-KOLS] updateKOL: FAILED -', err);
      throw err;
    }
  }, [service]);

  const deleteKOL = useCallback(async (id: string) => {
    console.log('[USE-KOLS] deleteKOL: Deleting KOL...', id);
    
    try {
      await service.deleteKOL(id);
      console.log('[USE-KOLS] deleteKOL: SUCCESS');
      setKols(prev => prev.filter(kol => kol.id !== id));
    } catch (err) {
      console.error('[USE-KOLS] deleteKOL: FAILED -', err);
      throw err;
    }
  }, [service]);

  // ============================================
  // POST OPERATIONS - ALL GO THROUGH SUPABASE
  // ============================================

  const addPost = useCallback(async (kolId: string, post: Omit<ContentPost, 'id' | 'kol_id' | 'created_at' | 'updated_at'>) => {
    console.log('[USE-KOLS] addPost: Creating post for KOL...', kolId);
    
    try {
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
      
      console.log('[USE-KOLS] addPost: SUCCESS - Created post:', newPost.id);

      // Update local state
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
    } catch (err) {
      console.error('[USE-KOLS] addPost: FAILED -', err);
      throw err;
    }
  }, [service]);

  const updatePost = useCallback(async (postId: string, post: Partial<ContentPost>) => {
    console.log('[USE-KOLS] updatePost: Updating post...', postId, post);
    
    // #region agent log - Hypothesis E: State update flow
    fetch('http://127.0.0.1:7242/ingest/2a90f57d-26e2-4ae7-9ab4-5ecec198ac0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-kols.ts:updatePost:start',message:'updatePost called in hook',data:{postId,postInput:post,costInInput:post.cost},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    try {
      const updatedPost = await service.updatePost(postId, post);
      console.log('[USE-KOLS] updatePost: SUCCESS - Updated post:', updatedPost.id, 'kol_id:', updatedPost.kol_id);
      console.log('[USE-KOLS] updatePost: Returned post cost:', updatedPost.cost);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2a90f57d-26e2-4ae7-9ab4-5ecec198ac0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-kols.ts:updatePost:serviceReturned',message:'Service returned updated post',data:{postId:updatedPost.id,returnedCost:updatedPost.cost,fullPost:updatedPost},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      // Update local state - find the KOL that owns this post
      setKols(prev => {
        // Debug: log all KOLs and their post counts
        console.log('[USE-KOLS] updatePost: Searching for post in local state...');
        prev.forEach(kol => {
          const hasPost = kol.posts.some(p => p.id === postId);
          console.log(`[USE-KOLS] KOL "${kol.name}" (${kol.id}): ${kol.posts.length} posts, hasPost: ${hasPost}`);
        });
        
        let foundPost = false;
        let oldCost = 0;
        const updated = prev.map(kol => {
      const postIndex = kol.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return kol;
          
          foundPost = true;
          oldCost = kol.posts[postIndex].cost || 0;
          console.log('[USE-KOLS] updatePost: Found post in KOL:', kol.name, 'at index:', postIndex);
          console.log('[USE-KOLS] updatePost: OLD cost:', oldCost, 'NEW cost:', updatedPost.cost);
      
      const posts = [...kol.posts];
          posts[postIndex] = updatedPost;
      
      const total_impressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const total_cost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
          
          console.log('[USE-KOLS] updatePost: New totals - impressions:', total_impressions, 'cost:', total_cost);
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/2a90f57d-26e2-4ae7-9ab4-5ecec198ac0b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'use-kols.ts:updatePost:stateUpdate',message:'State being updated',data:{kolName:kol.name,postIndex,oldCost,newCost:updatedPost.cost,newTotalCost:total_cost},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
      
      return {
        ...kol,
        posts,
        total_impressions,
        total_cost,
        average_cpm: total_impressions > 0 ? (total_cost / total_impressions) * 1000 : 0,
      };
        });
        
        if (!foundPost) {
          console.error('[USE-KOLS] updatePost: POST NOT FOUND IN ANY KOL! postId:', postId);
          console.error('[USE-KOLS] updatePost: The post exists in DB but not in local state. Triggering refetch...');
        }
        
        return updated;
      });
      
    } catch (err) {
      console.error('[USE-KOLS] updatePost: FAILED -', err);
      throw err;
    }
  }, [service]);

  const deletePost = useCallback(async (kolId: string, postId: string) => {
    console.log('[USE-KOLS] deletePost: Deleting post...', postId);
    
    try {
      await service.deletePost(postId);
      console.log('[USE-KOLS] deletePost: SUCCESS');

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
    } catch (err) {
      console.error('[USE-KOLS] deletePost: FAILED -', err);
      throw err;
    }
  }, [service]);

  // ============================================
  // DOCUMENT OPERATIONS - ALL GO THROUGH SUPABASE
  // ============================================

  const addDocuments = useCallback(async (kolId: string, docs: { name: string; type: DocumentType; size: number; url?: string; file_path?: string }[]) => {
    console.log('[USE-KOLS] addDocuments: Adding documents for KOL...', kolId);
    
    try {
      const newDocs = await service.createDocuments(docs.map(d => ({
        kol_id: kolId,
        name: d.name,
        type: d.type,
        size: d.size,
        url: d.url,
        file_path: d.file_path,
      })));
      
      console.log('[USE-KOLS] addDocuments: SUCCESS - Added', newDocs.length, 'documents');

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: [...kol.documents, ...newDocs],
      };
    }));
    } catch (err) {
      console.error('[USE-KOLS] addDocuments: FAILED -', err);
      throw err;
    }
  }, [service]);

  const deleteDocument = useCallback(async (kolId: string, docId: string) => {
    console.log('[USE-KOLS] deleteDocument: Deleting document...', docId);
    
    try {
      await service.deleteDocument(docId);
      console.log('[USE-KOLS] deleteDocument: SUCCESS');

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: kol.documents.filter(d => d.id !== docId),
      };
    }));
    } catch (err) {
      console.error('[USE-KOLS] deleteDocument: FAILED -', err);
      throw err;
    }
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
