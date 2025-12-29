-- Migration: Add content_posts and kol_documents tables
-- This adds support for tracking individual posts and document uploads

-- ============================================
-- UPDATE ENUMS TO SUPPORT MORE PLATFORMS
-- ============================================

-- Add more platform types
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'twitch';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'linkedin';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'other';

-- Add more KOL statuses
ALTER TYPE kol_status ADD VALUE IF NOT EXISTS 'negotiating';
ALTER TYPE kol_status ADD VALUE IF NOT EXISTS 'completed';

-- ============================================
-- CONTENT POSTS TABLE
-- ============================================
-- Individual posts by KOLs with performance metrics

CREATE TABLE IF NOT EXISTS public.content_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    posted_date DATE NOT NULL,
    impressions BIGINT DEFAULT 0 NOT NULL,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cost DECIMAL(12, 2) DEFAULT 0,
    screenshot_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_content_posts_kol_id ON public.content_posts(kol_id);
CREATE INDEX idx_content_posts_platform ON public.content_posts(platform);
CREATE INDEX idx_content_posts_posted_date ON public.content_posts(posted_date);

-- Enable RLS
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

-- Policies (via kol_profiles ownership)
CREATE POLICY "Users can view posts of their KOLs" ON public.content_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_posts.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert posts for their KOLs" ON public.content_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_posts.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update posts of their KOLs" ON public.content_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_posts.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete posts of their KOLs" ON public.content_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_posts.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_content_posts_updated_at
    BEFORE UPDATE ON public.content_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- KOL DOCUMENTS TABLE
-- ============================================
-- Store document metadata (MSAs, invoices, contracts, etc.)

CREATE TYPE document_type AS ENUM (
    'invoice',
    'msa',
    'contract',
    'other'
);

CREATE TABLE IF NOT EXISTS public.kol_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type document_type DEFAULT 'other' NOT NULL,
    file_url TEXT,
    file_size BIGINT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_kol_documents_kol_id ON public.kol_documents(kol_id);
CREATE INDEX idx_kol_documents_type ON public.kol_documents(type);

-- Enable RLS
ALTER TABLE public.kol_documents ENABLE ROW LEVEL SECURITY;

-- Policies (via kol_profiles ownership)
CREATE POLICY "Users can view documents of their KOLs" ON public.kol_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_documents.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert documents for their KOLs" ON public.kol_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_documents.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents of their KOLs" ON public.kol_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_documents.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete documents of their KOLs" ON public.kol_documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_documents.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_kol_documents_updated_at
    BEFORE UPDATE ON public.kol_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- METRIC SNAPSHOTS TABLE
-- ============================================
-- Track metric changes over time for posts

CREATE TABLE IF NOT EXISTS public.metric_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.content_posts(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    impressions BIGINT DEFAULT 0 NOT NULL,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_metric_snapshots_post_id ON public.metric_snapshots(post_id);
CREATE INDEX idx_metric_snapshots_recorded_at ON public.metric_snapshots(recorded_at);

-- Enable RLS
ALTER TABLE public.metric_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies (via content_posts -> kol_profiles ownership)
CREATE POLICY "Users can view snapshots of their posts" ON public.metric_snapshots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.content_posts cp
            JOIN public.kol_profiles kp ON kp.id = cp.kol_id
            WHERE cp.id = metric_snapshots.post_id
            AND kp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert snapshots for their posts" ON public.metric_snapshots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.content_posts cp
            JOIN public.kol_profiles kp ON kp.id = cp.kol_id
            WHERE cp.id = metric_snapshots.post_id
            AND kp.user_id = auth.uid()
        )
    );

-- ============================================
-- UPDATED KOL SUMMARY VIEW
-- ============================================
-- Include posts and documents counts

DROP VIEW IF EXISTS public.kol_summary;

CREATE OR REPLACE VIEW public.kol_summary AS
SELECT 
    k.id,
    k.user_id,
    k.name,
    k.email,
    k.telegram_handle,
    k.notes,
    k.status,
    k.kyc_completed,
    k.created_at,
    k.updated_at,
    COALESCE(SUM(p.follower_count), 0)::BIGINT AS total_followers,
    COUNT(DISTINCT p.platform)::INTEGER AS platforms_count,
    COALESCE(SUM(cp.impressions), 0)::BIGINT AS total_impressions,
    COALESCE(SUM(cp.cost), 0)::DECIMAL(12,2) AS total_cost,
    COUNT(DISTINCT cp.id)::INTEGER AS num_posts,
    COUNT(DISTINCT d.id)::INTEGER AS num_documents,
    CASE 
        WHEN SUM(cp.impressions) > 0 
        THEN (SUM(cp.cost) / SUM(cp.impressions)) * 1000 
        ELSE 0 
    END::DECIMAL(12,2) AS average_cpm
FROM public.kol_profiles k
LEFT JOIN public.kol_platforms p ON k.id = p.kol_id
LEFT JOIN public.content_posts cp ON k.id = cp.kol_id
LEFT JOIN public.kol_documents d ON k.id = d.kol_id
GROUP BY k.id, k.user_id, k.name, k.email, k.telegram_handle, k.notes, k.status, k.kyc_completed, k.created_at, k.updated_at;

