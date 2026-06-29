'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { dbService, DEFAULT_HOMEPAGE_CONTENT } from '@/lib/dbService';
import { HomepageContent, Product, MediaAsset } from '@/lib/types';
import { Search, Image as ImageIcon, Upload, Trash2, Eye, RefreshCw, CheckCircle2, Info, AlertTriangle, Star, Edit2, Copy, Calendar, Tag, Check, X, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminImages() {
  const { homepageContent, refreshData, updateHomepageContent } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Preview Modal
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Inline Editing States
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAlt, setEditAlt] = useState('');

  // Active Dropdown State
  const [activeSetMenuId, setActiveSetMenuId] = useState<string | null>(null);

  // New Asset Form State
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState<MediaAsset['category']>('homepage');
  const [newAssetAlt, setNewAssetAlt] = useState('');
  const newFileRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const prodList = await dbService.getProducts();
        setProducts(prodList);
        const assets = await dbService.getMediaAssets();
        setMediaAssets(assets);
      } catch (err) {
        console.error('Error fetching media library:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [homepageContent]);

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

  // Upload New Asset
  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetFile) return;

    setUploading(true);
    try {
      const compressedFile = await compressImage(newAssetFile);
      const fileName = `lib_${Date.now()}_${newAssetFile.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      const url = await dbService.uploadImage(compressedFile, 'mif-assets', fileName);

      const newAsset = await dbService.createMediaAsset({
        name: newAssetName || newAssetFile.name.split('.')[0],
        url,
        category: newAssetCategory,
        alt_text: newAssetAlt,
      });

      setMediaAssets((prev) => [newAsset, ...prev]);
      
      // Reset Form
      setNewAssetFile(null);
      setNewAssetName('');
      setNewAssetAlt('');
      if (newFileRef.current) newFileRef.current.value = '';

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // Delete Asset
  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image from the Media Library?')) return;
    try {
      await dbService.deleteMediaAsset(id);
      setMediaAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete asset.');
    }
  };

  // Rename & Edit Alt Text
  const handleStartEdit = (asset: MediaAsset) => {
    setEditingAssetId(asset.id);
    setEditName(asset.name);
    setEditAlt(asset.alt_text || '');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const updated = await dbService.updateMediaAsset(id, {
        name: editName,
        alt_text: editAlt,
      });
      setMediaAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingAssetId(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to save changes.');
    }
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard!');
  };

  // "Set Image" (Apply to website slot)
  const handleSetImage = async (url: string, targetKey: string, isProduct: boolean) => {
    setSaving(true);
    try {
      if (isProduct) {
        // Update product image
        const prod = products.find((p) => p.id === targetKey);
        if (prod) {
          await dbService.updateProduct({
            ...prod,
            image_url: url,
          });
        }
        // Refresh products
        const prodList = await dbService.getProducts();
        setProducts(prodList);
      } else {
        // Update CMS setting
        if (homepageContent) {
          const updatedContent = {
            ...homepageContent,
            [targetKey]: url,
          };
          await updateHomepageContent(updatedContent);
        }
      }

      await refreshData();
      setActiveSetMenuId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Set image failed:', err);
      alert('Failed to set image.');
    } finally {
      setSaving(false);
    }
  };

  // Determine active targets for each asset
  const getActiveTargets = (url: string): string[] => {
    const targets: string[] = [];
    if (!homepageContent) return [];

    // Check branding
    if (homepageContent.logo_url === url) targets.push('Main Website Logo');
    if (homepageContent.navbar_logo_url === url) targets.push('Navbar Logo');
    if (homepageContent.mobile_logo_url === url) targets.push('Mobile Logo');
    if (homepageContent.navbar_icon_url === url) targets.push('Navbar Icon');
    if (homepageContent.footer_logo_url === url) targets.push('Footer Logo');
    if (homepageContent.favicon_url === url) targets.push('Browser Favicon');

    // Check homepage
    if (homepageContent.hero_circular_image === url) targets.push('Hero Circular Image');
    if (homepageContent.hero_bg_image === url) targets.push('Hero Background Pasture');
    if (homepageContent.promo_banner_image === url) targets.push('Promotional Banner');

    // Check sections
    if (homepageContent.about_image === url) targets.push('About Section');
    if (homepageContent.why_choose_us_image === url) targets.push('Why Choose Us');
    if (homepageContent.testimonial_bg_image === url) targets.push('Testimonials Accent');
    if (homepageContent.contact_image === url) targets.push('Contact Section');
    if (homepageContent.delivery_image === url) targets.push('Delivery Details');

    // Check system
    if (homepageContent.error_404_image === url) targets.push('404 Page');
    if (homepageContent.maintenance_image === url) targets.push('Maintenance Page');
    if (homepageContent.offline_image === url) targets.push('Offline Page');
    if (homepageContent.empty_state_image === url) targets.push('Empty Cart State');

    // Check products
    products.forEach((prod) => {
      if (prod.image_url === url) {
        targets.push(`Product: ${prod.name}`);
      }
    });

    return targets;
  };

  // Available Set Targets based on Asset Category
  const getAvailableTargets = (category: MediaAsset['category']) => {
    switch (category) {
      case 'branding':
        return [
          { key: 'logo_url', name: 'Main Website Logo', isProduct: false },
          { key: 'navbar_logo_url', name: 'Navbar Logo (Desktop)', isProduct: false },
          { key: 'mobile_logo_url', name: 'Mobile Navbar Logo', isProduct: false },
          { key: 'navbar_icon_url', name: 'Small Circular Navbar Icon', isProduct: false },
          { key: 'footer_logo_url', name: 'Footer Logo', isProduct: false },
          { key: 'favicon_url', name: 'Browser Favicon', isProduct: false },
        ];
      case 'homepage':
        return [
          { key: 'hero_circular_image', name: 'Hero Circular Image', isProduct: false },
          { key: 'hero_bg_image', name: 'Hero Background Pasture', isProduct: false },
          { key: 'promo_banner_image', name: 'Promotional Banner Image', isProduct: false },
        ];
      case 'sections':
        return [
          { key: 'about_image', name: 'About Section Image', isProduct: false },
          { key: 'why_choose_us_image', name: 'Why Choose Us Image', isProduct: false },
          { key: 'testimonial_bg_image', name: 'Testimonials Accent Image', isProduct: false },
          { key: 'contact_image', name: 'Contact Section Image', isProduct: false },
          { key: 'delivery_image', name: 'Delivery Info Image', isProduct: false },
        ];
      case 'system':
        return [
          { key: 'error_404_image', name: '404 Error Page Image', isProduct: false },
          { key: 'maintenance_image', name: 'Maintenance Page Image', isProduct: false },
          { key: 'offline_image', name: 'Offline Page Image', isProduct: false },
          { key: 'empty_state_image', name: 'Empty Cart State Image', isProduct: false },
        ];
      case 'products':
        return products.map((p) => ({
          key: p.id,
          name: `Product: ${p.name}`,
          isProduct: true,
        }));
      default:
        return [];
    }
  };

  // Drag and drop handlers
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
      const file = e.dataTransfer.files[0];
      setNewAssetFile(file);
      setNewAssetName(file.name.split('.')[0]);
    }
  };

  // Filter & Search Logic
  const filteredAssets = mediaAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.alt_text || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-foreground/50 font-body">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Media Library...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-body text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">🖼️ Media & Image Manager</h1>
          <p className="text-sm text-foreground/60">
            Upload images to your library and click <strong>"Set Image"</strong> to apply them to any section or product instantly.
          </p>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
          <span>Action completed successfully! Storefront has been updated in real-time.</span>
        </div>
      )}

      {/* Grid: Upload Form + Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drag & Drop Upload Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm">
          <h2 className="font-display font-bold text-lg text-primary mb-4 flex items-center gap-2">
            <Plus size={18} className="text-accent" />
            <span>Upload New Image to Media Library</span>
          </h2>

          <form onSubmit={handleUploadAsset} className="flex flex-col gap-4">
            
            {/* File Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => newFileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-cream-dark/60 hover:border-primary/55'
              }`}
            >
              <input
                ref={newFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setNewAssetFile(file);
                    setNewAssetName(file.name.split('.')[0]);
                  }
                }}
              />

              {newAssetFile ? (
                <div className="flex items-center gap-4 text-left w-full max-w-md">
                  <div className="h-16 w-16 rounded-xl border border-cream-dark overflow-hidden bg-cream/10 shrink-0">
                    <img src={URL.createObjectURL(newAssetFile)} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-grow overflow-hidden">
                    <span className="text-xs font-bold text-primary truncate">{newAssetFile.name}</span>
                    <span className="text-[10px] text-foreground/50">{(newAssetFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewAssetFile(null);
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload size={24} className="text-primary" />
                  <div className="text-xs">
                    <span className="font-bold text-primary">Choose file</span> or drag & drop here
                  </div>
                  <span className="text-[9px] text-foreground/40 leading-none">Supports JPEG, PNG, WEBP (auto-compressed on upload)</span>
                </div>
              )}
            </div>

            {/* Fields */}
            {newAssetFile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="e.g. Hero Chicken Box"
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Category</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="branding">Branding & Logos</option>
                    <option value="homepage">Homepage Assets</option>
                    <option value="products">Products & Packages</option>
                    <option value="sections">Website Sections</option>
                    <option value="system">Error & System Pages</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={newAssetAlt}
                    onChange={(e) => setNewAssetAlt(e.target.value)}
                    placeholder="Describe for search engines..."
                    className="w-full px-3 py-2 rounded-xl border border-cream-dark bg-cream/5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {newAssetFile && (
              <button
                type="submit"
                disabled={uploading}
                className="self-end px-5 py-2 bg-primary hover:bg-primary-hover text-cream text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                <span>Upload & Save to Library</span>
              </button>
            )}

          </form>
        </div>

        {/* CMS Instructions */}
        <div className="bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm flex flex-col gap-3">
          <h3 className="font-display font-bold text-lg text-primary flex items-center gap-1.5">
            <Info size={18} className="text-accent" />
            <span>CMS Workflow</span>
          </h3>
          <ol className="text-xs text-foreground/70 list-decimal pl-4 space-y-2">
            <li><strong>Upload</strong> your high-quality country chicken or egg images to the library.</li>
            <li>Click the **⭐ Set Image** button on any card in the gallery.</li>
            <li>Select where you want to apply the image (e.g. <em>Hero Circular Image</em>, <em>Navbar Icon</em>, or a specific <em>Egg Package Card</em>).</li>
            <li>The system immediately replaces the active image and syncs the storefront in real-time.</li>
          </ol>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-cream-dark/40 shadow-sm mt-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by name or alt text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1 md:pb-0">
          <FilterTab active={selectedCategory === 'all'} label="All Library" count={mediaAssets.length} onClick={() => setSelectedCategory('all')} />
          <FilterTab active={selectedCategory === 'branding'} label="Branding" count={mediaAssets.filter(i => i.category === 'branding').length} onClick={() => setSelectedCategory('branding')} />
          <FilterTab active={selectedCategory === 'homepage'} label="Homepage" count={mediaAssets.filter(i => i.category === 'homepage').length} onClick={() => setSelectedCategory('homepage')} />
          <FilterTab active={selectedCategory === 'products'} label="Products" count={mediaAssets.filter(i => i.category === 'products').length} onClick={() => setSelectedCategory('products')} />
          <FilterTab active={selectedCategory === 'sections'} label="Sections" count={mediaAssets.filter(i => i.category === 'sections').length} onClick={() => setSelectedCategory('sections')} />
          <FilterTab active={selectedCategory === 'system'} label="System" count={mediaAssets.filter(i => i.category === 'system').length} onClick={() => setSelectedCategory('system')} />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const activeTargets = getActiveTargets(asset.url);
            const isEditing = editingAssetId === asset.id;
            const availableTargets = getAvailableTargets(asset.category);

            return (
              <div
                key={asset.id}
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all relative ${
                  activeTargets.length > 0 ? 'border-primary/50 ring-1 ring-primary/20' : 'border-cream-dark/40'
                }`}
              >
                {/* Image Preview */}
                <div className="bg-cream/20 p-4 border-b border-cream-dark/20 relative aspect-video flex items-center justify-center overflow-hidden">
                  <img src={asset.url} alt={asset.name} className="max-h-full max-w-full object-contain rounded-lg shadow-sm" />

                  {/* Active Indicators */}
                  {activeTargets.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                      {activeTargets.map((target, idx) => (
                        <span key={idx} className="bg-primary text-cream text-[8px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Check size={8} />
                          <span>🟢 Used as: {target}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col gap-3 flex-grow text-left">
                  
                  {/* Category Tag & Upload Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-dark/30 text-primary flex items-center gap-1">
                      <Tag size={8} />
                      <span>{asset.category}</span>
                    </span>
                    <span className="text-[8px] text-foreground/40 flex items-center gap-1">
                      <Calendar size={8} />
                      <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Name & Alt Text (View/Edit) */}
                  {isEditing ? (
                    <div className="flex flex-col gap-2 p-2 bg-cream/10 rounded-xl border border-cream-dark/50 animate-fade-in">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-foreground/50 uppercase">Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-cream-dark bg-white rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-foreground/50 uppercase">Alt Text (SEO)</label>
                        <input
                          type="text"
                          value={editAlt}
                          onChange={(e) => setEditAlt(e.target.value)}
                          className="w-full px-2 py-1 border border-cream-dark bg-white rounded text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 justify-end">
                        <button
                          onClick={() => setEditingAssetId(null)}
                          className="p-1 text-foreground/50 hover:bg-gray-100 rounded text-[10px]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(asset.id)}
                          className="px-2 py-1 bg-primary text-cream rounded text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-sm text-primary line-clamp-1" title={asset.name}>
                        {asset.name}
                      </h3>
                      <p className="text-[10px] text-foreground/50 line-clamp-1 leading-normal">
                        <strong>Alt:</strong> {asset.alt_text || 'No alt text set (SEO warning)'}
                      </p>
                    </div>
                  )}

                  {/* "Set Image" Dropdown Selector */}
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSetMenuId(activeSetMenuId === asset.id ? null : asset.id)}
                      className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <Star size={12} fill="currentColor" />
                      <span>Set Image</span>
                    </button>

                    {activeSetMenuId === asset.id && (
                      <div className="absolute top-full left-0 w-full bg-white border border-cream-dark shadow-xl rounded-xl mt-1.5 z-30 max-h-48 overflow-y-auto py-1 animate-scale-up">
                        <div className="px-2.5 py-1 text-[8px] font-bold text-foreground/40 uppercase tracking-wider border-b border-cream-dark/20">
                          Select Section target
                        </div>
                        {availableTargets.length > 0 ? (
                          availableTargets.map((target) => (
                            <button
                              key={target.key}
                              type="button"
                              onClick={() => handleSetImage(asset.url, target.key, target.isProduct)}
                              className="w-full text-left px-3 py-2 text-[10px] text-foreground/80 hover:bg-cream/20 hover:text-primary font-medium flex items-center justify-between"
                            >
                              <span>{target.name}</span>
                              {activeTargets.includes(target.name) && (
                                <span className="text-primary text-[8px] font-bold">Active</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-[10px] text-foreground/40 italic">
                            No slots available for this category
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-cream-dark/10 mt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ url: asset.url, title: asset.name })}
                        className="p-1.5 border border-cream-dark hover:bg-cream-dark/25 text-primary rounded-lg transition-colors cursor-pointer"
                        title="Preview Full Size"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(asset)}
                        className="p-1.5 border border-cream-dark hover:bg-cream-dark/25 text-primary rounded-lg transition-colors cursor-pointer"
                        title="Edit Info"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset.url)}
                        className="p-1.5 border border-cream-dark hover:bg-cream-dark/25 text-primary rounded-lg transition-colors cursor-pointer"
                        title="Copy Image URL"
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-cream-dark/40 p-12 text-center text-foreground/50 flex flex-col items-center gap-2 mt-4">
          <ImageIcon size={32} className="text-foreground/30" />
          <span className="text-sm font-semibold">No media assets found in your library.</span>
          <p className="text-xs text-foreground/45">Use the upload panel above to add your first image.</p>
        </div>
      )}

      {/* Full-Screen Preview Lightbox Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col relative animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-cream-dark/30 flex items-center justify-between">
              <h3 className="font-bold text-primary font-display text-base">{previewImage.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-foreground/40 hover:text-foreground p-1.5 rounded-full hover:bg-cream-dark/20 cursor-pointer"
              >
                ✕
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 bg-cream/10 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img src={previewImage.url} alt={previewImage.title} className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-md" />
            </div>
            {/* Modal Footer */}
            <div className="p-4 border-t border-cream-dark/30 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-primary text-cream text-xs font-bold rounded-xl hover:bg-primary-hover cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

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
      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
        active
          ? 'bg-primary text-cream shadow-sm'
          : 'bg-cream/20 text-primary/70 hover:bg-cream-dark/20'
      }`}
    >
      <span>{label}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-cream-dark/35 text-primary'}`}>
        {count}
      </span>
    </button>
  );
}
