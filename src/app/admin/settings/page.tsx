'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/dbService';
import { StoreSettings } from '@/lib/types';
import { Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function AdminSettings() {
  const { refreshData } = useStore();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await dbService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (
    section: keyof StoreSettings,
    field: string,
    value: any
  ) => {
    if (!settings) return;
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'fee' || field === 'free_above' ? Number(value) : value,
      },
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      // Save each section
      await Promise.all([
        dbService.updateSetting('store_status', settings.store_status),
        dbService.updateSetting('delivery_charge', settings.delivery_charge),
        dbService.updateSetting('contact_details', settings.contact_details),
        dbService.updateSetting('business_hours', settings.business_hours),
        dbService.updateSetting('social_links', settings.social_links),
        dbService.updateSetting('seo_settings', settings.seo_settings),
      ]);
      
      setSaveSuccess(true);
      // Refresh global context data
      await refreshData();
      
      // Auto-hide success message
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-foreground/50 font-body">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white border border-cream-dark/40 rounded-3xl p-12 text-center text-foreground/50 font-body">
        <span>Failed to load settings. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-body text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Store Settings</h1>
          <p className="text-sm text-foreground/60">Configure farm operating status, delivery fees, and metadata.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
        
        {/* LEFT COLUMN: Main Configurations */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Section 1: Store Status */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5">
            <h2 className="font-display font-bold text-xl text-primary border-b border-cream-dark/20 pb-3">Farm Store Status</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('store_status', 'status', 'open')}
                className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                  settings.store_status.status === 'open'
                    ? 'border-[#25D366] bg-[#25D366]/5 text-[#1e883f]'
                    : 'border-cream-dark/80 text-foreground/70 hover:bg-cream-dark/20'
                }`}
              >
                🟢 Accepting Orders
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('store_status', 'status', 'closed')}
                className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                  settings.store_status.status === 'closed'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-cream-dark/80 text-foreground/70 hover:bg-cream-dark/20'
                }`}
              >
                🔴 Store Closed
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('store_status', 'status', 'holiday')}
                className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                  settings.store_status.status === 'holiday'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-cream-dark/80 text-foreground/70 hover:bg-cream-dark/20'
                }`}
              >
                🟡 Holiday
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status_message" className="text-xs font-bold text-foreground/70">Homepage Status Message</label>
              <input
                type="text"
                id="status_message"
                value={settings.store_status.message}
                onChange={(e) => handleInputChange('store_status', 'message', e.target.value)}
                placeholder="e.g. Accepting Orders, Closed for Maintenance, Back on Monday"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Section 2: Delivery Fees */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5">
            <h2 className="font-display font-bold text-xl text-primary border-b border-cream-dark/20 pb-3">Delivery Charges</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="delivery_fee" className="text-xs font-bold text-foreground/70">Standard Delivery Fee (INR)</label>
                <input
                  type="number"
                  id="delivery_fee"
                  min="0"
                  value={settings.delivery_charge.fee}
                  onChange={(e) => handleInputChange('delivery_charge', 'fee', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="free_above" className="text-xs font-bold text-foreground/70">Free Delivery Threshold (INR)</label>
                <input
                  type="number"
                  id="free_above"
                  min="0"
                  value={settings.delivery_charge.free_above}
                  onChange={(e) => handleInputChange('delivery_charge', 'free_above', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5">
            <h2 className="font-display font-bold text-xl text-primary border-b border-cream-dark/20 pb-3">Contact Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone_1" className="text-xs font-bold text-foreground/70">Phone Number 1 *</label>
                <input
                  type="text"
                  id="phone_1"
                  required
                  value={settings.contact_details.phone_1}
                  onChange={(e) => handleInputChange('contact_details', 'phone_1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone_2" className="text-xs font-bold text-foreground/70">Phone Number 2</label>
                <input
                  type="text"
                  id="phone_2"
                  value={settings.contact_details.phone_2}
                  onChange={(e) => handleInputChange('contact_details', 'phone_2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-foreground/70">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={settings.contact_details.email}
                  onChange={(e) => handleInputChange('contact_details', 'email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="whatsapp" className="text-xs font-bold text-foreground/70">WhatsApp Number (For Order Redirect) *</label>
                <input
                  type="text"
                  id="whatsapp"
                  required
                  value={settings.contact_details.whatsapp}
                  onChange={(e) => handleInputChange('contact_details', 'whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-xs font-bold text-foreground/70">Physical Address *</label>
              <textarea
                id="address"
                required
                value={settings.contact_details.address}
                onChange={(e) => handleInputChange('contact_details', 'address', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Business Hours & SEO */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Section 4: Business Hours */}
          <div className="bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5">
            <h2 className="font-display font-bold text-xl text-primary border-b border-cream-dark/20 pb-3">Operating Hours</h2>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="timings" className="text-xs font-bold text-foreground/70">Daily Timings</label>
              <input
                type="text"
                id="timings"
                value={settings.business_hours.timings}
                onChange={(e) => handleInputChange('business_hours', 'timings', e.target.value)}
                placeholder="e.g. 6:00 AM - 9:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="days" className="text-xs font-bold text-foreground/70">Operating Days</label>
              <input
                type="text"
                id="days"
                value={settings.business_hours.days}
                onChange={(e) => handleInputChange('business_hours', 'days', e.target.value)}
                placeholder="e.g. Monday - Sunday"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Section 5: SEO Settings */}
          <div className="bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5">
            <h2 className="font-display font-bold text-xl text-primary border-b border-cream-dark/20 pb-3">SEO & Metadata</h2>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="seo_title" className="text-xs font-bold text-foreground/70">Homepage Title Tag</label>
              <input
                type="text"
                id="seo_title"
                value={settings.seo_settings.title}
                onChange={(e) => handleInputChange('seo_settings', 'title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="seo_description" className="text-xs font-bold text-foreground/70">Meta Description</label>
              <textarea
                id="seo_description"
                value={settings.seo_settings.description}
                onChange={(e) => handleInputChange('seo_settings', 'description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none text-xs leading-normal"
              />
            </div>
          </div>

          {/* Save Button Widget */}
          <div className="bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-primary-hover text-cream py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
            
            {saveSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-[#1e883f] text-xs font-bold animate-fade-in">
                <CheckCircle2 size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}
          </div>

        </div>

      </form>

    </div>
  );
}
