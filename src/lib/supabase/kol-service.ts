'use client';

import { getSupabaseClient, isSupabaseConfigured } from './client';
import { KOLProfile, KOLPlatform, ContentPost, KOLDocument, Platform, KOLStatus, DocumentType } from '@/types';

// ============================================
// TYPES
// ============================================

export interface KOLWithRelations extends KOLProfile {
  platforms: KOLPlatform[];
  posts: ContentPost[];
  documents: KOLDocument[];
  total_followers: number;
  total_impressions: number;
  total_cost: number;
  num_posts: number;
  average_cpm: number;
}

interface CreateKOLInput {
  name: string;
  email?: string;
  telegram_handle?: string;
  status: KOLStatus;
  notes?: string;
  platforms?: {
    platform: Platform;
    profile_url: string;
    follower_count: number;
  }[];
  documents?: {
    name: string;
    type: DocumentType;
    size: number;
    url?: string;
  }[];
}

interface UpdateKOLInput extends Partial<CreateKOLInput> {
  id: string;
}

interface CreatePostInput {
  kol_id: string;
  platform: Platform;
  url: string;
  title?: string;
  posted_date: string;
  impressions: number;
  engagement?: number;
  clicks?: number;
  cost?: number;
  notes?: string;
}

interface CreateDocumentInput {
  kol_id: string;
  name: string;
  type: DocumentType;
  size: number;
  url?: string;
  file_path?: string;
  notes?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateMetrics(posts: ContentPost[]): { 
  total_impressions: number; 
  total_cost: number; 
  average_cpm: number; 
} {
  const total_impressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const total_cost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
  const average_cpm = total_impressions > 0 ? (total_cost / total_impressions) * 1000 : 0;
  return { total_impressions, total_cost, average_cpm };
}

function calculateFollowers(platforms: KOLPlatform[]): number {
  return platforms.reduce((sum, p) => sum + (p.follower_count || 0), 0);
}

// ============================================
// KOL SERVICE
// ============================================

export class KOLService {
  private supabase = getSupabaseClient();

  /**
   * Check if Supabase is available
   */
  isAvailable(): boolean {
    return isSupabaseConfigured() && this.supabase !== null;
  }

