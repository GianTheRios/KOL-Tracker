'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import { KOLCard, KOLListItem } from '@/components/kol/kol-card';
import { ScrollReveal, AnimatedCounter } from '@/components/ui/scroll-reveal';
import { StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { KOLProfile, Platform, KOLStatus } from '@/types';
import {
  Plus,
  Grid3X3,
  List,
  Filter,
  Download,
  Upload,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
} from 'lucide-react';

// Real data from spreadsheet
const demoKOLs: (KOLProfile & { total_followers: number; total_cost: number; average_cpm: number; total_impressions: number; num_posts: number })[] = [
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
    total_followers: 415000,
    total_cost: 2000,
    total_impressions: 25300,
    num_posts: 2,
    average_cpm: 7.91,
  },
];

export default function RosterPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [kols] = useState(demoKOLs);

  const filteredKOLs = kols.filter(kol =>
    kol.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpend = kols.reduce((sum, kol) => sum + kol.total_cost, 0);
  const totalImpressions = kols.reduce((sum, kol) => sum + kol.total_impressions, 0);
  const totalPosts = kols.reduce((sum, kol) => sum + kol.num_posts, 0);
  // CPM = (Total Cost / Total Impressions) * 1000
  const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">KOL Roster</h1>
            <p className="text-zinc-400 mt-1">
              Manage and track your Key Opinion Leaders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
              Import
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} glow>
              Add KOL
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total KOLs', value: kols.length, icon: Users, color: 'text-indigo-400' },
            { label: 'Total Spend', value: totalSpend, icon: DollarSign, color: 'text-emerald-500', format: 'currency' },
            { label: 'Total Impressions', value: totalImpressions, icon: Eye, color: 'text-blue-500', format: 'compact' },
            { label: 'Total Posts', value: totalPosts, icon: TrendingUp, color: 'text-amber-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                  <div className="text-xl font-bold text-white">
                    {stat.format === 'currency' && '$'}
                    <AnimatedCounter
                      value={stat.value}
                      formatFn={(v) => {
                        if (stat.format === 'compact') return Math.round(v).toLocaleString();
                        if (stat.format === 'cpm') return v.toFixed(2);
                        return Math.round(v).toLocaleString();
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Filters and search */}
      <ScrollReveal delay={0.2}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-80">
              <SearchInput
                placeholder="Search KOLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filters
            </Button>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
              }`}
              onClick={() => setViewMode('grid')}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3X3 className="h-4 w-4" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
              }`}
              onClick={() => setViewMode('list')}
              whileTap={{ scale: 0.95 }}
            >
              <List className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </ScrollReveal>

      {/* KOL Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <StaggerContainer>
              {filteredKOLs.map((kol) => (
                <StaggerItem key={kol.id}>
                  <KOLCard
                    kol={kol}
                    onEdit={(k) => console.log('Edit', k)}
                    onDelete={(k) => console.log('Delete', k)}
                    onView={(k) => console.log('View', k)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredKOLs.map((kol, index) => (
              <KOLListItem
                key={kol.id}
                kol={kol}
                index={index}
                onEdit={(k) => console.log('Edit', k)}
                onView={(k) => console.log('View', k)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {filteredKOLs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
            <Users className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">No KOLs found</h3>
          <p className="text-zinc-400 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first KOL'}
          </p>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Add KOL
          </Button>
        </motion.div>
      )}
    </div>
  );
}
