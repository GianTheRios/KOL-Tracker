'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MetricCard, ProgressMetric } from '@/components/analytics/metric-card';
import { AnimatedBarChart, AnimatedDonutChart, AnimatedLineChart, ChartLegend, Sparkline } from '@/components/analytics/charts';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { useKOLs } from '@/hooks/use-kols';
import {
  DollarSign,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Platform colors for the donut chart
const platformColors: Record<string, string> = {
  youtube: '#a855f7',   // Purple
  tiktok: '#6366f1',    // Indigo
  twitter: '#22d3ee',   // Cyan
  instagram: '#f472b6', // Pink
};

// Monthly trend data (placeholder - would need historical data from backend)
const monthlySpend = [12000, 15000, 18000, 22000, 28000, 25000, 32000, 38000, 35000, 42000, 48000, 52000];
const monthlyImpressions = [1.2, 1.5, 1.8, 2.1, 2.5, 2.3, 2.8, 3.2, 3.0, 3.5, 4.0, 4.5];

export default function AnalyticsPage() {
  const { kols, isLoading, isDemo } = useKOLs();

  // Compute all metrics from the shared KOL data
  const {
    totalSpend,
    totalImpressions,
    totalPosts,
    avgCpm,
    cpmByKol,
    budgetByPlatform,
    totalBudget,
    topPerformers,
    activeInfluencers,
    avgImpressionsPerPost,
  } = useMemo(() => {
    // Calculate totals
    const totalSpend = kols.reduce((sum, kol) => sum + kol.total_cost, 0);
    const totalImpressions = kols.reduce((sum, kol) => sum + kol.total_impressions, 0);
    const totalPosts = kols.reduce((sum, kol) => sum + kol.num_posts, 0);
    const avgCpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;

    // CPM by KOL (only include KOLs with posts/impressions)
    const cpmByKol = kols
      .filter(kol => kol.average_cpm > 0)
      .map(kol => ({
        label: kol.name.length > 12 ? kol.name.slice(0, 12) + '...' : kol.name,
        value: kol.average_cpm,
      }))
      .sort((a, b) => a.value - b.value); // Sort by CPM ascending (best first)

    // Budget by platform - aggregate costs by platform
    const platformTotals: Record<string, number> = {};
    kols.forEach(kol => {
      // Distribute cost proportionally across platforms based on follower count
      const totalFollowers = kol.total_followers || 1;
      kol.platforms.forEach(platform => {
        const platformKey = platform.platform.toLowerCase();
        const proportion = platform.follower_count / totalFollowers;
        const platformCost = kol.total_cost * proportion;
        platformTotals[platformKey] = (platformTotals[platformKey] || 0) + platformCost;
      });
    });

    const budgetByPlatform = Object.entries(platformTotals)
      .map(([platform, value]) => ({
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
        value: Math.round(value),
        color: platformColors[platform] || '#94a3b8',
      }))
      .sort((a, b) => b.value - a.value);

    const totalBudget = budgetByPlatform.reduce((sum, p) => sum + p.value, 0);

    // Top performers by CPM (lower is better)
    const topPerformers = kols
      .filter(kol => kol.average_cpm > 0 && kol.total_cost > 0)
      .sort((a, b) => a.average_cpm - b.average_cpm)
      .slice(0, 5)
      .map((kol, index) => ({
        name: kol.name,
        platform: kol.platforms.length > 1 ? 'Multi' : (kol.platforms[0]?.platform || 'N/A'),
        impressions: kol.total_impressions,
        cost: kol.total_cost,
        cpm: kol.average_cpm,
        roi: index === 0 ? 'Best CPM' : `${index + 1}${index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Best`,
      }));

    // Active influencers (those with posts)
    const activeInfluencers = kols.filter(kol => kol.num_posts > 0).length;

    // Average impressions per post
    const avgImpressionsPerPost = totalPosts > 0 ? Math.round(totalImpressions / totalPosts) : 0;

    return {
      totalSpend,
      totalImpressions,
      totalPosts,
      avgCpm,
      cpmByKol,
      budgetByPlatform,
      totalBudget,
      topPerformers,
      activeInfluencers,
      avgImpressionsPerPost,
    };
  }, [kols]);

  // #region agent log
  // Debug instrumentation - Console logging for Vercel
  if (typeof window !== 'undefined' && kols.length > 0) {
    console.log('[ANALYTICS PAGE] Stats:', { totalInfluencers: kols.length, totalSpend, totalImpressions, totalPosts, avgCpm, isDemo, kolCount: kols.length });
    console.log('[ANALYTICS PAGE] KOL Details:', kols.map(k => ({ name: k.name, cost: k.total_cost, impressions: k.total_impressions, posts: k.num_posts })));
  }
  // #endregion

  // Format helpers
  const formatCompact = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Demo Mode Banner */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
        >
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-500">Demo Mode</p>
            <p className="text-xs text-amber-500/70">
              Viewing sample data. Connect Supabase for live data.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-zinc-400 mt-1">
              Performance insights and budget optimization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
              Last 30 days
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Key metrics - Same metrics as Roster page for consistency */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Influencers"
          value={kols.length}
          previousValue={Math.round(kols.length * 0.85)}
          format="number"
          icon={<Users className="h-5 w-5" />}
          delay={0}
        />
        <MetricCard
          label="Total Spend"
          value={totalSpend}
          previousValue={totalSpend * 0.82}
          format="currency"
          prefix="$"
          icon={<DollarSign className="h-5 w-5" />}
          delay={0.1}
        />
        <MetricCard
          label="Total Impressions"
          value={totalImpressions}
          previousValue={totalImpressions * 0.83}
          format="compact"
          icon={<Eye className="h-5 w-5" />}
          delay={0.2}
        />
        <MetricCard
          label="Total Posts"
          value={totalPosts}
          previousValue={Math.round(totalPosts * 0.85)}
          format="number"
          icon={<TrendingUp className="h-5 w-5" />}
          delay={0.3}
        />
      </div>

      {/* Additional Analytics Metric - Average CPM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Average CPM"
          value={avgCpm}
          previousValue={avgCpm * 1.18}
          format="number"
          prefix="$"
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
          delay={0.4}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPM by Influencer */}
        <ScrollReveal delay={0.1}>
          <AnimatedCard variant="glass" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">CPM by Influencer</h3>
                <p className="text-sm text-zinc-500">Cost per thousand impressions</p>
              </div>
              <BarChart3 className="h-5 w-5 text-zinc-500" />
            </div>
            {cpmByKol.length > 0 ? (
              <AnimatedBarChart
                data={cpmByKol}
                height={200}
                formatValue={(v) => `$${v.toFixed(2)}`}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-zinc-500">
                No CPM data available
              </div>
            )}
          </AnimatedCard>
        </ScrollReveal>

        {/* Budget by platform */}
        <ScrollReveal delay={0.2}>
          <AnimatedCard variant="glass" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Budget by Platform</h3>
                <p className="text-sm text-zinc-500">Total allocation: ${totalBudget.toLocaleString()}</p>
              </div>
            </div>
            {budgetByPlatform.length > 0 ? (
              <div className="flex items-center justify-center gap-8">
                <AnimatedDonutChart
                  data={budgetByPlatform}
                  size={180}
                  strokeWidth={28}
                  centerValue={`$${(totalBudget / 1000).toFixed(0)}K`}
                  centerLabel="Total"
                />
                <ChartLegend
                  items={budgetByPlatform.map(p => ({
                    label: p.label,
                    color: p.color,
                    value: `$${(p.value / 1000).toFixed(1)}K`,
                  }))}
                  className="flex-col"
                />
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-zinc-500">
                No platform data available
              </div>
            )}
          </AnimatedCard>
        </ScrollReveal>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend trend */}
        <ScrollReveal delay={0.2}>
          <AnimatedCard variant="glass" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Monthly Spend Trend</h3>
                <p className="text-sm text-zinc-500">Last 12 months</p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkline data={monthlySpend} width={80} height={24} color="#10b981" />
                <span className="text-sm font-medium text-emerald-500">+33%</span>
              </div>
            </div>
            <AnimatedLineChart
              data={[
                { label: 'Jan', value: 12000 },
                { label: 'Feb', value: 15000 },
                { label: 'Mar', value: 18000 },
                { label: 'Apr', value: 22000 },
                { label: 'May', value: 28000 },
                { label: 'Jun', value: 25000 },
                { label: 'Jul', value: 32000 },
                { label: 'Aug', value: 38000 },
                { label: 'Sep', value: 35000 },
                { label: 'Oct', value: 42000 },
                { label: 'Nov', value: 48000 },
                { label: 'Dec', value: 52000 },
              ]}
              height={180}
              color="#10b981"
              formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
          </AnimatedCard>
        </ScrollReveal>

        {/* Impressions trend */}
        <ScrollReveal delay={0.3}>
          <AnimatedCard variant="glass" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Monthly Impressions</h3>
                <p className="text-sm text-zinc-500">Millions of impressions</p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkline data={monthlyImpressions} width={80} height={24} color="#6366f1" />
                <span className="text-sm font-medium text-indigo-400">+275%</span>
              </div>
            </div>
            <AnimatedLineChart
              data={[
                { label: 'Jan', value: 1.2 },
                { label: 'Feb', value: 1.5 },
                { label: 'Mar', value: 1.8 },
                { label: 'Apr', value: 2.1 },
                { label: 'May', value: 2.5 },
                { label: 'Jun', value: 2.3 },
                { label: 'Jul', value: 2.8 },
                { label: 'Aug', value: 3.2 },
                { label: 'Sep', value: 3.0 },
                { label: 'Oct', value: 3.5 },
                { label: 'Nov', value: 4.0 },
                { label: 'Dec', value: 4.5 },
              ]}
              height={180}
              color="#6366f1"
              formatValue={(v) => `${v.toFixed(1)}M`}
            />
          </AnimatedCard>
        </ScrollReveal>
      </div>

      {/* Budget progress */}
      <ScrollReveal delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressMetric
            label="Q4 Budget Used"
            value={totalSpend}
            max={75000}
            format="currency"
            color="primary"
            delay={0}
          />
          <ProgressMetric
            label="Avg Impressions per Post"
            value={avgImpressionsPerPost}
            max={15000}
            format="number"
            color="success"
            delay={0.1}
          />
          <ProgressMetric
            label="Influencers with Activity"
            value={activeInfluencers}
            max={kols.length}
            format="number"
            color="warning"
            delay={0.2}
          />
        </div>
      </ScrollReveal>

      {/* Top performers table */}
      <ScrollReveal delay={0.4}>
        <AnimatedCard variant="glass" hover={false} className="overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-semibold text-lg">Top Performers by ROI</h3>
            <p className="text-sm text-zinc-500">Best performing influencers (lowest CPM)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Influencer</th>
                  <th>Platform</th>
                  <th>Impressions</th>
                  <th>Cost</th>
                  <th>CPM</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.length > 0 ? (
                  topPerformers.map((row, index) => (
                    <motion.tr
                      key={row.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <td className="font-medium">{row.name}</td>
                      <td className="capitalize">{row.platform}</td>
                      <td>{formatCompact(row.impressions)}</td>
                      <td>${row.cost.toLocaleString()}</td>
                      <td>${row.cpm.toFixed(2)}</td>
                      <td className="text-emerald-500 font-medium">{row.roi}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-zinc-500 py-8">
                      No performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </ScrollReveal>
    </div>
  );
}
