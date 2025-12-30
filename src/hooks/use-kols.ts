'use client';

import { useState, useEffect, useCallback } from 'react';
import { getKOLService, KOLWithRelations } from '@/lib/supabase/kol-service';
import { KOLStatus, Platform, ContentPost, KOLDocument, DocumentType } from '@/types';

// ============================================
// DEMO DATA (used when Supabase isn't configured)
// ============================================

const demoKOLs: KOLWithRelations[] = [
  {
    id: '1',
    user_id: 'demo',
    name: 'Crypto Wendy',
    email: 'wendy@crypto.com',
    telegram_handle: '@cryptowendy',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '1', kol_id: '1', platform: 'youtube' as Platform, profile_url: 'https://youtube.com', follower_count: 258000, created_at: '', updated_at: '' },
      { id: '2', kol_id: '1', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 299000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 557000,
    total_cost: 15000,
    total_impressions: 49700,
    num_posts: 4,
    average_cpm: 30.18,
  },
  {
    id: '2',
    user_id: 'demo',
    name: 'Joshua Jake',
    email: 'jake@influencer.io',
    status: 'in_contact' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '3', kol_id: '2', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 705000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 705000,
    total_cost: 0,
    total_impressions: 0,
    num_posts: 0,
    average_cpm: 0,
  },
  {
    id: '3',
    user_id: 'demo',
    name: 'Rise Up Morning Show',
    email: 'show@riseup.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '4', kol_id: '3', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 365000, created_at: '', updated_at: '' },
      { id: '5', kol_id: '3', platform: 'twitter' as Platform, profile_url: 'https://twitter.com', follower_count: 120000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 485000,
    total_cost: 6000,
    total_impressions: 74500,
    num_posts: 15,
    average_cpm: 8.05,
  },
  {
    id: '4',
    user_id: 'demo',
    name: 'Crypto with Leo',
    email: 'leo@crypto.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '6', kol_id: '4', platform: 'youtube' as Platform, profile_url: 'https://youtube.com', follower_count: 180000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 180000,
    total_cost: 0,
    total_impressions: 31078,
    num_posts: 7,
    average_cpm: 0,
  },
  {
    id: '5',
    user_id: 'demo',
    name: 'Jolly Green Investor',
    email: 'jolly@investor.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '8', kol_id: '5', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 439000, created_at: '', updated_at: '' },
      { id: '9', kol_id: '5', platform: 'instagram' as Platform, profile_url: 'https://instagram.com', follower_count: 89000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 528000,
    total_cost: 12000,
    total_impressions: 46759,
    num_posts: 4,
    average_cpm: 25.66,
  },
  {
    id: '6',
    user_id: 'demo',
    name: 'Bodoggos',
    email: 'bodoggos@gmail.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '10', kol_id: '6', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 520000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 520000,
    total_cost: 9999,
    total_impressions: 145300,
    num_posts: 3,
    average_cpm: 6.88,
  },
  {
    id: '7',
    user_id: 'demo',
    name: 'Wale.Moca',
    email: 'wale@moca.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '11', kol_id: '7', platform: 'twitter' as Platform, profile_url: 'https://twitter.com', follower_count: 85000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 85000,
    total_cost: 2500,
    total_impressions: 15200,
    num_posts: 1,
    average_cpm: 16.45,
  },
  {
    id: '8',
    user_id: 'demo',
    name: 'When Shift Happens',
    status: 'in_contact' as KOLStatus,
    kyc_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '12', kol_id: '8', platform: 'youtube' as Platform, profile_url: 'https://youtube.com', follower_count: 91000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 91000,
    total_cost: 0,
    total_impressions: 0,
    num_posts: 0,
    average_cpm: 0,
  },
  {
    id: '9',
    user_id: 'demo',
    name: 'Star Platinum',
    email: 'star@platinum.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '13', kol_id: '9', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 125000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 125000,
    total_cost: 2500,
    total_impressions: 4300,
    num_posts: 1,
    average_cpm: 58.14,
  },
  {
    id: '10',
    user_id: 'demo',
    name: 'Pix',
    email: 'pix@creator.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '14', kol_id: '10', platform: 'instagram' as Platform, profile_url: 'https://instagram.com', follower_count: 200000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 200000,
    total_cost: 2500,
    total_impressions: 16400,
    num_posts: 1,
    average_cpm: 15.24,
  },
  {
    id: '11',
    user_id: 'demo',
    name: 'Andrew Asks',
    email: 'andrew@asks.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '15', kol_id: '11', platform: 'youtube' as Platform, profile_url: 'https://youtube.com', follower_count: 150000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 150000,
    total_cost: 2500,
    total_impressions: 10000,
    num_posts: 2,
    average_cpm: 25.00,
  },
  {
    id: '12',
    user_id: 'demo',
    name: 'Crypto Meg/Mason',
    email: 'meg@crypto.com',
    status: 'paid' as KOLStatus,
    kyc_completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    platforms: [
      { id: '16', kol_id: '12', platform: 'tiktok' as Platform, profile_url: 'https://tiktok.com', follower_count: 320000, created_at: '', updated_at: '' },
      { id: '17', kol_id: '12', platform: 'youtube' as Platform, profile_url: 'https://youtube.com', follower_count: 95000, created_at: '', updated_at: '' },
    ],
    posts: [],
    documents: [],
    total_followers: 415000,
    total_cost: 2000,
    total_impressions: 25300,
    num_posts: 2,
    average_cpm: 7.91,
  },
];

// ============================================
// HOOK
// ============================================

export interface UseKOLsReturn {
  kols: KOLWithRelations[];
  isLoading: boolean;
  error: Error | null;
  isDemo: boolean;
  
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

export function useKOLs(): UseKOLsReturn {
  const [kols, setKols] = useState<KOLWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const service = getKOLService();

  // Initial fetch
  const fetchKOLs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!service.isAvailable()) {
        // #region agent log
        console.log('[USE-KOLS] Running in DEMO MODE - Supabase not configured. Changes will NOT persist after refresh.');
        // #endregion
        setKols(demoKOLs);
        setIsDemo(true);
        return;
      }

      const data = await service.fetchAllKOLs();
      setKols(data);
      setIsDemo(false);
    } catch (err) {
      console.error('Error fetching KOLs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch KOLs'));
      // Fall back to demo data on error
      setKols(demoKOLs);
      setIsDemo(true);
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
    if (isDemo) {
      // Demo mode: add locally
      const newKOL: KOLWithRelations = {
        id: `demo-${Date.now()}`,
        user_id: 'demo',
        name: data.name,
        email: data.email,
        telegram_handle: data.telegramHandle,
        status: data.status,
        kyc_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        platforms: data.platforms.map((p, i) => ({
          id: `demo-platform-${Date.now()}-${i}`,
          kol_id: `demo-${Date.now()}`,
          platform: p.platform,
          profile_url: p.profileUrl,
          follower_count: parseInt(p.followerCount) || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
        posts: [],
        documents: data.documents.map((d, i) => ({
          id: `demo-doc-${Date.now()}-${i}`,
          kol_id: `demo-${Date.now()}`,
          name: d.name,
          type: d.type,
          size: d.size,
          uploaded_at: new Date().toISOString(),
        })),
        total_followers: data.platforms.reduce((sum, p) => sum + (parseInt(p.followerCount) || 0), 0),
        total_cost: 0,
        total_impressions: 0,
        num_posts: 0,
        average_cpm: 0,
      };
      setKols(prev => [newKOL, ...prev]);
      return;
    }

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
  }, [isDemo, service]);

  const updateKOL = useCallback(async (id: string, data: {
    name: string;
    email?: string;
    telegramHandle?: string;
    status: KOLStatus;
    platforms: { platform: Platform; profileUrl: string; followerCount: string }[];
  }) => {
    if (isDemo) {
      // Demo mode: update locally
      setKols(prev => prev.map(kol => {
        if (kol.id !== id) return kol;
        return {
          ...kol,
          name: data.name,
          email: data.email,
          telegram_handle: data.telegramHandle,
          status: data.status,
          updated_at: new Date().toISOString(),
          platforms: data.platforms.map((p, i) => ({
            id: `demo-platform-${Date.now()}-${i}`,
            kol_id: id,
            platform: p.platform,
            profile_url: p.profileUrl,
            follower_count: parseInt(p.followerCount) || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          total_followers: data.platforms.reduce((sum, p) => sum + (parseInt(p.followerCount) || 0), 0),
        };
      }));
      return;
    }

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
  }, [isDemo, service]);

  const deleteKOL = useCallback(async (id: string) => {
    if (isDemo) {
      setKols(prev => prev.filter(kol => kol.id !== id));
      return;
    }

    await service.deleteKOL(id);
    setKols(prev => prev.filter(kol => kol.id !== id));
  }, [isDemo, service]);

  // ============================================
  // POST OPERATIONS
  // ============================================

  const addPost = useCallback(async (kolId: string, post: Omit<ContentPost, 'id' | 'kol_id' | 'created_at' | 'updated_at'>) => {
    let newPost: ContentPost;

    // #region agent log
    console.log('[USE-KOLS] addPost called:', { kolId, post, isDemo });
    // #endregion

    if (isDemo) {
      // #region agent log
      console.warn('[USE-KOLS] DEMO MODE: Post added to local state only. Will NOT persist after refresh!');
      // #endregion
      newPost = {
        ...post,
        id: `demo-post-${Date.now()}`,
        kol_id: kolId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      newPost = await service.createPost({
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
    }

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
  }, [isDemo, service]);

  const updatePost = useCallback(async (postId: string, post: Partial<ContentPost>) => {
    // #region agent log
    console.log('[USE-KOLS] updatePost called:', { postId, post, isDemo });
    if (isDemo) {
      console.warn('[USE-KOLS] DEMO MODE: Post updated in local state only. Will NOT persist after refresh!');
    }
    // #endregion

    if (!isDemo) {
      await service.updatePost(postId, post);
    }

    setKols(prev => prev.map(kol => {
      const postIndex = kol.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return kol;
      
      const posts = [...kol.posts];
      posts[postIndex] = { ...posts[postIndex], ...post, updated_at: new Date().toISOString() };
      
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
  }, [isDemo, service]);

  const deletePost = useCallback(async (kolId: string, postId: string) => {
    if (!isDemo) {
      await service.deletePost(postId);
    }

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
  }, [isDemo, service]);

  // ============================================
  // DOCUMENT OPERATIONS
  // ============================================

  const addDocuments = useCallback(async (kolId: string, docs: { name: string; type: DocumentType; size: number; url?: string; file_path?: string }[]) => {
    let newDocs: KOLDocument[];

    if (isDemo) {
      newDocs = docs.map((d, i) => ({
        id: `demo-doc-${Date.now()}-${i}`,
        kol_id: kolId,
        name: d.name,
        type: d.type,
        size: d.size,
        url: d.url,
        file_path: d.file_path,
        uploaded_at: new Date().toISOString(),
      }));
    } else {
      newDocs = await service.createDocuments(docs.map(d => ({
        kol_id: kolId,
        name: d.name,
        type: d.type,
        size: d.size,
        url: d.url,
        file_path: d.file_path,
      })));
    }

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: [...kol.documents, ...newDocs],
      };
    }));
  }, [isDemo, service]);

  const deleteDocument = useCallback(async (kolId: string, docId: string) => {
    if (!isDemo) {
      await service.deleteDocument(docId);
    }

    setKols(prev => prev.map(kol => {
      if (kol.id !== kolId) return kol;
      return {
        ...kol,
        documents: kol.documents.filter(d => d.id !== docId),
      };
    }));
  }, [isDemo, service]);

  return {
    kols,
    isLoading,
    error,
    isDemo,
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

