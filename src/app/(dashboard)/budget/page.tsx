'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ScrollReveal, AnimatedCounter } from '@/components/ui/scroll-reveal';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Filter,
  MoreHorizontal,
  CreditCard,
  Wallet,
} from 'lucide-react';

// Demo data
const invoices = [
  { id: '1', kol: 'Crypto Wendy', amount: 15000, status: 'paid', period: '1 Month', dueDate: '2025-12-01', paidDate: '2025-11-28' },
  { id: '2', kol: 'Joshua Jake', amount: 22500, status: 'paid', period: '3 Months', dueDate: '2025-11-15', paidDate: '2025-11-14' },
  { id: '3', kol: 'Rise Up Morning Show', amount: 18000, status: 'invoiced', period: '3 Months', dueDate: '2025-12-15', paidDate: null },
  { id: '4', kol: 'Coach Ty', amount: 10000, status: 'not_paid', period: '1 Month', dueDate: '2025-11-20', paidDate: null },
  { id: '5', kol: 'Jolly Green Investor', amount: 12000, status: 'paid', period: '1 Month', dueDate: '2025-11-10', paidDate: '2025-11-09' },
  { id: '6', kol: 'When Shift Happens', amount: 20000, status: 'pending', period: 'One-time', dueDate: '2025-12-25', paidDate: null },
  { id: '7', kol: 'Bodogoos', amount: 10000, status: 'invoiced', period: '1 Month', dueDate: '2025-12-20', paidDate: null },
  { id: '8', kol: 'Wale.Moca', amount: 2500, status: 'paid', period: '1 Month', dueDate: '2025-11-30', paidDate: '2025-11-28' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'paid':
      return { color: 'bg-emerald-500/15 text-emerald-500', icon: CheckCircle, label: 'Paid' };
    case 'invoiced':
      return { color: 'bg-indigo-500/15 text-indigo-400', icon: FileText, label: 'Invoiced' };
    case 'not_paid':
      return { color: 'bg-red-500/15 text-red-500', icon: AlertCircle, label: 'Not Paid' };
    case 'pending':
      return { color: 'bg-amber-500/15 text-amber-500', icon: Clock, label: 'Pending' };
    default:
      return { color: 'bg-zinc-500/15 text-zinc-500', icon: FileText, label: status };
  }
};

export default function BudgetPage() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'invoiced' | 'not_paid'>('all');

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const totalBudget = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'not_paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget & Invoices</h1>
            <p className="text-zinc-400 mt-1">
              Track spending and manage influencer payments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} glow>
              New Invoice
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: totalBudget, icon: Wallet, color: 'text-indigo-400' },
          { label: 'Total Paid', value: totalPaid, icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'text-amber-500' },
          { label: 'Overdue', value: overdueAmount, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">
                  $<AnimatedCounter value={stat.value} />
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <ScrollReveal delay={0.1}>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All', count: invoices.length },
            { key: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
            { key: 'invoiced', label: 'Invoiced', count: invoices.filter(i => i.status === 'invoiced').length },
            { key: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending').length },
            { key: 'not_paid', label: 'Overdue', count: invoices.filter(i => i.status === 'not_paid').length },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                filter === tab.key ? 'bg-white/20' : 'bg-zinc-500/20'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* Invoice list */}
      <ScrollReveal delay={0.15}>
        <AnimatedCard variant="glass" hover={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Influencer</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const statusConfig = getStatusConfig(invoice.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group"
                    >
                      <td className="font-medium">{invoice.kol}</td>
                      <td className="font-semibold">{formatCurrency(invoice.amount)}</td>
                      <td>
                        <Badge variant="default" size="sm">{invoice.period}</Badge>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="text-zinc-400">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="text-zinc-400">
                        {invoice.paidDate ? formatDate(invoice.paidDate) : '—'}
                      </td>
                      <td>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Quick actions */}
      <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedCard variant="subtle" className="flex items-center gap-4 cursor-pointer">
            <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-medium">Process Payments</h4>
              <p className="text-sm text-zinc-500">Mark invoices as paid</p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="subtle" className="flex items-center gap-4 cursor-pointer">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-medium">Generate Report</h4>
              <p className="text-sm text-zinc-500">Export spending summary</p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="subtle" className="flex items-center gap-4 cursor-pointer">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-500">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-medium">Set Budget Limits</h4>
              <p className="text-sm text-zinc-500">Configure spending alerts</p>
            </div>
          </AnimatedCard>
        </div>
      </ScrollReveal>
    </div>
  );
}

