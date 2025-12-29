'use client';

import { Navbar } from '@/components/layout/navbar';
import { PageTransition } from '@/components/ui/page-transition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}

