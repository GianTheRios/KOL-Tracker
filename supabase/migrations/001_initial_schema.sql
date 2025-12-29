-- KOL Tracker Database Schema
-- This file contains the initial database schema for the KOL Tracker application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- KOL PROFILES TABLE
-- ============================================
CREATE TYPE kol_status AS ENUM (
    'reached',
    'in_contact',
    'kyc',
    'contracted',
    'invoiced',
    'paid',
    'not_paid'
);

CREATE TABLE IF NOT EXISTS public.kol_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    telegram_handle TEXT,
    notes TEXT,
    status kol_status DEFAULT 'reached' NOT NULL,
    kyc_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_kol_profiles_user_id ON public.kol_profiles(user_id);
CREATE INDEX idx_kol_profiles_status ON public.kol_profiles(status);
CREATE INDEX idx_kol_profiles_name ON public.kol_profiles(name);

-- Enable RLS
ALTER TABLE public.kol_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own KOLs" ON public.kol_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KOLs" ON public.kol_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KOLs" ON public.kol_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own KOLs" ON public.kol_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- KOL PLATFORMS TABLE
-- ============================================
CREATE TYPE platform_type AS ENUM (
    'youtube',
    'tiktok',
    'twitter',
    'instagram',
    'telegram'
);

CREATE TABLE IF NOT EXISTS public.kol_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    profile_url TEXT NOT NULL,
    follower_count INTEGER DEFAULT 0 NOT NULL,
    username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(kol_id, platform)
);

-- Indexes
CREATE INDEX idx_kol_platforms_kol_id ON public.kol_platforms(kol_id);
CREATE INDEX idx_kol_platforms_platform ON public.kol_platforms(platform);

-- Enable RLS
ALTER TABLE public.kol_platforms ENABLE ROW LEVEL SECURITY;

-- Policies (via kol_profiles ownership)
CREATE POLICY "Users can view platforms of their KOLs" ON public.kol_platforms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_platforms.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert platforms for their KOLs" ON public.kol_platforms
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_platforms.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update platforms of their KOLs" ON public.kol_platforms
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_platforms.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete platforms of their KOLs" ON public.kol_platforms
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = kol_platforms.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

-- ============================================
-- CONTRACTS TABLE
-- ============================================
CREATE TYPE contract_status AS ENUM (
    'draft',
    'sent',
    'signed',
    'expired',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status contract_status DEFAULT 'draft' NOT NULL,
    file_url TEXT,
    file_name TEXT,
    signed_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_contracts_kol_id ON public.contracts(kol_id);
CREATE INDEX idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own contracts" ON public.contracts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts" ON public.contracts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts" ON public.contracts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts" ON public.contracts
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TYPE invoice_status AS ENUM (
    'pending',
    'invoiced',
    'paid',
    'not_paid',
    'cancelled'
);

CREATE TYPE budget_period AS ENUM (
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
    'one_time'
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status invoice_status DEFAULT 'pending' NOT NULL,
    budget_period budget_period NOT NULL,
    due_date DATE,
    paid_date DATE,
    invoice_number TEXT,
    file_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_invoices_kol_id ON public.invoices(kol_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON public.invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON public.invoices
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PERFORMANCE METRICS TABLE
-- ============================================
CREATE TYPE period_type AS ENUM (
    'weekly',
    'monthly',
    'quarterly'
);

CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type period_type NOT NULL,
    impressions BIGINT DEFAULT 0 NOT NULL,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    cost DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(kol_id, period_start, period_end, period_type)
);

-- Indexes
CREATE INDEX idx_performance_metrics_kol_id ON public.performance_metrics(kol_id);
CREATE INDEX idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_period ON public.performance_metrics(period_start, period_end);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own metrics" ON public.performance_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics" ON public.performance_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics" ON public.performance_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metrics" ON public.performance_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CONTENT BRIEFS TABLE
-- ============================================
CREATE TYPE content_brief_status AS ENUM (
    'draft',
    'sent',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS public.content_briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    due_date DATE,
    status content_brief_status DEFAULT 'draft' NOT NULL,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_content_briefs_kol_id ON public.content_briefs(kol_id);
CREATE INDEX idx_content_briefs_user_id ON public.content_briefs(user_id);

-- Enable RLS
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own briefs" ON public.content_briefs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own briefs" ON public.content_briefs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own briefs" ON public.content_briefs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own briefs" ON public.content_briefs
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CONTENT LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kol_id UUID NOT NULL REFERENCES public.kol_profiles(id) ON DELETE CASCADE,
    content_brief_id UUID REFERENCES public.content_briefs(id) ON DELETE SET NULL,
    platform platform_type NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    posted_date DATE,
    impressions BIGINT DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_content_links_kol_id ON public.content_links(kol_id);
CREATE INDEX idx_content_links_brief_id ON public.content_links(content_brief_id);

-- Enable RLS
ALTER TABLE public.content_links ENABLE ROW LEVEL SECURITY;

-- Policies (via kol_profiles ownership)
CREATE POLICY "Users can view content links of their KOLs" ON public.content_links
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_links.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert content links for their KOLs" ON public.content_links
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_links.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update content links of their KOLs" ON public.content_links
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_links.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete content links of their KOLs" ON public.content_links
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.kol_profiles
            WHERE kol_profiles.id = content_links.kol_id
            AND kol_profiles.user_id = auth.uid()
        )
    );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kol_profiles_updated_at
    BEFORE UPDATE ON public.kol_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kol_platforms_updated_at
    BEFORE UPDATE ON public.kol_platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON public.contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at
    BEFORE UPDATE ON public.performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_briefs_updated_at
    BEFORE UPDATE ON public.content_briefs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_links_updated_at
    BEFORE UPDATE ON public.content_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for KOL summary with aggregated metrics
CREATE OR REPLACE VIEW public.kol_summary AS
SELECT 
    k.id,
    k.user_id,
    k.name,
    k.email,
    k.status,
    k.kyc_completed,
    k.created_at,
    COALESCE(SUM(p.follower_count), 0) AS total_followers,
    COUNT(DISTINCT p.platform) AS platforms_count,
    COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'paid'), 0) AS total_paid,
    COALESCE(SUM(i.amount) FILTER (WHERE i.status IN ('pending', 'invoiced')), 0) AS pending_amount,
    COALESCE(SUM(pm.impressions), 0) AS total_impressions,
    COALESCE(SUM(pm.cost), 0) AS total_cost,
    CASE 
        WHEN SUM(pm.impressions) > 0 
        THEN (SUM(pm.cost) / SUM(pm.impressions)) * 1000 
        ELSE 0 
    END AS average_cpm
FROM public.kol_profiles k
LEFT JOIN public.kol_platforms p ON k.id = p.kol_id
LEFT JOIN public.invoices i ON k.id = i.kol_id
LEFT JOIN public.performance_metrics pm ON k.id = pm.kol_id
GROUP BY k.id, k.user_id, k.name, k.email, k.status, k.kyc_completed, k.created_at;

