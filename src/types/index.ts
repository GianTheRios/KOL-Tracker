// ============================================
// KOL TRACKER - TYPE DEFINITIONS
// ============================================

// Platform types
export type Platform = 'youtube' | 'tiktok' | 'twitter' | 'instagram' | 'telegram';

// Status types
export type KOLStatus = 
  | 'reached' 
  | 'in_contact' 
  | 'kyc' 
  | 'contracted' 
  | 'invoiced' 
  | 'paid' 
  | 'not_paid';

export type InvoiceStatus = 'pending' | 'invoiced' | 'paid' | 'not_paid' | 'cancelled';

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';

// Budget period
export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one_time';

// ============================================
// CORE ENTITIES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface KOLProfile {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  telegram_handle?: string;
  notes?: string;
  status: KOLStatus;
  kyc_completed: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  platforms?: KOLPlatform[];
  contracts?: Contract[];
  invoices?: Invoice[];
  performance_metrics?: PerformanceMetric[];
  content_briefs?: ContentBrief[];
  content_links?: ContentLink[];
}

export interface KOLPlatform {
  id: string;
  kol_id: string;
  platform: Platform;
  profile_url: string;
  follower_count: number;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  kol_id: string;
  user_id: string;
  status: ContractStatus;
  file_url?: string;
  file_name?: string;
  signed_date?: string;
  expiry_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  kol_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  budget_period: BudgetPeriod;
  due_date?: string;
  paid_date?: string;
  invoice_number?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetric {
  id: string;
  kol_id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  period_type: 'weekly' | 'monthly' | 'quarterly';
  
  // Metrics
  impressions: number;
  engagement?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  
  // Calculated fields (can be computed)
  cost?: number;
  cpm?: number;
  cpc?: number;
  roi?: number;
  
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentBrief {
  id: string;
  kol_id: string;
  user_id: string;
  title: string;
  description?: string;
  requirements?: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'cancelled';
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentLink {
  id: string;
  kol_id: string;
  content_brief_id?: string;
  platform: Platform;
  url: string;
  title?: string;
  posted_date?: string;
  impressions?: number;
  engagement?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// AGGREGATED / COMPUTED TYPES
// ============================================

export interface KOLWithMetrics extends KOLProfile {
  total_cost: number;
  total_impressions: number;
  total_followers: number;
  average_cpm: number;
  roi?: number;
  platforms_count: number;
  content_count: number;
  latest_activity?: string;
}

export interface DashboardMetrics {
  total_kols: number;
  total_spend: number;
  total_impressions: number;
  average_cpm: number;
  total_followers_reach: number;
  active_contracts: number;
  pending_invoices: number;
  pending_amount: number;
}

export interface PeriodComparison {
  current: number;
  previous: number;
  change: number;
  change_percentage: number;
  is_positive: boolean;
}

export interface TopPerformer {
  kol: KOLProfile;
  metric_value: number;
  metric_name: string;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage: number;
  kol_count: number;
}

export interface CPMAnalysis {
  kol_id: string;
  kol_name: string;
  platform: Platform;
  cpm: number;
  impressions: number;
  cost: number;
  period: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateKOLInput {
  name: string;
  email?: string;
  telegram_handle?: string;
  notes?: string;
  status?: KOLStatus;
  platforms?: CreateKOLPlatformInput[];
}

export interface CreateKOLPlatformInput {
  platform: Platform;
  profile_url: string;
  follower_count: number;
  username?: string;
}

export interface UpdateKOLInput extends Partial<CreateKOLInput> {
  id: string;
}

export interface CreateInvoiceInput {
  kol_id: string;
  amount: number;
  currency?: string;
  status?: InvoiceStatus;
  budget_period: BudgetPeriod;
  due_date?: string;
  invoice_number?: string;
  notes?: string;
}

export interface CreatePerformanceMetricInput {
  kol_id: string;
  period_start: string;
  period_end: string;
  period_type: 'weekly' | 'monthly' | 'quarterly';
  impressions: number;
  engagement?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  cost?: number;
  notes?: string;
}

// ============================================
// EXCEL IMPORT TYPES
// ============================================

export interface ExcelImportRow {
  name: string;
  platforms: string;
  profile_links: string;
  youtube_subscribers?: number;
  tiktok_followers?: number;
  twitter_followers?: number;
  instagram_followers?: number;
  telegram_followers?: number;
  reached_out?: string;
  kyc?: string;
  contracts?: string;
  invoices?: string;
  email?: string;
  budget?: string;
  content_brief?: string;
  content_links?: string;
}

export interface ExcelColumnMapping {
  source_column: string;
  target_field: keyof ExcelImportRow;
  transform?: (value: unknown) => unknown;
}

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  row_number: number;
  data?: CreateKOLInput;
}

export interface ImportResult {
  success: boolean;
  imported_count: number;
  failed_count: number;
  errors: { row: number; message: string }[];
  kols?: KOLProfile[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export interface KOLFilters {
  search?: string;
  status?: KOLStatus[];
  platforms?: Platform[];
  min_followers?: number;
  max_followers?: number;
  min_cpm?: number;
  max_cpm?: number;
  has_contract?: boolean;
  has_pending_invoice?: boolean;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================
// UI STATE TYPES
// ============================================

export interface ModalState {
  isOpen: boolean;
  type?: 'create' | 'edit' | 'delete' | 'view';
  data?: unknown;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

