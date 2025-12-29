import * as XLSX from 'xlsx';
import { Platform, CreateKOLInput, CreateKOLPlatformInput, ImportValidationResult, ImportResult } from '@/types';

// Column mapping configuration
interface ColumnMapping {
  name: string;
  platform?: string;
  profileLink?: string;
  youtubeSubscribers?: string;
  tiktokFollowers?: string;
  twitterFollowers?: string;
  instagramFollowers?: string;
  telegramFollowers?: string;
  email?: string;
  telegramHandle?: string;
  status?: string;
  budget?: string;
  notes?: string;
}

const defaultMapping: ColumnMapping = {
  name: 'Name',
  platform: 'Platform',
  profileLink: 'Profile Link',
  youtubeSubscribers: 'Youtube subscribers',
  tiktokFollowers: 'TikTok Followers',
  twitterFollowers: 'Twitter Followers',
  email: 'Email/Contact',
  budget: 'Budget',
};

// Parse Excel file to JSON
export async function parseExcelFile(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json as Record<string, unknown>[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Get column headers from Excel file
export async function getExcelHeaders(file: File): Promise<string[]> {
  const rows = await parseExcelFile(file);
  if (rows.length === 0) return [];
  return Object.keys(rows[0]);
}

// Detect platform from string
function detectPlatforms(platformStr: string): Platform[] {
  const platforms: Platform[] = [];
  const lowerStr = platformStr.toLowerCase();
  
  if (lowerStr.includes('youtube') || lowerStr.includes('yt')) platforms.push('youtube');
  if (lowerStr.includes('tiktok') || lowerStr.includes('tik tok')) platforms.push('tiktok');
  if (lowerStr.includes('twitter') || lowerStr.includes('x.com')) platforms.push('twitter');
  if (lowerStr.includes('instagram') || lowerStr.includes('ig')) platforms.push('instagram');
  if (lowerStr.includes('telegram') || lowerStr.includes('tg')) platforms.push('telegram');
  
  return platforms;
}

// Extract platform from URL
function extractPlatformFromUrl(url: string): Platform | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('youtube') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('tiktok')) return 'tiktok';
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('instagram')) return 'instagram';
    if (hostname.includes('telegram') || hostname.includes('t.me')) return 'telegram';
    return null;
  } catch {
    return null;
  }
}

// Parse number from various formats
function parseFollowerCount(value: unknown): number {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value !== 'string') return 0;
  
  const str = value.toString().trim().toLowerCase();
  if (!str) return 0;
  
  // Remove commas and spaces
  let cleanStr = str.replace(/[,\s]/g, '');
  
  // Handle K, M, B suffixes
  let multiplier = 1;
  if (cleanStr.endsWith('k')) {
    multiplier = 1000;
    cleanStr = cleanStr.slice(0, -1);
  } else if (cleanStr.endsWith('m')) {
    multiplier = 1000000;
    cleanStr = cleanStr.slice(0, -1);
  } else if (cleanStr.endsWith('b')) {
    multiplier = 1000000000;
    cleanStr = cleanStr.slice(0, -1);
  }
  
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : Math.round(num * multiplier);
}

