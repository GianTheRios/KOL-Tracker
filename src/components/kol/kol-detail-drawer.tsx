'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerSection } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PlatformBadge, StatusBadge } from '@/components/ui/badge';
import { KOLProfile, KOLPlatform, ContentPost, KOLDocument } from '@/types';
import { formatCompactNumber, formatCurrency, getInitials } from '@/lib/utils';
import { PostsList } from './posts-list';
import { DocumentsList } from './documents-list';
import { AnimatedLineChart } from '@/components/analytics/charts';
import {
  Mail,
  Send,
  ExternalLink,
  Edit,
  TrendingUp,
  Eye,
  DollarSign,
  BarChart3,
  Calendar,
  FileText,
  LayoutGrid,
  LineChart,
  FolderOpen,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type TabType = 'overview' | 'posts' | 'performance' | 'documents';

interface KOLDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddPost?: () => void;
  onEditPost?: (post: ContentPost) => void;
  onDeletePost?: (post: ContentPost) => void;
  onAddDocuments?: (docs: KOLDocument[]) => void;
  onDeleteDocument?: (doc: KOLDocument) => void;
  kol: (KOLProfile & {
    platforms?: KOLPlatform[];
    total_followers?: number;
    total_cost?: number;
    total_impressions?: number;
    num_posts?: number;
    average_cpm?: number;
    posts?: ContentPost[];
    documents?: KOLDocument[];
  }) | null;
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${active
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'text-zinc-400' 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className={`p-2 rounded-lg bg-zinc-700/50 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-zinc-500">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value?: string; icon?: React.ElementType }) {
  if (!value) return null;
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
      <span className="text-sm text-zinc-500 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

// ============================================
// TAB CONTENT COMPONENTS
// ============================================

function OverviewTab({ kol }: { kol: NonNullable<KOLDetailDrawerProps['kol']> }) {
  const totalFollowers = kol.total_followers || 
    (kol.platforms?.reduce((sum, p) => sum + p.follower_count, 0) ?? 0);
  
  const totalCost = kol.total_cost ?? 0;
  const totalImpressions = kol.total_impressions ?? 0;
  const numPosts = kol.num_posts ?? (kol.posts?.length ?? 0);
  const averageCpm = kol.average_cpm ?? (totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0);

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <DrawerSection title="Performance Overview">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Eye}
            label="Total Impressions"
            value={formatCompactNumber(totalImpressions)}
            color="text-blue-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Posts"
            value={numPosts}
            color="text-emerald-400"
          />
          <StatCard
            icon={DollarSign}
            label="Total Spend"
            value={formatCurrency(totalCost)}
            color="text-amber-400"
          />
          <StatCard
            icon={BarChart3}
            label="Average CPM"
            value={averageCpm > 0 ? `$${averageCpm.toFixed(2)}` : 'N/A'}
            color="text-violet-400"
          />
        </div>
      </DrawerSection>

      {/* Platform Details */}
      {kol.platforms && kol.platforms.length > 0 && (
        <DrawerSection title="Platform Details">
          <div className="space-y-3">
            {kol.platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={platform.platform} />
                  <div>
                    <div className="text-sm font-medium text-white">
                      {formatCompactNumber(platform.follower_count)} followers
                    </div>
                    {platform.profile_url && (
                      <a
                        href={platform.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </DrawerSection>
      )}

      {/* Details */}
      <DrawerSection title="Details">
        <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
          <InfoRow 
            label="Created" 
            value={new Date(kol.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} 
            icon={Calendar}
          />
          <InfoRow 
            label="Last Updated" 
            value={new Date(kol.updated_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} 
            icon={Calendar}
          />
          <InfoRow 
            label="Total Followers" 
            value={formatCompactNumber(totalFollowers)} 
            icon={TrendingUp}
          />
          <InfoRow 
            label="KYC Status" 
            value={kol.kyc_completed ? 'Completed' : 'Pending'} 
            icon={FileText}
          />
        </div>
      </DrawerSection>

      {/* Notes */}
      {kol.notes && (
        <DrawerSection title="Notes">
          <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{kol.notes}</p>
          </div>
        </DrawerSection>
      )}
    </div>
  );
}

function PerformanceTab({ posts }: { posts: ContentPost[] }) {
  // Aggregate posts by week for the chart
  const getWeeklyData = () => {
    if (posts.length === 0) return [];

    // Sort posts by date
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime()
    );

    // Group by week
    const weeklyMap = new Map<string, { impressions: number; cost: number; posts: number }>();
    
    sortedPosts.forEach(post => {
      const date = new Date(post.posted_date);
      // Get start of week (Sunday)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const weekKey = startOfWeek.toISOString().split('T')[0];
      
      const existing = weeklyMap.get(weekKey) || { impressions: 0, cost: 0, posts: 0 };
      weeklyMap.set(weekKey, {
        impressions: existing.impressions + post.impressions,
        cost: existing.cost + (post.cost || 0),
        posts: existing.posts + 1,
      });
    });

    return Array.from(weeklyMap.entries()).map(([date, data]) => ({
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: data.impressions,
      cost: data.cost,
      posts: data.posts,
    }));
  };

  const weeklyData = getWeeklyData();
  const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
  const totalCost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
  const avgCpm = totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0;

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 mb-4">
          <LineChart className="h-6 w-6 text-zinc-500" />
        </div>
        <h4 className="text-base font-medium text-white mb-2">No performance data</h4>
        <p className="text-sm text-zinc-500">
          Add posts to start tracking performance over time
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center">
          <div className="text-2xl font-bold text-white">{posts.length}</div>
          <div className="text-xs text-zinc-500">Total Posts</div>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center">
          <div className="text-2xl font-bold text-blue-400">{formatCompactNumber(totalImpressions)}</div>
          <div className="text-xs text-zinc-500">Total Impressions</div>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center">
          <div className="text-2xl font-bold text-violet-400">${avgCpm.toFixed(2)}</div>
          <div className="text-xs text-zinc-500">Average CPM</div>
        </div>
      </div>

      {/* Impressions Chart */}
      <DrawerSection title="Weekly Impressions">
        <div className="h-48 bg-zinc-800/30 rounded-xl border border-zinc-700/30 p-4">
          {weeklyData.length > 1 ? (
            <AnimatedLineChart
              data={weeklyData}
              height={160}
              color="#818cf8"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
              Need more data points for chart
            </div>
          )}
        </div>
      </DrawerSection>

      {/* Weekly Breakdown */}
      <DrawerSection title="Weekly Breakdown">
        <div className="space-y-2">
          {weeklyData.map((week, index) => (
            <motion.div
              key={week.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-white">{week.label}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-zinc-400">
                  {week.posts} post{week.posts !== 1 ? 's' : ''}
                </span>
                <span className="text-blue-400">{formatCompactNumber(week.value)} views</span>
              </div>
            </motion.div>
          ))}
        </div>
      </DrawerSection>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function KOLDetailDrawer({ 
  isOpen, 
  onClose, 
  onEdit,
  onAddPost,
  onEditPost,
  onDeletePost,
  onAddDocuments,
  onDeleteDocument,
  kol,
}: KOLDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Reset tab when drawer closes
  if (!isOpen && activeTab !== 'overview') {
    setActiveTab('overview');
  }

  if (!kol) return null;

  const posts = kol.posts || [];
  const documents = kol.documents || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title=""
      width="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={onEdit}
            leftIcon={<Edit className="h-4 w-4" />}
            glow
          >
            Edit Influencer
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 pb-4 border-b border-zinc-800"
        >
          {/* Avatar */}
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            {getInitials(kol.name)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{kol.name}</h2>
              <StatusBadge status={kol.status} />
            </div>
            
            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              {kol.email && (
                <a 
                  href={`mailto:${kol.email}`} 
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {kol.email}
                </a>
              )}
              {kol.telegram_handle && (
                <a 
                  href={`https://t.me/${kol.telegram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  {kol.telegram_handle}
                </a>
              )}
            </div>
            
            {/* Platform Badges */}
            {kol.platforms && kol.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {kol.platforms.map(platform => (
                  <PlatformBadge 
                    key={platform.id}
                    platform={platform.platform} 
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 overflow-x-auto">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={LayoutGrid}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={FileText}
            label={`Posts${posts.length > 0 ? ` (${posts.length})` : ''}`}
          />
          <TabButton
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
            icon={LineChart}
            label="Performance"
          />
          <TabButton
            active={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
            icon={FolderOpen}
            label={`Docs${documents.length > 0 ? ` (${documents.length})` : ''}`}
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab kol={kol} />}
            {activeTab === 'posts' && (
              <PostsList
                posts={posts}
                onAddPost={onAddPost || (() => {})}
                onEditPost={onEditPost || (() => {})}
                onDeletePost={onDeletePost}
              />
            )}
            {activeTab === 'performance' && <PerformanceTab posts={posts} />}
            {activeTab === 'documents' && (
              <DocumentsList
                kolId={kol.id}
                documents={documents}
                onAddDocuments={onAddDocuments || (() => {})}
                onDeleteDocument={onDeleteDocument || (() => {})}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Drawer>
  );
}
