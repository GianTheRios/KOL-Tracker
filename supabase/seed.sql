-- Seed Script for KOL Tracker
-- User UUID: 97904431-81c6-4aae-893d-e7f548ce11d5
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Create user profile
-- ============================================
INSERT INTO public.profiles (id, email, full_name, company_name)
VALUES (
  '97904431-81c6-4aae-893d-e7f548ce11d5',
  'demo@koltracker.com',
  'KOL Tracker User',
  'KOL Tracker Demo'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create KOL profiles
-- ============================================
INSERT INTO public.kol_profiles (id, user_id, name, email, telegram_handle, status, kyc_completed, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Crypto Wendy', 'wendy@crypto.com', '@cryptowendy', 'paid', true, 'Top performer in crypto space'),
  ('22222222-2222-2222-2222-222222222222', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Joshua Jake', 'jake@influencer.io', NULL, 'in_contact', true, 'Large TikTok following'),
  ('33333333-3333-3333-3333-333333333333', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Rise Up Morning Show', 'show@riseup.com', NULL, 'paid', true, 'Morning show with engaged audience'),
  ('44444444-4444-4444-4444-444444444444', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Crypto with Leo', 'leo@crypto.com', NULL, 'paid', true, 'YouTube crypto educator'),
  ('55555555-5555-5555-5555-555555555555', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Jolly Green Investor', 'jolly@investor.com', NULL, 'paid', true, 'Investment focused content'),
  ('66666666-6666-6666-6666-666666666666', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Bodoggos', 'bodoggos@gmail.com', NULL, 'paid', true, 'High engagement TikTok creator'),
  ('77777777-7777-7777-7777-777777777777', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Wale.Moca', 'wale@moca.com', NULL, 'paid', true, 'Twitter/X influencer'),
  ('88888888-8888-8888-8888-888888888888', '97904431-81c6-4aae-893d-e7f548ce11d5', 'When Shift Happens', NULL, NULL, 'in_contact', false, 'YouTube podcast'),
  ('99999999-9999-9999-9999-999999999999', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Star Platinum', 'star@platinum.com', NULL, 'paid', true, 'TikTok crypto content'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Pix', 'pix@creator.com', NULL, 'paid', true, 'Instagram creator'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Andrew Asks', 'andrew@asks.com', NULL, 'paid', true, 'YouTube interviewer'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '97904431-81c6-4aae-893d-e7f548ce11d5', 'Crypto Meg/Mason', 'meg@crypto.com', NULL, 'paid', true, 'Duo content creators')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Create KOL platforms
-- ============================================
INSERT INTO public.kol_platforms (kol_id, platform, profile_url, follower_count) VALUES
  -- Crypto Wendy
  ('11111111-1111-1111-1111-111111111111', 'youtube', 'https://youtube.com/@cryptowendy', 258000),
  ('11111111-1111-1111-1111-111111111111', 'tiktok', 'https://tiktok.com/@cryptowendy', 299000),
  -- Joshua Jake
  ('22222222-2222-2222-2222-222222222222', 'tiktok', 'https://tiktok.com/@joshuajake', 705000),
  -- Rise Up Morning Show
  ('33333333-3333-3333-3333-333333333333', 'tiktok', 'https://tiktok.com/@riseupshow', 365000),
  ('33333333-3333-3333-3333-333333333333', 'twitter', 'https://twitter.com/riseupshow', 120000),
  -- Crypto with Leo
  ('44444444-4444-4444-4444-444444444444', 'youtube', 'https://youtube.com/@cryptowithleo', 180000),
  -- Jolly Green Investor
  ('55555555-5555-5555-5555-555555555555', 'tiktok', 'https://tiktok.com/@jollygreeninvestor', 439000),
  ('55555555-5555-5555-5555-555555555555', 'instagram', 'https://instagram.com/jollygreeninvestor', 89000),
  -- Bodoggos
  ('66666666-6666-6666-6666-666666666666', 'tiktok', 'https://tiktok.com/@bodoggos', 520000),
  -- Wale.Moca
  ('77777777-7777-7777-7777-777777777777', 'twitter', 'https://twitter.com/walemoca', 85000),
  -- When Shift Happens
  ('88888888-8888-8888-8888-888888888888', 'youtube', 'https://youtube.com/@whenshifthappens', 91000),
  -- Star Platinum
  ('99999999-9999-9999-9999-999999999999', 'tiktok', 'https://tiktok.com/@starplatinum', 125000),
  -- Pix
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'instagram', 'https://instagram.com/pix', 200000),
  -- Andrew Asks
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'youtube', 'https://youtube.com/@andrewasks', 150000),
  -- Crypto Meg/Mason
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'tiktok', 'https://tiktok.com/@cryptomeg', 320000),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'youtube', 'https://youtube.com/@cryptomason', 95000)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 4: Create sample posts with metrics
-- ============================================
INSERT INTO public.content_posts (id, kol_id, platform, url, title, posted_date, impressions, engagement, clicks, cost) VALUES
  -- Crypto Wendy posts
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'youtube', 'https://youtube.com/watch?v=abc123', 'Crypto Market Update Dec 2024', '2024-12-01', 15200, 1200, 450, 4000),
  ('p1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'youtube', 'https://youtube.com/watch?v=def456', 'Top 5 Altcoins for 2025', '2024-12-10', 18500, 1800, 620, 4000),
  ('p1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'tiktok', 'https://tiktok.com/@cryptowendy/video/1', 'Quick crypto tip', '2024-12-15', 8000, 900, 200, 3500),
  ('p1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'tiktok', 'https://tiktok.com/@cryptowendy/video/2', 'Market reaction', '2024-12-20', 8000, 750, 180, 3500),
  
  -- Rise Up Morning Show posts
  ('p3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'tiktok', 'https://tiktok.com/@riseupshow/video/1', 'Morning crypto news', '2024-11-01', 5200, 400, 120, 400),
  ('p3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'tiktok', 'https://tiktok.com/@riseupshow/video/2', 'Market open recap', '2024-11-08', 4800, 380, 100, 400),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'tiktok', 'https://tiktok.com/@riseupshow/video/3', 'Weekly roundup', '2024-11-15', 5500, 420, 130, 400),
  ('p3333333-3333-3333-3333-333333333334', '33333333-3333-3333-3333-333333333333', 'twitter', 'https://twitter.com/riseupshow/status/1', 'Breaking news thread', '2024-11-20', 12000, 800, 250, 800),
  
  -- Crypto with Leo posts
  ('p4444444-4444-4444-4444-444444444441', '44444444-4444-4444-4444-444444444444', 'youtube', 'https://youtube.com/watch?v=leo1', 'Bitcoin analysis', '2024-12-05', 8500, 650, 200, 0),
  ('p4444444-4444-4444-4444-444444444442', '44444444-4444-4444-4444-444444444444', 'youtube', 'https://youtube.com/watch?v=leo2', 'ETH deep dive', '2024-12-12', 7200, 580, 175, 0),
  ('p4444444-4444-4444-4444-444444444443', '44444444-4444-4444-4444-444444444444', 'youtube', 'https://youtube.com/watch?v=leo3', 'Altcoin picks', '2024-12-18', 6800, 520, 160, 0),
  
  -- Jolly Green Investor posts
  ('p5555555-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555', 'tiktok', 'https://tiktok.com/@jollygreeninvestor/1', 'Investment tip', '2024-12-01', 12500, 1100, 320, 3000),
  ('p5555555-5555-5555-5555-555555555552', '55555555-5555-5555-5555-555555555555', 'tiktok', 'https://tiktok.com/@jollygreeninvestor/2', 'Portfolio update', '2024-12-10', 11200, 980, 280, 3000),
  ('p5555555-5555-5555-5555-555555555553', '55555555-5555-5555-5555-555555555555', 'instagram', 'https://instagram.com/p/jolly1', 'Weekly gains', '2024-12-15', 8500, 720, 200, 3000),
  ('p5555555-5555-5555-5555-555555555554', '55555555-5555-5555-5555-555555555555', 'instagram', 'https://instagram.com/p/jolly2', 'Year in review', '2024-12-20', 14559, 1200, 400, 3000),
  
  -- Bodoggos posts
  ('p6666666-6666-6666-6666-666666666661', '66666666-6666-6666-6666-666666666666', 'tiktok', 'https://tiktok.com/@bodoggos/1', 'Viral crypto moment', '2024-12-05', 52000, 4500, 1200, 3333),
  ('p6666666-6666-6666-6666-666666666662', '66666666-6666-6666-6666-666666666666', 'tiktok', 'https://tiktok.com/@bodoggos/2', 'Trading reaction', '2024-12-12', 48500, 4200, 1100, 3333),
  ('p6666666-6666-6666-6666-666666666663', '66666666-6666-6666-6666-666666666666', 'tiktok', 'https://tiktok.com/@bodoggos/3', 'Market meme', '2024-12-18', 44800, 3800, 980, 3333),
  
  -- Wale.Moca post
  ('p7777777-7777-7777-7777-777777777771', '77777777-7777-7777-7777-777777777777', 'twitter', 'https://twitter.com/walemoca/status/1', 'Thread: Crypto outlook 2025', '2024-12-15', 15200, 1200, 350, 2500),
  
  -- Star Platinum post
  ('p9999999-9999-9999-9999-999999999991', '99999999-9999-9999-9999-999999999999', 'tiktok', 'https://tiktok.com/@starplatinum/1', 'Quick trade tip', '2024-12-10', 4300, 320, 80, 2500),
  
  -- Pix post
  ('paaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'instagram', 'https://instagram.com/p/pix1', 'Crypto lifestyle', '2024-12-08', 16400, 1400, 420, 2500),
  
  -- Andrew Asks posts
  ('pbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'youtube', 'https://youtube.com/watch?v=andrew1', 'Interview: Crypto CEO', '2024-12-05', 5200, 420, 150, 1250),
  ('pbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'youtube', 'https://youtube.com/watch?v=andrew2', 'Q&A: DeFi explained', '2024-12-15', 4800, 380, 130, 1250),
  
  -- Crypto Meg/Mason posts
  ('pcccccc1-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'tiktok', 'https://tiktok.com/@cryptomeg/1', 'Duo crypto tips', '2024-12-10', 15200, 1300, 380, 1000),
  ('pcccccc2-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'youtube', 'https://youtube.com/watch?v=mason1', 'Weekly analysis', '2024-12-18', 10100, 820, 240, 1000)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Create sample documents
-- ============================================
INSERT INTO public.kol_documents (id, kol_id, name, type, file_size) VALUES
  -- Crypto Wendy documents
  ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'CryptoWendy_Contract_2024.pdf', 'contract', 245000),
  ('d1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Invoice_Dec2024_15000.pdf', 'invoice', 125000),
  -- Rise Up Morning Show
  ('d3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'RiseUp_MSA_2024.pdf', 'msa', 380000),
  ('d3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'RiseUp_Invoice_Q4.pdf', 'invoice', 98000),
  -- Jolly Green Investor
  ('d5555555-5555-5555-5555-555555555551', '55555555-5555-5555-5555-555555555555', 'JollyGreen_Agreement.pdf', 'contract', 290000),
  -- Bodoggos
  ('d6666666-6666-6666-6666-666666666661', '66666666-6666-6666-6666-666666666666', 'Bodoggos_Contract_Dec2024.pdf', 'contract', 215000),
  ('d6666666-6666-6666-6666-666666666662', '66666666-6666-6666-6666-666666666666', 'Bodoggos_Invoice.pdf', 'invoice', 88000)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Done! Verify the data:
-- ============================================
SELECT 
  'KOL Profiles' as table_name, 
  COUNT(*) as count 
FROM public.kol_profiles
UNION ALL
SELECT 
  'Platforms' as table_name, 
  COUNT(*) as count 
FROM public.kol_platforms
UNION ALL
SELECT 
  'Posts' as table_name, 
  COUNT(*) as count 
FROM public.content_posts
UNION ALL
SELECT 
  'Documents' as table_name, 
  COUNT(*) as count 
FROM public.kol_documents;

