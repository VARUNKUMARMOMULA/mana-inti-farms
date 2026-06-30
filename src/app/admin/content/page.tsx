'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { dbService, DEFAULT_HOMEPAGE_CONTENT } from '@/lib/dbService';
import { HomepageContent } from '@/lib/types';
import { Save, RefreshCw, Upload, Trash2, RotateCcw, Layout, Palette, Type, Sliders, Globe, Eye, Smartphone, Monitor, CheckCircle2, AlertTriangle, Image as ImageIcon, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

type EditorTab = 'branding' | 'hero' | 'colors' | 'fonts' | 'appearance' | 'images';

export default function AdminContent() {
  const { homepageContent, refreshData, updateHomepageContent } = useStore();
  
  // Published state (from DB)
  const [publishedContent, setPublishedContent] = useState<HomepageContent | null>(null);
  
  // Working draft state (local edits)
  const [draftContent, setDraftContent] = useState<HomepageContent | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  // Editor UI States
  const [activeTab, setActiveTab] = useState<EditorTab>('branding');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Image Management Sub-Category Toggles
  const [activeImageCategory, setActiveImageCategory] = useState<'branding' | 'homepage' | 'sections' | 'system'>('branding');

  useEffect(() => {
    if (homepageContent) {
      setPublishedContent(homepageContent);
      if (!draftContent) {
        setDraftContent(JSON.parse(JSON.stringify(homepageContent)));
      }
      setLoading(false);
    }
  }, [homepageContent]);

  // Check for unsaved changes
  useEffect(() => {
    if (publishedContent && draftContent) {
      const isDifferent = JSON.stringify(publishedContent) !== JSON.stringify(draftContent);
      setHasChanges(isDifferent);
    }
  }, [publishedContent, draftContent]);

  const handleTextChange = (field: keyof HomepageContent, value: any) => {
    if (!draftContent) return;
    setDraftContent((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedChange = (category: 'colors' | 'typography' | 'sections' | 'seo' | 'layout', field: string, value: any) => {
    if (!draftContent) return;
    setDraftContent((prev) => {
      if (!prev) return null;
      const categoryData = (prev[category] as any) || {};
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [field]: value,
        },
      };
    });
  };

  // Client-side image compression
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85
          );
        };
      };
    });
  };

  const handleImageUpload = async (field: keyof HomepageContent, file: File) => {
    if (!draftContent) return;
    setUploadingField(field as string);
    try {
      const compressedFile = await compressImage(file);
      const fileName = `${String(field)}_${Date.now()}.jpg`;
      const url = await dbService.uploadImage(compressedFile, 'mif-assets', fileName);
      const urlWithCacheBuster = `${url}?t=${Date.now()}`;

      setDraftContent((prev) => prev ? { ...prev, [field]: urlWithCacheBuster } : null);
    } catch (e: any) {
      console.error('Image upload failed:', e);
      alert('Failed to upload image: ' + (e.message || JSON.stringify(e)));
    } finally {
      setUploadingField(null);
    }
  };

  const handleRemoveImage = (field: keyof HomepageContent) => {
    if (!draftContent) return;
    const defaultUrl = DEFAULT_HOMEPAGE_CONTENT[field] as string || '';
    setDraftContent((prev) => prev ? { ...prev, [field]: defaultUrl } : null);
  };

  const handlePublish = async () => {
    if (!draftContent) return;
    setSaving(true);
    try {
      await updateHomepageContent(draftContent);
      setPublishedContent(JSON.parse(JSON.stringify(draftContent)));
      setPublishSuccess(true);
      await refreshData();
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (e) {
      console.error('Error publishing content:', e);
      alert('Failed to publish content.');
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    if (!publishedContent) return;
    if (window.confirm('Discard all unsaved draft changes?')) {
      setDraftContent(JSON.parse(JSON.stringify(publishedContent)));
    }
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('Reset all branding, colors, typography, and copy to original farm defaults?')) return;
    setDraftContent(JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONTENT)));
  };

  const getMockRadiusClass = () => {
    const radius = draftContent?.layout?.border_radius || '2xl';
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      case '3xl': return 'rounded-[24px]';
      default: return 'rounded-2xl';
    }
  };

  if (loading || !draftContent) {
    return (
      <div className="p-12 text-center text-foreground/50 font-body">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Website CMS...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-body text-left h-full">
      {/* 1. Editor Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm no-print">
        <div className="text-left">
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Website Live CMS</h1>
          <p className="text-sm text-foreground/60">
            Customize branding, colors, typography, and layout settings. Preview in real-time.
          </p>
        </div>
        
        {/* Save & Publish Actions */}
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              type="button"
              onClick={handleUndo}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={14} />
              <span>Discard Draft</span>
            </button>
          )}
          
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || uploadingField !== null}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-cream text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>Publish Live Changes</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold no-print">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span>You have unpublished draft changes. The live website will not update until you click <strong>Publish Live Changes</strong>.</span>
          </span>
          <button
            onClick={handlePublish}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold"
          >
            Publish Now
          </button>
        </div>
      )}

      {publishSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold no-print">
          <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
          <span>Website published successfully! All changes are live in real-time.</span>
        </div>
      )}

      {/* 2. Main Work Area (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Editor Form (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 no-print">
          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-cream-dark/40 shadow-sm flex overflow-x-auto gap-1">
            <TabButton active={activeTab === 'branding'} icon={<Globe size={15} />} label="Branding" onClick={() => setActiveTab('branding')} />
            <TabButton active={activeTab === 'hero'} icon={<Layout size={15} />} label="Copy" onClick={() => setActiveTab('hero')} />
            <TabButton active={activeTab === 'colors'} icon={<Palette size={15} />} label="Colors" onClick={() => setActiveTab('colors')} />
            <TabButton active={activeTab === 'fonts'} icon={<Type size={15} />} label="Fonts" onClick={() => setActiveTab('fonts')} />
            <TabButton active={activeTab === 'appearance'} icon={<Sliders size={15} />} label="Appearance" onClick={() => setActiveTab('appearance')} />
            <TabButton active={activeTab === 'images'} icon={<ImageIcon size={15} />} label="Images" onClick={() => setActiveTab('images')} />
          </div>

          {/* Tab Contents */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-5 min-h-[480px]">
            
            {/* TAB: Branding & SEO */}
            {activeTab === 'branding' && (
              <>
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Branding & SEO</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Website Name</label>
                  <input
                    type="text"
                    value={draftContent.website_name || ''}
                    onChange={(e) => handleTextChange('website_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Branding Tagline</label>
                  <input
                    type="text"
                    value={draftContent.tagline || ''}
                    onChange={(e) => handleTextChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground/80"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">SEO Meta Title</label>
                  <input
                    type="text"
                    value={draftContent.seo?.meta_title || ''}
                    onChange={(e) => handleNestedChange('seo', 'meta_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">SEO Meta Description</label>
                  <textarea
                    rows={3}
                    value={draftContent.seo?.meta_description || ''}
                    onChange={(e) => handleNestedChange('seo', 'meta_description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-xs leading-normal"
                  />
                </div>
              </>
            )}

            {/* TAB: Hero & About Copy */}
            {activeTab === 'hero' && (
              <>
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Copywriter</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Hero Heading Title</label>
                  <textarea
                    rows={2}
                    value={draftContent.hero_title}
                    onChange={(e) => handleTextChange('hero_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-display font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={draftContent.hero_subtitle}
                    onChange={(e) => handleTextChange('hero_subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-xs focus:outline-none focus:ring-1 focus:ring-primary leading-normal text-foreground/80"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground/70">Hero Button Text</label>
                    <input
                      type="text"
                      value={draftContent.hero_button_text || ''}
                      onChange={(e) => handleTextChange('hero_button_text', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground/70">Hero Button URL</label>
                    <input
                      type="text"
                      value={draftContent.hero_button_url || ''}
                      onChange={(e) => handleTextChange('hero_button_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Hero CTA / Bottom Banner Text</label>
                  <input
                    type="text"
                    value={draftContent.hero_cta_text || ''}
                    onChange={(e) => handleTextChange('hero_cta_text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Promo Banner Text</label>
                  <input
                    type="text"
                    value={draftContent.promo_banner_text}
                    onChange={(e) => handleTextChange('promo_banner_text', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Seasonal Badge Text</label>
                  <input
                    type="text"
                    value={draftContent.seasonal_offer}
                    onChange={(e) => handleTextChange('seasonal_offer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold text-accent"
                  />
                </div>
              </>
            )}

            {/* TAB: Theme Colors */}
            {activeTab === 'colors' && (
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Theme Colors</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary (Forest Green)"
                    value={draftContent.colors?.primary || '#1e3f20'}
                    onChange={(val) => handleNestedChange('colors', 'primary', val)}
                  />
                  <ColorPicker
                    label="Primary Hover"
                    value={draftContent.colors?.primary_hover || '#2d5a27'}
                    onChange={(val) => handleNestedChange('colors', 'primary_hover', val)}
                  />
                  <ColorPicker
                    label="Secondary (Earthy Brown)"
                    value={draftContent.colors?.secondary || '#5c3d2e'}
                    onChange={(val) => handleNestedChange('colors', 'secondary', val)}
                  />
                  <ColorPicker
                    label="Accent (Warm Orange)"
                    value={draftContent.colors?.accent || '#ff6f00'}
                    onChange={(val) => handleNestedChange('colors', 'accent', val)}
                  />
                  <ColorPicker
                    label="Background Color"
                    value={draftContent.colors?.background || '#fdfbf7'}
                    onChange={(val) => handleNestedChange('colors', 'background', val)}
                  />
                  <ColorPicker
                    label="Card Background"
                    value={draftContent.colors?.card_bg || '#ffffff'}
                    onChange={(val) => handleNestedChange('colors', 'card_bg', val)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={draftContent.colors?.text_color || '#2d2b28'}
                    onChange={(val) => handleNestedChange('colors', 'text_color', val)}
                  />
                  <ColorPicker
                    label="Border Color"
                    value={draftContent.colors?.border_color || '#f5ebd6'}
                    onChange={(val) => handleNestedChange('colors', 'border_color', val)}
                  />
                  <ColorPicker
                    label="Navbar Background"
                    value={draftContent.colors?.navbar_bg || '#ffffff'}
                    onChange={(val) => handleNestedChange('colors', 'navbar_bg', val)}
                  />
                  <ColorPicker
                    label="Footer Background"
                    value={draftContent.colors?.footer_bg || '#1e3f20'}
                    onChange={(val) => handleNestedChange('colors', 'footer_bg', val)}
                  />
                  <ColorPicker
                    label="Badge / Link Color"
                    value={draftContent.colors?.link_color || '#ff6f00'}
                    onChange={(val) => handleNestedChange('colors', 'link_color', val)}
                  />
                  <ColorPicker
                    label="Success (Green)"
                    value={draftContent.colors?.success || '#25d366'}
                    onChange={(val) => handleNestedChange('colors', 'success', val)}
                  />
                  <ColorPicker
                    label="Warning (Amber)"
                    value={draftContent.colors?.warning || '#ffb300'}
                    onChange={(val) => handleNestedChange('colors', 'warning', val)}
                  />
                  <ColorPicker
                    label="Error (Red)"
                    value={draftContent.colors?.error || '#d32f2f'}
                    onChange={(val) => handleNestedChange('colors', 'error', val)}
                  />
                </div>
              </div>
            )}

            {/* TAB: Typography */}
            {activeTab === 'fonts' && (
              <>
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Typography & Fonts</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Heading Font Family</label>
                  <select
                    value={draftContent.typography?.heading_font || 'Cormorant Garamond'}
                    onChange={(e) => handleNestedChange('typography', 'heading_font', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Serif - Elegant)</option>
                    <option value="Playfair Display">Playfair Display (Serif - Premium)</option>
                    <option value="Lora">Lora (Serif - Clean)</option>
                    <option value="Cinzel">Cinzel (Serif - Classic)</option>
                    <option value="Inter">Inter (Sans - Modern)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground/70">Body Font Family</label>
                  <select
                    value={draftContent.typography?.body_font || 'Poppins'}
                    onChange={(e) => handleNestedChange('typography', 'body_font', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Poppins">Poppins (Sans - Soft)</option>
                    <option value="Inter">Inter (Sans - Clean & Minimal)</option>
                    <option value="Roboto">Roboto (Sans - Technical)</option>
                    <option value="Open Sans">Open Sans (Sans - Readable)</option>
                    <option value="Lato">Lato (Sans - Neutral)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground/70">Base Font Size</label>
                    <select
                      value={draftContent.typography?.base_font_size || '16px'}
                      onChange={(e) => handleNestedChange('typography', 'base_font_size', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="14px">Small (14px)</option>
                      <option value="15px">Medium-Small (15px)</option>
                      <option value="16px">Normal (16px)</option>
                      <option value="17px">Medium-Large (17px)</option>
                      <option value="18px">Large (18px)</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground/70">Base Font Weight</label>
                    <select
                      value={draftContent.typography?.base_font_weight || 'normal'}
                      onChange={(e) => handleNestedChange('typography', 'base_font_weight', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="light">Light (300)</option>
                      <option value="normal">Normal (400)</option>
                      <option value="medium">Medium (500)</option>
                      <option value="bold">Bold (700)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* TAB: Appearance (Layout & Section Toggles) */}
            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-5 max-h-[500px] overflow-y-auto pr-2">
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Website Appearance</h3>
                
                {/* Layout Settings Group */}
                <div className="flex flex-col gap-3.5 border-b border-cream-dark pb-5">
                  <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Layout & Card Styles</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-foreground/70">Border Radius (Roundness)</label>
                      <select
                        value={draftContent.layout?.border_radius || '2xl'}
                        onChange={(e) => handleNestedChange('layout', 'border_radius', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="none">None (0px)</option>
                        <option value="sm">Small (4px)</option>
                        <option value="md">Medium (8px)</option>
                        <option value="lg">Large (12px)</option>
                        <option value="xl">Extra Large (16px)</option>
                        <option value="2xl">Double XL (24px)</option>
                        <option value="3xl">Triple XL (32px)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-foreground/70">Card Theme Style</label>
                      <select
                        value={draftContent.layout?.card_style || 'glass'}
                        onChange={(e) => handleNestedChange('layout', 'card_style', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="minimal">Minimal (Thin Border)</option>
                        <option value="flat">Flat Plain (Clean)</option>
                        <option value="glass">Glassmorphic (Premium)</option>
                        <option value="shadow">Shadowed (Modern)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Visibility Group */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Section Visibility Toggles</h4>
                  <SectionToggle
                    label="Hero Section"
                    checked={draftContent.sections?.hero !== false}
                    onChange={(val) => handleNestedChange('sections', 'hero', val)}
                  />
                  <SectionToggle
                    label="Why Choose Us"
                    checked={draftContent.sections?.why_choose_us !== false}
                    onChange={(val) => handleNestedChange('sections', 'why_choose_us', val)}
                  />
                  <SectionToggle
                    label="Products Grid"
                    checked={draftContent.sections?.products !== false}
                    onChange={(val) => handleNestedChange('sections', 'products', val)}
                  />
                  <SectionToggle
                    label="Customer Reviews"
                    checked={draftContent.sections?.reviews !== false}
                    onChange={(val) => handleNestedChange('sections', 'reviews', val)}
                  />
                  <SectionToggle
                    label="About Us / CTA Section"
                    checked={draftContent.sections?.about !== false}
                    onChange={(val) => handleNestedChange('sections', 'about', val)}
                  />
                </div>
              </div>
            )}

            {/* TAB: Image Management (Categorized Slots) */}
            {activeTab === 'images' && (
              <div className="flex flex-col gap-5 max-h-[500px] overflow-y-auto pr-2">
                <h3 className="font-display font-bold text-lg text-primary border-b border-cream-dark pb-2">Image Management</h3>
                
                {/* Image Categories Navigation */}
                <div className="flex gap-1.5 border-b border-cream-dark pb-3 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveImageCategory('branding')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeImageCategory === 'branding' ? 'bg-primary text-cream' : 'bg-cream/40 text-primary/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    Branding & Logos
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageCategory('homepage')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeImageCategory === 'homepage' ? 'bg-primary text-cream' : 'bg-cream/40 text-primary/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    Homepage
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageCategory('sections')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeImageCategory === 'sections' ? 'bg-primary text-cream' : 'bg-cream/40 text-primary/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    Sections
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageCategory('system')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeImageCategory === 'system' ? 'bg-primary text-cream' : 'bg-cream/40 text-primary/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    Error Pages
                  </button>
                </div>

                {/* CATEGORY: Branding */}
                {activeImageCategory === 'branding' && (
                  <div className="flex flex-col gap-5 animate-fade-in">
                    <ImageUploadSlot
                      title="Main Website Logo"
                      field="logo_url"
                      currentUrl={draftContent.logo_url}
                      uploading={uploadingField === 'logo_url'}
                      onUpload={(file) => handleImageUpload('logo_url', file)}
                      onRemove={() => handleRemoveImage('logo_url')}
                      aspectRatio="aspect-square max-w-[80px] rounded-full mx-auto"
                    />
                    <ImageUploadSlot
                      title="Navbar Logo (Desktop)"
                      field="navbar_logo_url"
                      currentUrl={draftContent.navbar_logo_url}
                      uploading={uploadingField === 'navbar_logo_url'}
                      onUpload={(file) => handleImageUpload('navbar_logo_url', file)}
                      onRemove={() => handleRemoveImage('navbar_logo_url')}
                      aspectRatio="aspect-video max-w-[120px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Mobile Navbar Logo"
                      field="mobile_logo_url"
                      currentUrl={draftContent.mobile_logo_url}
                      uploading={uploadingField === 'mobile_logo_url'}
                      onUpload={(file) => handleImageUpload('mobile_logo_url', file)}
                      onRemove={() => handleRemoveImage('mobile_logo_url')}
                      aspectRatio="aspect-video max-w-[120px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Small Circular Navbar Icon (Shown in screenshot)"
                      field="navbar_icon_url"
                      currentUrl={draftContent.navbar_icon_url}
                      uploading={uploadingField === 'navbar_icon_url'}
                      onUpload={(file) => handleImageUpload('navbar_icon_url', file)}
                      onRemove={() => handleRemoveImage('navbar_icon_url')}
                      aspectRatio="aspect-square max-w-[70px] rounded-full mx-auto"
                    />
                    <ImageUploadSlot
                      title="Footer Logo"
                      field="footer_logo_url"
                      currentUrl={draftContent.footer_logo_url}
                      uploading={uploadingField === 'footer_logo_url'}
                      onUpload={(file) => handleImageUpload('footer_logo_url', file)}
                      onRemove={() => handleRemoveImage('footer_logo_url')}
                      aspectRatio="aspect-video max-w-[120px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Browser Favicon / Tab Icon"
                      field="favicon_url"
                      currentUrl={draftContent.favicon_url}
                      uploading={uploadingField === 'favicon_url'}
                      onUpload={(file) => handleImageUpload('favicon_url', file)}
                      onRemove={() => handleRemoveImage('favicon_url')}
                      aspectRatio="aspect-square max-w-[40px] mx-auto"
                    />
                  </div>
                )}

                {/* CATEGORY: Homepage */}
                {activeImageCategory === 'homepage' && (
                  <div className="flex flex-col gap-5 animate-fade-in">
                    <ImageUploadSlot
                      title="Hero Circular Image"
                      field="hero_circular_image"
                      currentUrl={draftContent.hero_circular_image}
                      uploading={uploadingField === 'hero_circular_image'}
                      onUpload={(file) => handleImageUpload('hero_circular_image', file)}
                      onRemove={() => handleRemoveImage('hero_circular_image')}
                      aspectRatio="aspect-square max-w-[140px] rounded-full mx-auto"
                    />
                    <ImageUploadSlot
                      title="Hero Background pasture"
                      field="hero_bg_image"
                      currentUrl={draftContent.hero_bg_image}
                      uploading={uploadingField === 'hero_bg_image'}
                      onUpload={(file) => handleImageUpload('hero_bg_image', file)}
                      onRemove={() => handleRemoveImage('hero_bg_image')}
                      aspectRatio="aspect-video"
                    />
                    <ImageUploadSlot
                      title="Promotional Banner Image"
                      field="promo_banner_image"
                      currentUrl={draftContent.promo_banner_image}
                      uploading={uploadingField === 'promo_banner_image'}
                      onUpload={(file) => handleImageUpload('promo_banner_image', file)}
                      onRemove={() => handleRemoveImage('promo_banner_image')}
                      aspectRatio="aspect-video"
                    />
                  </div>
                )}

                {/* CATEGORY: Website Sections */}
                {activeImageCategory === 'sections' && (
                  <div className="flex flex-col gap-5 animate-fade-in">
                    <ImageUploadSlot
                      title="About Section Image"
                      field="about_image"
                      currentUrl={draftContent.about_image}
                      uploading={uploadingField === 'about_image'}
                      onUpload={(file) => handleImageUpload('about_image', file)}
                      onRemove={() => handleRemoveImage('about_image')}
                      aspectRatio="aspect-square max-w-[140px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Why Choose Us Section Image"
                      field="why_choose_us_image"
                      currentUrl={draftContent.why_choose_us_image}
                      uploading={uploadingField === 'why_choose_us_image'}
                      onUpload={(file) => handleImageUpload('why_choose_us_image', file)}
                      onRemove={() => handleRemoveImage('why_choose_us_image')}
                      aspectRatio="aspect-video"
                    />
                    <ImageUploadSlot
                      title="Testimonial Background Image"
                      field="testimonial_bg_image"
                      currentUrl={draftContent.testimonial_bg_image}
                      uploading={uploadingField === 'testimonial_bg_image'}
                      onUpload={(file) => handleImageUpload('testimonial_bg_image', file)}
                      onRemove={() => handleRemoveImage('testimonial_bg_image')}
                      aspectRatio="aspect-video"
                    />
                    <ImageUploadSlot
                      title="Contact Section Image"
                      field="contact_image"
                      currentUrl={draftContent.contact_image}
                      uploading={uploadingField === 'contact_image'}
                      onUpload={(file) => handleImageUpload('contact_image', file)}
                      onRemove={() => handleRemoveImage('contact_image')}
                      aspectRatio="aspect-video"
                    />
                    <ImageUploadSlot
                      title="Delivery Information Image"
                      field="delivery_image"
                      currentUrl={draftContent.delivery_image}
                      uploading={uploadingField === 'delivery_image'}
                      onUpload={(file) => handleImageUpload('delivery_image', file)}
                      onRemove={() => handleRemoveImage('delivery_image')}
                      aspectRatio="aspect-video"
                    />
                  </div>
                )}

                {/* CATEGORY: System Pages */}
                {activeImageCategory === 'system' && (
                  <div className="flex flex-col gap-5 animate-fade-in">
                    <ImageUploadSlot
                      title="404 Error Page Image"
                      field="error_404_image"
                      currentUrl={draftContent.error_404_image}
                      uploading={uploadingField === 'error_404_image'}
                      onUpload={(file) => handleImageUpload('error_404_image', file)}
                      onRemove={() => handleRemoveImage('error_404_image')}
                      aspectRatio="aspect-square max-w-[140px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Maintenance Mode Image"
                      field="maintenance_image"
                      currentUrl={draftContent.maintenance_image}
                      uploading={uploadingField === 'maintenance_image'}
                      onUpload={(file) => handleImageUpload('maintenance_image', file)}
                      onRemove={() => handleRemoveImage('maintenance_image')}
                      aspectRatio="aspect-square max-w-[140px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Offline Page Image"
                      field="offline_image"
                      currentUrl={draftContent.offline_image}
                      uploading={uploadingField === 'offline_image'}
                      onUpload={(file) => handleImageUpload('offline_image', file)}
                      onRemove={() => handleRemoveImage('offline_image')}
                      aspectRatio="aspect-square max-w-[140px] mx-auto"
                    />
                    <ImageUploadSlot
                      title="Empty Cart / Catalog Image"
                      field="empty_state_image"
                      currentUrl={draftContent.empty_state_image}
                      uploading={uploadingField === 'empty_state_image'}
                      onUpload={(file) => handleImageUpload('empty_state_image', file)}
                      onRemove={() => handleRemoveImage('empty_state_image')}
                      aspectRatio="aspect-square max-w-[140px] mx-auto"
                    />
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="w-full border border-cream-dark hover:bg-cream-dark/25 py-3 rounded-xl text-xs font-bold text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white"
          >
            <RotateCcw size={14} />
            <span>Reset to Farm Defaults</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Live Website Preview Frame (lg:col-span-7) */}
        <div className="lg:col-span-7 sticky top-24 flex flex-col gap-4 animate-fade-in">
          
          {/* Preview Device Controls */}
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-cream-dark/40 shadow-sm no-print">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Eye size={15} className="text-accent" />
              <span>Live Working Preview</span>
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-primary text-cream' : 'text-foreground/50 hover:bg-cream-dark/20'
                }`}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-primary text-cream' : 'text-foreground/50 hover:bg-cream-dark/20'
                }`}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div className="flex justify-center items-start w-full bg-cream-dark/20 rounded-3xl p-4 border border-cream-dark/40 overflow-hidden shadow-inner">
            <div
              className={`bg-white shadow-2xl transition-all duration-300 border border-gray-300 relative ${
                previewDevice === 'mobile'
                  ? 'w-[340px] h-[580px] rounded-[36px] border-[10px] border-gray-800 overflow-y-auto scrollbar-none'
                  : 'w-full h-[580px] rounded-xl overflow-y-auto'
              }`}
            >
              {/* Dynamic Theme Injector inside Iframe/Mockup (using local inline styles) */}
              <div
                style={{
                  backgroundColor: draftContent.colors?.background || '#fdfbf7',
                  color: draftContent.colors?.text_color || '#2d2b28',
                  fontFamily: draftContent.typography?.body_font || 'sans-serif',
                  minHeight: '100%',
                }}
                className="flex flex-col text-xs text-left"
              >
                {/* 1. Promo Banner */}
                {draftContent.promo_banner_active && (
                  <div
                    style={{
                      background: `linear-gradient(to right, ${draftContent.colors?.primary}, ${draftContent.colors?.accent})`,
                      color: '#ffffff',
                    }}
                    className="text-center py-1.5 px-3 text-[9px] font-bold"
                  >
                    🎉 {draftContent.promo_banner_text}
                  </div>
                )}

                {/* 2. Mock Header */}
                <div
                  style={{
                    backgroundColor: draftContent.colors?.navbar_bg || '#ffffff',
                    borderBottom: `1px solid ${draftContent.colors?.border_color || '#f5ebd6'}`,
                  }}
                  className="flex items-center justify-between px-4 py-2 bg-white/80 sticky top-0 z-50"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-gray-100 overflow-hidden border border-gray-200 relative flex items-center justify-center">
                      <img src={draftContent.navbar_icon_url || draftContent.logo_url} className="object-cover h-full w-full" />
                    </div>
                    <span
                      style={{
                        fontFamily: draftContent.typography?.heading_font || 'serif',
                        color: draftContent.colors?.primary,
                      }}
                      className="font-bold text-xs"
                    >
                      {draftContent.website_name || 'Mana Inti Farms'}
                    </span>
                  </div>
                  <div className="flex gap-2.5 text-[10px] font-semibold text-gray-600">
                    <span>Home</span>
                    <span>Products</span>
                    <span>About</span>
                  </div>
                </div>

                {/* 3. Mock Hero Section */}
                {draftContent.sections?.hero !== false && (
                  <div className="relative py-8 px-4 border-b border-gray-100 overflow-hidden flex flex-col gap-4 bg-cream/10">
                    {/* Hero Background */}
                    <div className="absolute inset-0 opacity-10">
                      <img src={draftContent.hero_bg_image} className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 max-w-[75%]">
                      <h2
                        style={{
                          fontFamily: draftContent.typography?.heading_font || 'serif',
                          color: draftContent.colors?.primary,
                        }}
                        className="text-lg sm:text-xl font-bold leading-tight"
                      >
                        {draftContent.hero_title}
                      </h2>
                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        {draftContent.hero_subtitle}
                      </p>
                      
                      <button
                        style={{
                          backgroundColor: draftContent.colors?.primary,
                          color: '#ffffff',
                          borderRadius: '9999px',
                        }}
                        className="self-start px-4 py-1.5 text-[10px] font-bold"
                      >
                        {draftContent.hero_button_text || 'Order Now'}
                      </button>
                    </div>

                    {/* Premium Circular Image Mockup */}
                    <div className="relative flex items-center justify-center mt-4 h-40">
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
                        <img src={draftContent.hero_circular_image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1000&auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Floating Badge */}
                      {draftContent.seasonal_offer && (
                        <div
                          style={{
                            backgroundColor: draftContent.colors?.accent,
                            color: '#ffffff',
                          }}
                          className="absolute bottom-1 right-8 font-bold text-[8px] px-2.5 py-1 rounded-lg shadow-md z-30 animate-bounce"
                        >
                          {draftContent.seasonal_offer}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Mock Why Choose Us */}
                {draftContent.sections?.why_choose_us !== false && (
                  <div className="py-6 px-4 bg-white border-b border-gray-100 text-center">
                    <h3
                      style={{
                        fontFamily: draftContent.typography?.heading_font || 'serif',
                        color: draftContent.colors?.primary,
                      }}
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Why Choose Us
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* Dynamic Mockup Card Style */}
                      <div
                        style={{
                          borderColor: draftContent.colors?.border_color,
                        }}
                        className={`p-2.5 bg-gray-50 border text-left ${getMockRadiusClass()} ${
                          draftContent.layout?.card_style === 'shadow' ? 'shadow-md border-0 bg-white' : ''
                        }`}
                      >
                        <span style={{ color: draftContent.colors?.primary }} className="font-bold text-[10px]">🌿 Organic</span>
                        <p className="text-[9px] text-gray-500 mt-0.5">100% organic feed raised ethically.</p>
                      </div>
                      
                      <div
                        style={{
                          borderColor: draftContent.colors?.border_color,
                        }}
                        className={`p-2.5 bg-gray-50 border text-left ${getMockRadiusClass()} ${
                          draftContent.layout?.card_style === 'shadow' ? 'shadow-md border-0 bg-white' : ''
                        }`}
                      >
                        <span style={{ color: draftContent.colors?.primary }} className="font-bold text-[10px]">🐔 Free Range</span>
                        <p className="text-[9px] text-gray-500 mt-0.5">Roaming freely in green pastures.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Mock CTA / About Section */}
                {draftContent.sections?.about !== false && (
                  <div
                    style={{
                      backgroundColor: draftContent.colors?.primary,
                      color: '#ffffff',
                    }}
                    className="py-6 px-4 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-10">
                      <img src={draftContent.about_image} className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-2">
                      <h3
                        style={{
                          fontFamily: draftContent.typography?.heading_font || 'serif',
                        }}
                        className="text-sm font-bold text-white"
                      >
                        {draftContent.hero_cta_text || 'Want to taste authentic, healthy country produce?'}
                      </h3>
                      <p className="text-[9px] text-white/80 leading-relaxed">
                        Our farm order cycles are harvested fresh daily. Place your order now or get in touch with us.
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. Mock Footer */}
                <div
                  style={{
                    backgroundColor: draftContent.colors?.footer_bg || draftContent.colors?.primary,
                    color: '#ffffff',
                  }}
                  className="py-4 px-4 text-center border-t border-white/5"
                >
                  <span className="text-[8px] text-white/60">
                    © {new Date().getFullYear()} {draftContent.website_name || 'Mana Inti Farms'}. All rights reserved.
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for Tabs
interface TabButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}
function TabButton({ active, icon, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
        active
          ? 'bg-primary text-cream shadow-sm'
          : 'text-foreground/60 hover:bg-cream-dark/20'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Sub-component for Color Pickers
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}
function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1 text-left border border-cream-dark/50 p-2.5 rounded-xl bg-cream/5">
      <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 border border-cream-dark bg-white rounded-lg text-xs font-mono uppercase focus:outline-none"
        />
      </div>
    </div>
  );
}

// Sub-component for Toggles
interface SectionToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}
function SectionToggle({ label, checked, onChange }: SectionToggleProps) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-cream/10 border border-cream-dark/50 rounded-xl hover:bg-cream/15 transition-all">
      <span className="text-sm font-bold text-primary">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}

// Sub-component for Image Slots
interface ImageUploadSlotProps {
  title: string;
  field: string;
  currentUrl: string | null | undefined;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  aspectRatio: string;
}
function ImageUploadSlot({
  title,
  field,
  currentUrl,
  uploading,
  onUpload,
  onRemove,
  aspectRatio,
}: ImageUploadSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b border-cream-dark/20 pb-5 last:border-b-0 last:pb-0 text-left">
      <span className="text-xs font-bold text-primary uppercase tracking-wider">{title}</span>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all overflow-hidden bg-cream/5 ${
          isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-cream-dark/60 hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-6 flex flex-col items-center gap-2">
            <RefreshCw size={20} className="animate-spin text-primary" />
            <span className="text-[10px] font-semibold text-primary">Compressing & Uploading...</span>
          </div>
        ) : currentUrl ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div className={`relative w-full shadow-inner border border-cream-dark/30 overflow-hidden ${aspectRatio}`}>
              <img src={currentUrl} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-cream hover:bg-cream-dark/40 text-primary text-[10px] font-bold rounded-lg border border-cream-dark/55 flex items-center gap-1 cursor-pointer"
              >
                <Upload size={10} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={10} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="py-6 flex flex-col items-center gap-1.5 cursor-pointer w-full text-center"
          >
            <Upload size={16} className="text-primary" />
            <div className="text-[10px]">
              <span className="font-bold text-primary">Upload image</span> or drag & drop
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