  /**
   * Fetch all KOLs with their related data
   */
  async fetchAllKOLs(): Promise<KOLWithRelations[]> {
    if (!this.supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    // Fetch KOLs
    const { data: kols, error: kolError } = await this.supabase
      .from('kol_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (kolError) {
      console.error('Error fetching KOLs:', kolError);
      throw kolError;
    }

    if (!kols || kols.length === 0) {
      return [];
    }

    const kolIds = kols.map(k => k.id);

    // Fetch related data in parallel
    const [platformsRes, postsRes, documentsRes] = await Promise.all([
      this.supabase.from('kol_platforms').select('*').in('kol_id', kolIds),
      this.supabase.from('content_posts').select('*').in('kol_id', kolIds),
      this.supabase.from('kol_documents').select('*').in('kol_id', kolIds),
    ]);

    const platforms = platformsRes.data || [];
    const posts = postsRes.data || [];
    const documents = documentsRes.data || [];

    // Debug: log what we fetched
    console.log('[KOL-SERVICE] fetchAllKOLs: Fetched', posts.length, 'total posts from DB');
    console.log('[KOL-SERVICE] fetchAllKOLs: KOL IDs:', kolIds);
    console.log('[KOL-SERVICE] fetchAllKOLs: Post kol_ids:', posts.map(p => p.kol_id));

    // Combine data
    const result = kols.map(kol => {
      const kolPlatforms = platforms.filter(p => p.kol_id === kol.id) as KOLPlatform[];
      const kolPosts = posts.filter(p => p.kol_id === kol.id) as ContentPost[];
      const kolDocs = documents.filter(d => d.kol_id === kol.id).map(d => ({
        ...d,
        size: d.file_size || 0,
        url: d.file_url,
        file_path: d.file_path,
        uploaded_at: d.created_at,
      })) as KOLDocument[];

      const metrics = calculateMetrics(kolPosts);
      
      // Debug: log posts per KOL
      if (kolPosts.length > 0) {
        console.log(`[KOL-SERVICE] fetchAllKOLs: KOL "${kol.name}" has ${kolPosts.length} posts, total_cost: ${metrics.total_cost}`);
      }

      return {
        ...kol,
        platforms: kolPlatforms,
        posts: kolPosts,
        documents: kolDocs,
        total_followers: calculateFollowers(kolPlatforms),
        num_posts: kolPosts.length,
        ...metrics,
      } as KOLWithRelations;
    });

    return result;
  }

  /**
   * Create a new KOL with platforms and documents
   */
  async createKOL(input: CreateKOLInput): Promise<KOLWithRelations> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    // Get current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Create KOL profile
    const { data: kol, error: kolError } = await this.supabase
      .from('kol_profiles')
      .insert({
        user_id: user.id,
        name: input.name,
        email: input.email,
        telegram_handle: input.telegram_handle,
        status: input.status,
        notes: input.notes,
      })
      .select()
      .single();

    if (kolError || !kol) {
      console.error('Error creating KOL:', kolError);
      throw kolError;
    }

    // Create platforms
    let platforms: KOLPlatform[] = [];
    if (input.platforms && input.platforms.length > 0) {
      const { data: platformData, error: platformError } = await this.supabase
        .from('kol_platforms')
        .insert(input.platforms.map(p => ({
          kol_id: kol.id,
          platform: p.platform,
          profile_url: p.profile_url,
          follower_count: p.follower_count,
        })))
        .select();

      if (platformError) {
        console.error('Error creating platforms:', platformError);
      } else {
        platforms = platformData as KOLPlatform[];
      }
    }

    // Create documents
    let documents: KOLDocument[] = [];
    if (input.documents && input.documents.length > 0) {
      const { data: docData, error: docError } = await this.supabase
        .from('kol_documents')
        .insert(input.documents.map(d => ({
          kol_id: kol.id,
          name: d.name,
          type: d.type,
          file_size: d.size,
          file_url: d.url,
        })))
        .select();

      if (docError) {
        console.error('Error creating documents:', docError);
      } else {
        documents = (docData || []).map(d => ({
          ...d,
          size: d.file_size || 0,
          uploaded_at: d.created_at,
        })) as KOLDocument[];
      }
    }

    return {
      ...kol,
      platforms,
      posts: [],
      documents,
      total_followers: calculateFollowers(platforms),
      total_impressions: 0,
      total_cost: 0,
      num_posts: 0,
      average_cpm: 0,
    } as KOLWithRelations;
  }

  /**
   * Update an existing KOL
   */
  async updateKOL(input: UpdateKOLInput): Promise<KOLWithRelations | null> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    // Update KOL profile
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.telegram_handle !== undefined) updateData.telegram_handle = input.telegram_handle;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const { data: kol, error: kolError } = await this.supabase
      .from('kol_profiles')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (kolError || !kol) {
      console.error('Error updating KOL:', kolError);
      throw kolError;
    }

    // Update platforms if provided
    if (input.platforms) {
      // Delete existing platforms and insert new ones
      await this.supabase.from('kol_platforms').delete().eq('kol_id', input.id);
      
      if (input.platforms.length > 0) {
        await this.supabase.from('kol_platforms').insert(
          input.platforms.map(p => ({
            kol_id: input.id,
            platform: p.platform,
            profile_url: p.profile_url,
            follower_count: p.follower_count,
          }))
        );
      }
    }

    // Refetch full KOL data
    const [platformsRes, postsRes, documentsRes] = await Promise.all([
      this.supabase.from('kol_platforms').select('*').eq('kol_id', input.id),
      this.supabase.from('content_posts').select('*').eq('kol_id', input.id),
      this.supabase.from('kol_documents').select('*').eq('kol_id', input.id),
    ]);

    const platforms = (platformsRes.data || []) as KOLPlatform[];
    const posts = (postsRes.data || []) as ContentPost[];
    const documents = (documentsRes.data || []).map(d => ({
      ...d,
      size: d.file_size || 0,
      uploaded_at: d.created_at,
    })) as KOLDocument[];

