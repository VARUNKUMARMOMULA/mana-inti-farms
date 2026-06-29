'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/dbService';
import { ContactMessage } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Mail, Search, Trash2, Star, Eye, Filter, Reply, Check, Clock, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'important'>('all');

  const fetchMessages = async (selectFirst = false) => {
    try {
      setLoading(true);
      const data = await dbService.getContactMessages();
      setMessages(data);
      
      // If we need to keep a message selected, update it with fresh data
      if (selectedMessage) {
        const updated = data.find(m => m.id === selectedMessage.id);
        if (updated) setSelectedMessage(updated);
      } else if (selectFirst && data.length > 0) {
        // Select the first message by default on desktop if none selected
        setSelectedMessage(data[0]);
        if (!data[0].is_read) {
          handleMarkRead(data[0].id, true);
        }
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
  }, []);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      // Mark as read automatically when clicked
      try {
        await dbService.updateContactMessageStatus(msg.id, { is_read: true });
        // Update local state to reflect read immediately
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
        // Trigger global custom event so the layout sidebar badge updates in real-time!
        window.dispatchEvent(new Event('mif-messages-updated'));
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await dbService.updateContactMessageStatus(id, { is_read: isRead });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m));
      window.dispatchEvent(new Event('mif-messages-updated'));
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  const handleToggleImportant = async (msg: ContactMessage) => {
    try {
      const newImportant = !msg.is_important;
      await dbService.updateContactMessageStatus(msg.id, { is_important: newImportant });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_important: newImportant } : m));
    } catch (err) {
      console.error('Error toggling importance:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await dbService.deleteContactMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      setMessages(prev => prev.filter(m => m.id !== id));
      window.dispatchEvent(new Event('mif-messages-updated'));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Filter & Search Logic
  const filteredMessages = messages.filter((msg) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unread' && !msg.is_read) ||
      (statusFilter === 'read' && msg.is_read) ||
      (statusFilter === 'important' && msg.is_important);

    const matchesSearch =
      msg.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.customer_phone.includes(searchQuery) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.customer_message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 font-body h-[calc(100vh-140px)] text-left">
      
      {/* 1. Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Contact Messages</h1>
          <p className="text-sm text-foreground/60">
            Read and reply to customer inquiries submitted through the contact form.
          </p>
        </div>
        
        <button
          onClick={() => fetchMessages(false)}
          className="p-2 border border-cream-dark hover:bg-cream-dark/35 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold text-primary bg-white"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Main Content Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden items-stretch">
        
        {/* LEFT COLUMN: Message List (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-hidden bg-white border border-cream-dark/40 rounded-3xl p-5 shadow-sm">
          {/* Search & Filter Header */}
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sender, phone, message..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/25 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-cream/25 p-1 rounded-xl border border-cream-dark/20 overflow-x-auto">
              <FilterTab active={statusFilter === 'all'} label="All" count={messages.length} onClick={() => setStatusFilter('all')} />
              <FilterTab active={statusFilter === 'unread'} label="Unread" count={messages.filter(m => !m.is_read).length} onClick={() => setStatusFilter('unread')} />
              <FilterTab active={statusFilter === 'read'} label="Read" count={messages.filter(m => m.is_read).length} onClick={() => setStatusFilter('read')} />
              <FilterTab active={statusFilter === 'important'} label="Starred" count={messages.filter(m => m.is_important).length} onClick={() => setStatusFilter('important')} />
            </div>
          </div>

          {/* List area */}
          <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-none">
            {loading && messages.length === 0 ? (
              <div className="p-8 text-center text-foreground/40">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs">Loading messages...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-foreground/40 text-xs italic">
                No messages found matching this filter.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                    selectedMessage?.id === msg.id
                      ? 'bg-primary/5 border-primary/40 shadow-sm'
                      : 'bg-white border-cream-dark hover:bg-cream/15'
                  } ${!msg.is_read ? 'font-bold border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-primary truncate max-w-[150px]">{msg.customer_name}</span>
                    <span className="text-[9px] text-foreground/40 font-semibold whitespace-nowrap">{formatDate(msg.created_at)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-foreground/80 truncate pr-4">{msg.subject}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {msg.is_important && <Star size={13} fill="#ff6f00" className="text-accent" />}
                      {!msg.is_read && <span className="h-2 w-2 rounded-full bg-accent" />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Message Viewer (lg:col-span-7) */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col bg-white border border-cream-dark/40 rounded-3xl shadow-sm overflow-hidden"
              >
                {/* Header Actions */}
                <div className="px-6 py-4 border-b border-cream-dark/25 flex items-center justify-between bg-cream/15">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleImportant(selectedMessage)}
                      className="p-2 hover:bg-cream-dark/30 rounded-lg text-foreground/50 transition-colors"
                      title={selectedMessage.is_important ? "Unstar" : "Star message"}
                    >
                      <Star size={16} fill={selectedMessage.is_important ? "#ff6f00" : "none"} className={selectedMessage.is_important ? "text-accent" : ""} />
                    </button>
                    
                    <button
                      onClick={() => handleMarkRead(selectedMessage.id, !selectedMessage.is_read)}
                      className="px-3 py-1.5 border border-cream-dark hover:bg-cream-dark/30 text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      title={selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                    >
                      <Check size={12} />
                      <span>{selectedMessage.is_read ? "Mark Unread" : "Mark Read"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.customer_email}?subject=Re: ${selectedMessage.subject} - Mana Inti Farms`}
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-cream text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Reply size={12} />
                      <span>Reply by Email</span>
                    </a>

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Message Body Sheet */}
                <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
                  {/* Sender Card */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 bg-cream/10 border border-cream-dark/30 rounded-2xl">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Sender Info</span>
                      <span className="font-bold text-primary text-base">{selectedMessage.customer_name}</span>
                      <a href={`mailto:${selectedMessage.customer_email}`} className="text-xs text-accent font-medium hover:underline">{selectedMessage.customer_email}</a>
                      <a href={`tel:+91${selectedMessage.customer_phone}`} className="text-xs text-foreground/60 font-medium hover:underline">+91 {selectedMessage.customer_phone}</a>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-foreground/50 shrink-0">
                      <Clock size={14} />
                      <span>{formatDate(selectedMessage.created_at)}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="text-left flex flex-col gap-1">
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Subject</span>
                    <h2 className="font-display font-bold text-xl text-primary leading-snug">{selectedMessage.subject}</h2>
                  </div>

                  {/* Message Content */}
                  <div className="text-left flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Message Content</span>
                    <div className="p-5 bg-white border border-cream-dark/50 rounded-2xl leading-relaxed text-sm text-foreground/80 whitespace-pre-wrap flex-grow shadow-inner">
                      {selectedMessage.customer_message}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white border border-cream-dark/40 rounded-3xl shadow-sm text-foreground/40">
                <Mail size={32} className="text-primary/20 mb-2" />
                <span className="text-xs">Select an inquiry from the list to view details.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

// Sub-component for Filter Tabs
interface FilterTabProps {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}
function FilterTab({ active, label, count, onClick }: FilterTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
        active
          ? 'bg-white text-primary shadow-sm'
          : 'text-foreground/55 hover:bg-cream-dark/20'
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
          active ? 'bg-primary text-cream' : 'bg-cream-dark text-foreground/60'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
