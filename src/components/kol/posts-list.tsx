'use client';

import { motion } from 'framer-motion';
import { ContentPost, Platform } from '@/types';
import { PlatformBadge } from '@/components/ui/badge';
import { Button, IconButton } from '@/components/ui/button';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import {
  Plus,
  ExternalLink,
  Eye,
  Heart,
  MousePointer,
  Calendar,
  Edit,
  Trash2,
  BarChart3,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface PostsListProps {
  posts: ContentPost[];
  onAddPost: () => void;
  onEditPost: (post: ContentPost) => void;
  onDeletePost?: (post: ContentPost) => void;
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PostCard({
  post,
  index,
  onEdit,
  onDelete,
}: {
  post: ContentPost;
  index: number;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  const cpm = post.impressions > 0 && post.cost
    ? ((post.cost / post.impressions) * 1000)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <PlatformBadge platform={post.platform} />
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              {new Date(post.posted_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            variant="ghost"
            size="sm"
            icon={<Edit className="h-3.5 w-3.5" />}
            onClick={onEdit}
            className="text-zinc-500 hover:text-white"
          />
          {onDelete && (
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={onDelete}
              className="text-zinc-500 hover:text-red-400"
            />
          )}
        </div>
      </div>

      {/* Title */}
      {post.title && (
        <h4 className="text-sm font-medium text-white mb-3 line-clamp-2">
          {post.title}
        </h4>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Eye className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-zinc-400">Views:</span>
          <span className="text-white font-medium">
            {formatCompactNumber(post.impressions)}
          </span>
        </div>

        {post.engagement !== undefined && post.engagement > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-zinc-400">Eng:</span>
            <span className="text-white font-medium">
              {formatCompactNumber(post.engagement)}
            </span>
          </div>
        )}

        {post.clicks !== undefined && post.clicks > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <MousePointer className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-zinc-400">Clicks:</span>
            <span className="text-white font-medium">
              {formatCompactNumber(post.clicks)}
            </span>
          </div>
        )}

        {cpm !== null && (
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-zinc-400">CPM:</span>
            <span className="text-white font-medium">
              ${cpm.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Cost & Link */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
        {post.cost && post.cost > 0 ? (
          <span className="text-sm text-amber-400 font-medium">
            {formatCurrency(post.cost)}
          </span>
        ) : (
          <span className="text-sm text-zinc-500">No cost tracked</span>
        )}

        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Post
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

function EmptyState({ onAddPost }: { onAddPost: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 mb-4">
        <BarChart3 className="h-6 w-6 text-zinc-500" />
      </div>
      <h4 className="text-base font-medium text-white mb-2">No posts tracked yet</h4>
      <p className="text-sm text-zinc-500 mb-4">
        Start tracking posts to measure campaign performance
      </p>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={onAddPost}
      >
        Add First Post
      </Button>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function PostsList({
  posts,
  onAddPost,
  onEditPost,
  onDeletePost,
}: PostsListProps) {
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime()
  );

  // Calculate summary stats
  const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
  const totalCost = posts.reduce((sum, p) => sum + (p.cost || 0), 0);
  const avgCpm = totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0;

  if (posts.length === 0) {
    return <EmptyState onAddPost={onAddPost} />;
  }

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-zinc-500">Posts:</span>
            <span className="ml-1 text-white font-medium">{posts.length}</span>
          </div>
          <div>
            <span className="text-zinc-500">Total Views:</span>
            <span className="ml-1 text-white font-medium">
              {formatCompactNumber(totalImpressions)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Avg CPM:</span>
            <span className="ml-1 text-white font-medium">
              {avgCpm > 0 ? `$${avgCpm.toFixed(2)}` : 'N/A'}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={onAddPost}
        >
          Add Post
        </Button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-3">
        {sortedPosts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onEdit={() => onEditPost(post)}
            onDelete={onDeletePost ? () => onDeletePost(post) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