    const metrics = calculateMetrics(posts);

    return {
      ...kol,
      platforms,
      posts,
      documents,
      total_followers: calculateFollowers(platforms),
      num_posts: posts.length,
      ...metrics,
    } as KOLWithRelations;
  }

  /**
   * Delete a KOL
   */
  async deleteKOL(id: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await this.supabase
      .from('kol_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting KOL:', error);
      throw error;
    }
  }

  // ============================================
  // POST OPERATIONS
  // ============================================

  /**
   * Create a new post for a KOL
   */
  async createPost(input: CreatePostInput): Promise<ContentPost> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    // #region agent log
    console.log('[KOL-SERVICE] createPost called:', input);
    
    // Check auth status
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    console.log('[KOL-SERVICE] Auth status:', { userId: user?.id, authError: authError?.message });
    // #endregion

    const { data, error } = await this.supabase
      .from('content_posts')
      .insert({
        kol_id: input.kol_id,
        platform: input.platform,
        url: input.url,
        title: input.title,
        posted_date: input.posted_date,
        impressions: input.impressions,
        engagement: input.engagement,
        clicks: input.clicks,
        cost: input.cost,
        notes: input.notes,
      })
      .select()
      .single();

    if (error || !data) {
      // #region agent log
      console.error('[KOL-SERVICE] ERROR creating post:', { error, errorMessage: error?.message, errorCode: error?.code });
      // #endregion
      throw error;
    }

    // #region agent log
    console.log('[KOL-SERVICE] SUCCESS created post:', data);
    // #endregion
    return data as ContentPost;
  }

  /**
   * Update a post
   */
  async updatePost(id: string, input: Partial<CreatePostInput>): Promise<ContentPost> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    // #region agent log
    console.log('[KOL-SERVICE] updatePost - id:', id, 'input.cost:', input.cost, 'type:', typeof input.cost);
    // #endregion

    const { data, error } = await this.supabase
      .from('content_posts')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('[KOL-SERVICE] ERROR updating post:', error?.message);
      throw error;
    }

    // #region agent log
    console.log('[KOL-SERVICE] SUCCESS - sent cost:', input.cost, '→ returned cost:', data.cost);
    // #endregion
    return data as ContentPost;
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await this.supabase
      .from('content_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // ============================================
  // DOCUMENT OPERATIONS
  // ============================================

  /**
   * Create a new document for a KOL
   */
  async createDocument(input: CreateDocumentInput): Promise<KOLDocument> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await this.supabase
      .from('kol_documents')
      .insert({
        kol_id: input.kol_id,
        name: input.name,
        type: input.type,
        file_size: input.size,
        file_url: input.url,
        file_path: input.file_path,
        notes: input.notes,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating document:', error);
      throw error;
    }

    return {
      ...data,
      size: data.file_size || 0,
      url: data.file_url,
      file_path: data.file_path,
      uploaded_at: data.created_at,
    } as KOLDocument;
  }

  /**
   * Create multiple documents for a KOL
   */
  async createDocuments(inputs: CreateDocumentInput[]): Promise<KOLDocument[]> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await this.supabase
      .from('kol_documents')
      .insert(inputs.map(input => ({
        kol_id: input.kol_id,
        name: input.name,
        type: input.type,
        file_size: input.size,
        file_url: input.url,
        file_path: input.file_path,
        notes: input.notes,
      })))
      .select();

    if (error || !data) {
      console.error('Error creating documents:', error);
      throw error;
    }

    return data.map(d => ({
      ...d,
      size: d.file_size || 0,
      url: d.file_url,
      file_path: d.file_path,
      uploaded_at: d.created_at,
    })) as KOLDocument[];
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await this.supabase
      .from('kol_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

// Singleton instance
let kolServiceInstance: KOLService | null = null;

export function getKOLService(): KOLService {
  if (!kolServiceInstance) {
    kolServiceInstance = new KOLService();
  }
  return kolServiceInstance;
}

