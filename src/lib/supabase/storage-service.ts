'use client';

import { getSupabaseClient } from './client';

const BUCKET_NAME = 'kol-documents';

export interface UploadResult {
  path: string;
  url: string;
}

export class StorageService {
  private supabase = getSupabaseClient();

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return this.supabase !== null;
  }

  /**
   * Upload a file to the KOL documents bucket
   * @param file The file to upload
   * @param kolId The KOL's ID (used for organizing files)
   * @returns The file path and public URL
   */
  async uploadDocument(file: File, kolId: string): Promise<UploadResult> {
    if (!this.supabase) {
      throw new Error('Supabase not configured');
    }

    // Create a unique file path: kol_id/timestamp_filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${kolId}/${timestamp}_${sanitizedName}`;

    // Upload the file
    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL (or signed URL for private buckets)
    const { data: urlData } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 day expiry

    return {
      path: data.path,
      url: urlData?.signedUrl || '',
    };
  }

  /**
   * Upload multiple files
   */
  async uploadDocuments(files: File[], kolId: string): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadDocument(file, kolId);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  /**
   * Get a signed URL for downloading a document
   * @param path The file path in storage
   * @param expiresIn Expiry time in seconds (default: 1 hour)
   */
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
    if (!this.supabase) {
      return null;
    }

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }

    return data.signedUrl;
  }

  /**
   * Download a document
   * @param path The file path in storage
   */
  async downloadDocument(path: string): Promise<Blob | null> {
    if (!this.supabase) {
      return null;
    }

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .download(path);

    if (error) {
      console.error('Error downloading file:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a document from storage
   * @param path The file path in storage
   */
  async deleteDocument(path: string): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  }
}

// Singleton instance
let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new StorageService();
  }
  return storageServiceInstance;
}

