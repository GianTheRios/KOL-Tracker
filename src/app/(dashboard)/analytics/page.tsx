'use client';

import { motion } from 'framer-motion';
import { MetricCard, ProgressMetric } from '@/components/analytics/metric-card';
import { AnimatedBarChart, AnimatedDonutChart, AnimatedLineChart, ChartLegend, Sparkline } from '@/components/analytics/charts';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

// Real data from spreadsheet
const cpmByKol = [
  { label: 'Bodoggos', value: 6.88 },
  { label: 'Crypto Meg', value: 7.91 },
  { label: 'Rise Up Show', value: 8.05 },
  { label: 'Pix', value: 15.24 },
  { label: 'Wale.Moca', value: 16.45 },
  { label: 'Andrew Asks', value: 25.00 },
  { label: 'Jolly Green', value: 25.66 },
  { label: 'Crypto Wendy', value: 30.18 },
  { label: 'Star Platinum', value: 58.14 },
];

const budgetByPlatform = [
  { label: 'YouTube', value: 45000, color: '#a855f7' },  // Purple
  { label: 'TikTok', value: 35000, color: '#6366f1' },   // Indigo
  { label: 'Twitter', value: 12000, color: '#22d3ee' },  // Cyan
  { label: 'Instagram', value: 8000, color: '#f472b6' }, // Pink
];

const monthlySpend = [12000, 15000, 18000, 22000, 28000, 25000, 32000, 38000, 35000, 42000, 48000, 52000];
const monthlyImpressions = [1.2, 1.5, 1.8, 2.1, 2.5, 2.3, 2.8, 3.2, 3.0, 3.5, 4.0, 4.5];

export default function AnalyticsPage() {
  const totalBudget = budgetByPlatform.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="space-y-8">
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

      {/* Key metrics - Real data from spreadsheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Spend"
          value={54999}
          previousValue={45000}
          format="currency"
          prefix="$"
          icon={<DollarSign className="h-5 w-5" />}
          delay={0}
        />
        <MetricCard
          label="Total Impressions"
          value={420637}
          previousValue={350000}
          format="compact"
          icon={<Eye className="h-5 w-5" />}
          delay={0.1}
        />
        <MetricCard
          label="Average CPM"
          value={13.08}
          previousValue={15.50}
          format="number"
          prefix="$"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
          delay={0.2}
        />
        <MetricCard
          label="Total Posts"
          value={41}
          previousValue={35}
          format="number"
          icon={<Users className="h-5 w-5" />}
          delay={0.3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPM by KOL */}
        <ScrollReveal delay={0.1}>
          <AnimatedCard variant="glass" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">CPM by KOL</h3>
                <p className="text-sm text-zinc-500">Cost per thousand impressions</p>
              </div>
              <BarChart3 className="h-5 w-5 text-zinc-500" />
            </div>
            <AnimatedBarChart
              data={cpmByKol}
              height={200}
              formatValue={(v) => `$${v.toFixed(2)}`}
            />
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
                  value: `$${(p.value / 1000).toFixed(0)}K`,
                }))}
                className="flex-col"
              />
            </div>
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
            value={54999}
            max={75000}
            format="currency"
            color="primary"
            delay={0}
          />
          <ProgressMetric
            label="Avg Impressions per Post"
            value={10259}
            max={15000}
            format="number"
            color="success"
            delay={0.1}
          />
          <ProgressMetric
            label="KOLs with Activity"
            value={10}
            max={12}
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
            <p className="text-sm text-zinc-500">Best performing KOLs this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>KOL</th>
                  <th>Platform</th>
                  <th>Impressions</th>
                  <th>Cost</th>
                  <th>CPM</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Bodoggos', platform: 'TikTok', impressions: '145.3K', cost: '$9,999', cpm: '$6.88', roi: 'Best CPM' },
                  { name: 'Crypto Meg/Mason', platform: 'Multi', impressions: '25.3K', cost: '$2,000', cpm: '$7.91', roi: '2nd Best' },
                  { name: 'Rise Up Show', platform: 'Multi', impressions: '74.5K', cost: '$6,000', cpm: '$8.05', roi: '3rd Best' },
                  { name: 'Pix', platform: 'Instagram', impressions: '16.4K', cost: '$2,500', cpm: '$15.24', roi: '4th Best' },
                  { name: 'Wale.Moca', platform: 'Twitter', impressions: '15.2K', cost: '$2,500', cpm: '$16.45', roi: '5th Best' },
                ].map((row, index) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <td className="font-medium">{row.name}</td>
                    <td>{row.platform}</td>
                    <td>{row.impressions}</td>
                    <td>{row.cost}</td>
                    <td>{row.cpm}</td>
                    <td className="text-emerald-500 font-medium">{row.roi}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </ScrollReveal>
    </div>
  );
}

