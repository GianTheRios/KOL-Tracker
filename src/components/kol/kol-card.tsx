'use client';

import { motion } from 'framer-motion';
import { AnimatedCard, CardContent } from '@/components/ui/animated-card';
import { PlatformBadge, StatusBadge } from '@/components/ui/badge';
import { Button, IconButton } from '@/components/ui/button';
import { KOLProfile, Platform } from '@/types';
import { formatCompactNumber, formatCurrency, getInitials } from '@/lib/utils';
import {
  MoreHorizontal,
  Mail,
  Send,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface KOLCardProps {
  kol: KOLProfile & {
    total_followers?: number;
    total_cost?: number;
    average_cpm?: number;
    total_impressions?: number;
    num_posts?: number;
  };
  onEdit?: (kol: KOLProfile) => void;
  onDelete?: (kol: KOLProfile) => void;
  onView?: (kol: KOLProfile) => void;
}

export function KOLCard({ kol, onEdit, onDelete, onView }: KOLCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AnimatedCard variant="glass" className="relative group h-full">
      <CardContent className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <motion.div
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {getInitials(kol.name)}
            </motion.div>
            <div>
              <h3 className="font-semibold text-white">{kol.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={kol.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative">
            <IconButton
              variant="ghost"
              icon={<MoreHorizontal className="h-4 w-4" />}
              onClick={() => setMenuOpen(!menuOpen)}
            />
            
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-1 w-40 py-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-10"
              >
                <button
                  onClick={() => { onView?.(kol); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View details
                </button>
                <button
                  onClick={() => { onEdit?.(kol); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => { onDelete?.(kol); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {kol.platforms?.map((platform) => (
            <PlatformBadge
              key={platform.platform}
              platform={platform.platform as Platform}
              size="sm"
            />
          ))}
          {(!kol.platforms || kol.platforms.length === 0) && (
            <span className="text-xs text-zinc-500">No platforms added</span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1">Impressions</div>
            <div className="font-semibold text-white">
              {formatCompactNumber(kol.total_impressions || 0)}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1">Posts</div>
            <div className="font-semibold text-white">
              {kol.num_posts || 0}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1">Spent</div>
            <div className="font-semibold text-white">
              {formatCurrency(kol.total_cost || 0)}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1">CPM</div>
            <div className="font-semibold text-white text-xs">
              {(kol.average_cpm || 0) > 0 ? `$${(kol.average_cpm || 0).toFixed(2)}` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          {kol.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate max-w-[120px]">{kol.email}</span>
            </div>
          )}
          {kol.telegram_handle && (
            <div className="flex items-center gap-1">
              <Send className="h-3.5 w-3.5" />
              <span>{kol.telegram_handle}</span>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-auto pt-4">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onView?.(kol)}
            leftIcon={<Eye className="h-3.5 w-3.5" />}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(kol)}
            leftIcon={<Edit className="h-3.5 w-3.5" />}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

// Compact list view variant
interface KOLListItemProps extends KOLCardProps {
  index?: number;
}

export function KOLListItem({ kol, onEdit, onView, index = 0 }: KOLListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors group"
    >
      {/* Avatar */}
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
        {getInitials(kol.name)}
      </div>

      {/* Name & status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">{kol.name}</span>
          <StatusBadge status={kol.status} size="sm" />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {kol.platforms?.slice(0, 3).map((p) => (
            <PlatformBadge key={p.platform} platform={p.platform as Platform} size="sm" showIcon={false} />
          ))}
          {(kol.platforms?.length || 0) > 3 && (
            <span className="text-xs text-zinc-500">+{(kol.platforms?.length || 0) - 3}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="text-zinc-500 text-xs">Impressions</div>
          <div className="font-medium text-white">{formatCompactNumber(kol.total_impressions || 0)}</div>
        </div>
        <div className="text-center">
          <div className="text-zinc-500 text-xs">Posts</div>
          <div className="font-medium text-white">{kol.num_posts || 0}</div>
        </div>
        <div className="text-center">
          <div className="text-zinc-500 text-xs">Spent</div>
          <div className="font-medium text-white">{formatCurrency(kol.total_cost || 0)}</div>
        </div>
        <div className="text-center">
          <div className="text-zinc-500 text-xs">CPM</div>
          <div className="font-medium text-white">{(kol.average_cpm || 0) > 0 ? `$${(kol.average_cpm || 0).toFixed(2)}` : 'N/A'}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Eye className="h-4 w-4" />}
          onClick={() => onView?.(kol)}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Edit className="h-4 w-4" />}
          onClick={() => onEdit?.(kol)}
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<ExternalLink className="h-4 w-4" />}
        />
      </div>
    </motion.div>
  );
}
