'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { dbService } from '@/lib/dbService';
import { SocialLink } from '@/lib/types';
import { Share2, CheckCircle2, Globe, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';

// Custom SVG Brand Icons since they are not exported in this version of lucide-react
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const dynamic = 'force-dynamic';

export default function AdminSocialSettings() {
  const { socialLinks, refreshData } = useStore();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form input states
  const [inputUrls, setInputUrls] = useState<Record<string, string>>({});
  const [enabledStates, setEnabledStates] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (socialLinks) {
      setLinks(socialLinks);
      const urls: Record<string, string> = {};
      const enabled: Record<string, boolean> = {};
      
      socialLinks.forEach((link) => {
        if (link.icon_name.toLowerCase() === 'whatsapp') {
          // Extract phone number from https://wa.me/number
          const phone = link.url.replace('https://wa.me/', '').split('?')[0] || '';
          urls[link.id] = phone;
        } else {
          urls[link.id] = link.url;
        }
        enabled[link.id] = link.enabled;
      });
      
      setInputUrls(urls);
      setEnabledStates(enabled);
      setLoading(false);
    }
  }, [socialLinks]);

  // URL Validation Helpers
  const validateUrl = (platform: string, val: string): string => {
    if (!val) return '';

    const lowerPlatform = platform.toLowerCase();
    
    if (lowerPlatform === 'whatsapp') {
      // Validate phone number (only digits, 10-15 chars)
      const digits = val.replace(/[^0-9]/g, '');
      if (digits.length < 10 || digits.length > 15) {
        return 'Please enter a valid phone number with country code (e.g., 917981544848).';
      }
      return '';
    }

    try {
      const url = new URL(val);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }

      if (lowerPlatform.includes('facebook') && !url.hostname.includes('facebook.com')) {
        return 'Must be a valid facebook.com link.';
      }
      if (lowerPlatform.includes('instagram') && !url.hostname.includes('instagram.com')) {
        return 'Must be a valid instagram.com link.';
      }
      if (lowerPlatform.includes('youtube') && !url.hostname.includes('youtube.com')) {
        return 'Must be a valid youtube.com link.';
      }
      if ((lowerPlatform.includes('twitter') || lowerPlatform.includes('x')) && 
          !url.hostname.includes('twitter.com') && !url.hostname.includes('x.com')) {
        return 'Must be a valid x.com or twitter.com link.';
      }
      if (lowerPlatform.includes('linkedin') && !url.hostname.includes('linkedin.com')) {
        return 'Must be a valid linkedin.com link.';
      }
      if (lowerPlatform.includes('telegram') && !url.hostname.includes('t.me') && !url.hostname.includes('telegram.me')) {
        return 'Must be a valid t.me or telegram.me link.';
      }
    } catch (e) {
      return 'Please enter a valid absolute URL (starting with https://).';
    }

    return '';
  };

  const handleUrlChange = (id: string, platform: string, val: string) => {
    setInputUrls((prev) => ({ ...prev, [id]: val }));
    const err = validateUrl(platform, val);
    setValidationErrors((prev) => ({ ...prev, [id]: err }));
  };

  const handleToggleEnable = (id: string) => {
    setEnabledStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReset = (link: SocialLink) => {
    if (link.icon_name.toLowerCase() === 'whatsapp') {
      const phone = link.url.replace('https://wa.me/', '').split('?')[0] || '';
      setInputUrls((prev) => ({ ...prev, [link.id]: phone }));
    } else {
      setInputUrls((prev) => ({ ...prev, [link.id]: link.url }));
    }
    setEnabledStates((prev) => ({ ...prev, [link.id]: link.enabled }));
    setValidationErrors((prev) => ({ ...prev, [link.id]: '' }));
  };

  const handleSaveLink = async (link: SocialLink) => {
    const rawVal = inputUrls[link.id] || '';
    const enabled = enabledStates[link.id] ?? false;

    // Validate first
    const err = validateUrl(link.platform, rawVal);
    if (err) {
      setValidationErrors((prev) => ({ ...prev, [link.id]: err }));
      return;
    }

    setSavingId(link.id);
    try {
      let finalUrl = rawVal;
      if (link.icon_name.toLowerCase() === 'whatsapp' && rawVal) {
        const cleanPhone = rawVal.replace(/[^0-9]/g, '');
        finalUrl = `https://wa.me/${cleanPhone}`;
      }

      await dbService.updateSocialLink(link.id, {
        url: finalUrl,
        enabled,
      });

      await refreshData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save social link:', err);
      alert('Failed to save settings.');
    } finally {
      setSavingId(null);
    }
  };

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook': return <FacebookIcon className="text-[#1877F2]" />;
      case 'instagram': return <InstagramIcon className="text-[#E1306C]" />;
      case 'youtube': return <YoutubeIcon className="text-[#FF0000]" fill="currentColor" />;
      case 'twitter': return <TwitterIcon className="text-[#1DA1F2]" />;
      case 'linkedin': return <LinkedinIcon className="text-[#0077B5]" />;
      case 'telegram': return <TelegramIcon className="text-[#229ED9]" />;
      case 'whatsapp': return <WhatsappIcon className="text-[#25D366]" fill="currentColor" />;
      default: return <Globe size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-foreground/50 font-body">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Social Media Settings...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-body text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">📱 Social Media Settings</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Configure your farm's official social media profiles. Disabled platforms are automatically hidden from the storefront.
          </p>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
          <span>Social links updated successfully! Storefront has been updated in real-time.</span>
        </div>
      )}

      {/* Grid of Social Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => {
          const isSaving = savingId === link.id;
          const currentUrl = inputUrls[link.id] || '';
          const isEnabled = enabledStates[link.id] ?? false;
          const error = validationErrors[link.id];
          const isWhatsApp = link.icon_name.toLowerCase() === 'whatsapp';

          // Generate live preview URL
          let previewUrl = currentUrl;
          if (isWhatsApp && currentUrl) {
            previewUrl = `https://wa.me/${currentUrl.replace(/[^0-9]/g, '')}`;
          }

          // Check if modified compared to store context
          const originalPhone = isWhatsApp ? link.url.replace('https://wa.me/', '').split('?')[0] : link.url;
          const isModified = originalPhone !== currentUrl || link.enabled !== isEnabled;

          return (
            <div
              key={link.id}
              className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col gap-4 hover:shadow-md transition-all relative ${
                isEnabled ? 'border-cream-dark/60' : 'border-dashed border-cream-dark/80 opacity-75'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-cream/30 rounded-2xl border border-cream-dark/40">
                    {getIcon(link.icon_name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-primary">{link.platform}</span>
                    <span className="text-[9px] text-foreground/40 font-mono">
                      {isWhatsApp ? 'Phone Number' : 'Web Link'}
                    </span>
                  </div>
                </div>

                {/* Enable / Disable Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleEnable(link.id)}
                  className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
                    isEnabled ? 'bg-[#25d366]' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                      isEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Input Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">
                  {isWhatsApp ? 'WhatsApp Number' : 'Profile URL'}
                </label>
                <input
                  type="text"
                  value={currentUrl}
                  onChange={(e) => handleUrlChange(link.id, link.platform, e.target.value)}
                  placeholder={isWhatsApp ? 'e.g. 917981544848' : `https://${link.platform.toLowerCase().replace(/[^a-z]/g, '')}.com/username`}
                  className={`w-full px-3 py-2 rounded-xl border bg-cream/5 text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
                    error ? 'border-red-300 focus:ring-red-300' : 'border-cream-dark'
                  }`}
                />
                {isWhatsApp && (
                  <span className="text-[9px] text-foreground/40 leading-normal">
                    Enter country code + phone number (no spaces or + symbol).
                  </span>
                )}
                {error && (
                  <span className="text-[9px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                    <AlertTriangle size={10} />
                    <span>{error}</span>
                  </span>
                )}
              </div>

              {/* Action buttons inside Card */}
              <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-cream-dark/10">
                {/* Preview Button */}
                {isEnabled && previewUrl ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-cream-dark hover:bg-cream-dark/20 text-primary text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Preview</span>
                  </a>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1.5">
                  {/* Reset Button */}
                  {isModified && (
                    <button
                      type="button"
                      onClick={() => handleReset(link)}
                      className="px-2.5 py-1.5 text-foreground/50 hover:bg-gray-50 text-[10px] rounded-lg cursor-pointer"
                    >
                      Reset
                    </button>
                  )}

                  {/* Save Button */}
                  <button
                    type="button"
                    disabled={isSaving || !isModified || !!error}
                    onClick={() => handleSaveLink(link)}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-cream text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isSaving ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
