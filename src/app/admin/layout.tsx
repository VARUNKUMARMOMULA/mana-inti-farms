'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { dbService } from '@/lib/dbService';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Eye, Menu, X, Palette, Mail, Image as ImageIcon, Share2 } from 'lucide-react';
import { HenIcon } from '@/components/ui/Icons';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const msgs = await dbService.getContactMessages();
      setUnreadCount(msgs.filter((m) => !m.is_read).length);
    } catch (e) {
      console.error('Error fetching unread message count:', e);
    }
  }, []);

  // Verify authentication on mount (extra client-side layer)
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await dbService.isAdminAuthenticated();
      if (!authenticated) {
        router.push('/admin/login');
      } else {
        setLoading(false);
        fetchUnreadCount();
      }
    };
    checkAuth();

    // Listen for custom message update events
    window.addEventListener('mif-messages-updated', fetchUnreadCount);
    return () => {
      window.removeEventListener('mif-messages-updated', fetchUnreadCount);
    };
  }, [pathname, router, fetchUnreadCount]);

  const handleLogout = async () => {
    await dbService.signOutAdmin();
    const secureFlag = window.location.protocol === 'https:' ? '; Secure; SameSite=Lax' : '';
    document.cookie = `mif_admin_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;${secureFlag}`;
    router.push('/admin/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'Dashboard & Orders', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage Products', href: '/admin/products', icon: <ShoppingBag size={18} /> },
    { name: 'Content & Branding', href: '/admin/content', icon: <Palette size={18} /> },
    { name: 'Image Management', href: '/admin/images', icon: <ImageIcon size={18} /> },
    { name: 'Social Links Settings', href: '/admin/social', icon: <Share2 size={18} /> },
    { name: 'Contact Messages', href: '/admin/messages', icon: <Mail size={18} /> },
    { name: 'Store Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-primary">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  // Do not wrap login page with the admin layout decoration
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row font-body">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-primary text-cream px-4 py-3.5 flex items-center justify-between border-b border-primary-hover/50 shadow-md">
        <Link href="/admin" className="flex items-center gap-2">
          <HenIcon size={20} className="text-cream" />
          <span className="font-display font-bold text-lg">Mana Inti Admin</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-1.5 text-cream hover:bg-primary-hover rounded-lg border border-primary-hover/30 transition-colors"
            title="View Storefront"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1 text-cream rounded hover:bg-primary-hover transition-colors"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`bg-primary text-cream w-full md:w-64 shrink-0 flex flex-col border-r border-primary-hover/50 shadow-xl transition-all duration-300 z-40 fixed md:sticky top-0 h-screen md:h-auto ${
          isMobileOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary-hover/50 flex items-center gap-3">
          <div className="bg-cream text-primary p-2 rounded-full">
            <HenIcon size={22} className="text-primary" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-lg leading-tight">Mana Inti Farms</span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 flex flex-col gap-1.5 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? 'bg-accent text-white shadow-md'
                  : 'text-cream-dark/80 hover:bg-primary-hover hover:text-cream'
              }`}
            >
              {item.icon}
              <span className="text-left flex-grow">{item.name}</span>
              {item.name === 'Contact Messages' && unreadCount > 0 && (
                <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout & View Storefront Footer */}
        <div className="p-4 border-t border-primary-hover/50 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cream-dark/80 hover:bg-primary-hover hover:text-cream transition-all"
          >
            <Eye size={18} />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-900/35 hover:text-rose-100 transition-all cursor-pointer text-left w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 md:overflow-y-auto md:h-screen">
        {children}
      </main>
      
    </div>
  );
}