// Validate and transform a row
export function validateRow(
  row: Record<string, unknown>,
  mapping: ColumnMapping,
  rowNumber: number
): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required: Name
  const name = row[mapping.name] as string;
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
    return { valid: false, errors, warnings, row_number: rowNumber };
  }
  
  // Build KOL input
  const kolInput: CreateKOLInput = {
    name: name.trim(),
    email: mapping.email ? (row[mapping.email] as string)?.trim() : undefined,
    telegram_handle: mapping.telegramHandle ? (row[mapping.telegramHandle] as string)?.trim() : undefined,
    notes: mapping.notes ? (row[mapping.notes] as string)?.trim() : undefined,
    platforms: [],
  };
  
  // Parse platforms from platform column or URLs
  const platformStr = mapping.platform ? (row[mapping.platform] as string) || '' : '';
  const detectedPlatforms = detectPlatforms(platformStr);
  
  // Parse profile links
  const profileLinks = mapping.profileLink ? (row[mapping.profileLink] as string) || '' : '';
  const urls = profileLinks.split(/[,\n]/).map(u => u.trim()).filter(Boolean);
  
  // Build platform entries
  const platformsData: CreateKOLPlatformInput[] = [];
  
  // Add platforms from detected platforms or URLs
  for (const url of urls) {
    const platform = extractPlatformFromUrl(url);
    if (platform) {
      let followerCount = 0;
      
      // Get follower count based on platform
      switch (platform) {
        case 'youtube':
          followerCount = parseFollowerCount(row[mapping.youtubeSubscribers || '']);
          break;
        case 'tiktok':
          followerCount = parseFollowerCount(row[mapping.tiktokFollowers || '']);
          break;
        case 'twitter':
          followerCount = parseFollowerCount(row[mapping.twitterFollowers || '']);
          break;
        case 'instagram':
          followerCount = parseFollowerCount(row[mapping.instagramFollowers || '']);
          break;
        case 'telegram':
          followerCount = parseFollowerCount(row[mapping.telegramFollowers || '']);
          break;
      }
      
      platformsData.push({
        platform,
        profile_url: url,
        follower_count: followerCount,
      });
    }
  }
  
  // Also add platforms from platform string that might not have URLs
  for (const platform of detectedPlatforms) {
    if (!platformsData.find(p => p.platform === platform)) {
      let followerCount = 0;
      
      switch (platform) {
        case 'youtube':
          followerCount = parseFollowerCount(row[mapping.youtubeSubscribers || '']);
          break;
        case 'tiktok':
          followerCount = parseFollowerCount(row[mapping.tiktokFollowers || '']);
          break;
        case 'twitter':
          followerCount = parseFollowerCount(row[mapping.twitterFollowers || '']);
          break;
        case 'instagram':
          followerCount = parseFollowerCount(row[mapping.instagramFollowers || '']);
          break;
        case 'telegram':
          followerCount = parseFollowerCount(row[mapping.telegramFollowers || '']);
          break;
      }
      
      platformsData.push({
        platform,
        profile_url: '',
        follower_count: followerCount,
      });
    }
  }
  
  kolInput.platforms = platformsData;
  
  // Warnings
  if (platformsData.length === 0) {
    warnings.push('No platforms detected');
  }
  
  if (!kolInput.email) {
    warnings.push('No email provided');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    row_number: rowNumber,
    data: kolInput,
  };
}

// Import all rows
export async function importExcelData(
  file: File,
  mapping: ColumnMapping = defaultMapping
): Promise<ImportResult> {
  try {
    const rows = await parseExcelFile(file);
    
    const validationResults: ImportValidationResult[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      const result = validateRow(rows[i], mapping, i + 2); // +2 for 1-indexed and header row
      validationResults.push(result);
    }
    
    const validRows = validationResults.filter(r => r.valid);
    const invalidRows = validationResults.filter(r => !r.valid);
    
    return {
      success: invalidRows.length === 0,
      imported_count: validRows.length,
      failed_count: invalidRows.length,
      errors: invalidRows.flatMap(r => 
        r.errors.map(e => ({ row: r.row_number, message: e }))
      ),
    };
  } catch (error) {
    return {
      success: false,
      imported_count: 0,
      failed_count: 0,
      errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}

// Auto-detect column mapping
export function autoDetectMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};
  
  const patterns: { key: keyof ColumnMapping; patterns: RegExp[] }[] = [
    { key: 'name', patterns: [/^name$/i, /kol\s*name/i, /influencer/i] },
    { key: 'platform', patterns: [/platform/i, /social/i, /channel/i] },
    { key: 'profileLink', patterns: [/profile\s*link/i, /url/i, /link/i] },
    { key: 'youtubeSubscribers', patterns: [/youtube.*sub/i, /yt.*sub/i, /youtube.*follow/i] },
    { key: 'tiktokFollowers', patterns: [/tiktok.*follow/i, /tiktok.*sub/i] },
    { key: 'twitterFollowers', patterns: [/twitter.*follow/i, /x\.com.*follow/i] },
    { key: 'instagramFollowers', patterns: [/instagram.*follow/i, /ig.*follow/i] },
    { key: 'telegramFollowers', patterns: [/telegram.*follow/i, /tg.*follow/i] },
    { key: 'email', patterns: [/email/i, /contact/i, /e-mail/i] },
    { key: 'budget', patterns: [/budget/i, /cost/i, /spend/i, /price/i] },
    { key: 'notes', patterns: [/note/i, /comment/i, /remark/i] },
  ];
  
  for (const header of headers) {
    for (const { key, patterns: patternList } of patterns) {
      if (!mapping[key] && patternList.some(p => p.test(header))) {
        mapping[key] = header;
        break;
      }
    }
  }
  
  return mapping;
}

// Export data to Excel
export function exportToExcel(data: CreateKOLInput[], filename: string = 'kol-export.xlsx') {
  const exportData = data.map(kol => ({
    Name: kol.name,
    Email: kol.email || '',
    'Telegram Handle': kol.telegram_handle || '',
    Platforms: kol.platforms?.map(p => p.platform).join(', ') || '',
    'Profile Links': kol.platforms?.map(p => p.profile_url).filter(Boolean).join(', ') || '',
    'Total Followers': kol.platforms?.reduce((sum, p) => sum + p.follower_count, 0) || 0,
    Notes: kol.notes || '',
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'KOLs');
  
  XLSX.writeFile(workbook, filename);
}

