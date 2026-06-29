'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from '@/lib/dbService';
import { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle, XCircle, Sparkles, X } from 'lucide-react';
import { HenIcon, BasketIcon } from '@/components/ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'kg',
    category: 'chicken' as 'chicken' | 'eggs',
    is_active: true,
    in_stock: true,
    organic_badge: true,
    stock_badge_text: '',
    display_order: 0,
    image_url: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
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

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dbService.getAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      unit: 'kg',
      category: 'chicken',
      is_active: true,
      in_stock: true,
      organic_badge: true,
      stock_badge_text: '',
      display_order: products.length + 1,
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      is_active: product.is_active,
      in_stock: product.in_stock,
      organic_badge: product.organic_badge,
      stock_badge_text: product.stock_badge_text || '',
      display_order: product.display_order,
      image_url: product.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await dbService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'display_order' ? Number(value) : value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productPayload = {
        ...formData,
        stock_badge_text: formData.stock_badge_text.trim() || null,
        image_url: formData.image_url || null,
      };

      if (editingProduct) {
        await dbService.updateProduct({
          ...productPayload,
          id: editingProduct.id,
        });
      } else {
        await dbService.createProduct(productPayload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  return (
    <div className="flex flex-col gap-8 font-body text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Manage Products</h1>
          <p className="text-sm text-foreground/60">Update prices, stock levels, and customize product badges.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-hover text-cream px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-foreground/50">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-cream-dark/40 rounded-3xl p-12 text-center text-foreground/50">
          <span>No products in catalog. Click "Add Product" to create your first item.</span>
        </div>
      ) : (
        <div className="bg-white border border-cream-dark/40 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-cream/40 text-xs font-bold uppercase tracking-wider text-foreground/50 border-b border-cream-dark/25">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6">Badges</th>
                  <th className="py-4 px-6">Sort Order</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/20 text-sm text-foreground/80">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/10 transition-colors">
                    
                    {/* Name & Desc */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cream-dark/20 rounded-lg text-primary shrink-0">
                          {product.category === 'chicken' ? <HenIcon size={20} /> : <BasketIcon size={20} />}
                        </div>
                        <div className="flex flex-col max-w-[220px]">
                          <span className="font-bold text-primary leading-tight">{product.name}</span>
                          <span className="text-xs text-foreground/50 line-clamp-1 mt-0.5">{product.description}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 font-semibold uppercase text-xs tracking-wider text-foreground/60">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-primary">
                      {formatINR(product.price)} <span className="text-xs font-normal text-foreground/50">/{product.unit}</span>
                    </td>

                    {/* Stock Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                        product.in_stock ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {product.in_stock ? (
                          <><CheckCircle size={14} /> In Stock</>
                        ) : (
                          <><XCircle size={14} /> Out of Stock</>
                        )}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                        product.is_active ? 'text-blue-700' : 'text-foreground/40'
                      }`}>
                        {product.is_active ? (
                          <><Eye size={14} /> Active / Visible</>
                        ) : (
                          <><EyeOff size={14} /> Hidden</>
                        )}
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                        {product.organic_badge && (
                          <span className="bg-primary text-cream text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                            Organic
                          </span>
                        )}
                        {product.stock_badge_text && (
                          <span className="bg-accent text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                            {product.stock_badge_text}
                          </span>
                        )}
                        {!product.organic_badge && !product.stock_badge_text && (
                          <span className="text-xs text-foreground/30">—</span>
                        )}
                      </div>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-6 font-mono font-semibold text-center md:text-left">
                      {product.display_order}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1 text-primary hover:bg-cream-dark/30 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-cream-dark/50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-cream-dark/25 pb-4 mb-6">
                <h3 className="font-display font-bold text-xl text-primary">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-cream rounded-full text-foreground/50 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-foreground/70">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Fresh Loose Country Eggs"
                    className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-xs font-bold text-foreground/70">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="chicken">Country Chicken</option>
                      <option value="eggs">Country Eggs</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="unit" className="text-xs font-bold text-foreground/70">Selling Unit *</label>
                    <input
                      type="text"
                      id="unit"
                      name="unit"
                      required
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="e.g. kg, Egg, 6 Eggs, 12 Eggs"
                      className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Price & Sort Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="price" className="text-xs font-bold text-foreground/70">Price (INR) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 559"
                      className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="display_order" className="text-xs font-bold text-foreground/70">Display Order</label>
                    <input
                      type="number"
                      id="display_order"
                      name="display_order"
                      min="0"
                      value={formData.display_order}
                      onChange={handleInputChange}
                      placeholder="e.g. 1"
                      className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-xs font-bold text-foreground/70">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about size, feed, feeding habit, dressing style..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                {/* Custom Badge Text */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="stock_badge_text" className="text-xs font-bold text-foreground/70">Custom Badge Text (Optional)</label>
                  <input
                    type="text"
                    id="stock_badge_text"
                    name="stock_badge_text"
                    value={formData.stock_badge_text}
                    onChange={handleInputChange}
                    placeholder="e.g. Fresh Daily, Best Seller, Limited Stock"
                    className="w-full px-4 py-2 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Product Image Uploader */}
                <div className="flex flex-col gap-1.5 border-t border-cream-dark/20 pt-3">
                  <label className="text-xs font-bold text-foreground/70">Product Image</label>
                  <div className="flex items-center gap-4 bg-cream/10 p-3 rounded-2xl border border-cream-dark/40">
                    {formData.image_url ? (
                      <div className="relative h-16 w-20 rounded-xl overflow-hidden border border-cream-dark bg-white shrink-0 shadow-sm">
                        <img src={formData.image_url} alt="Product Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full shadow"
                          title="Remove Image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-20 rounded-xl border-2 border-dashed border-cream-dark/60 flex items-center justify-center text-foreground/30 shrink-0 bg-white">
                        <Plus size={16} />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        id="product_image_file"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            try {
                              setUploadingImage(true);
                              const compressedFile = await compressImage(file);
                              const fileName = `product_${Date.now()}.jpg`;
                              const url = await dbService.uploadImage(compressedFile, 'mif-assets', fileName);
                              setFormData(prev => ({ ...prev, image_url: url }));
                            } catch (err) {
                              console.error('Error uploading product image:', err);
                              alert('Failed to upload product image.');
                            } finally {
                              setUploadingImage(false);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => document.getElementById('product_image_file')?.click()}
                        className="bg-cream hover:bg-cream-dark/30 border border-cream-dark text-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all disabled:opacity-50"
                      >
                        {uploadingImage ? 'Uploading...' : 'Choose Image File'}
                      </button>
                      <span className="text-[9px] text-foreground/40 leading-none">JPEG/PNG, max 5MB (auto-compressed)</span>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-cream-dark/20 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="in_stock"
                      checked={formData.in_stock}
                      onChange={handleInputChange}
                      className="rounded border-cream-dark text-primary focus:ring-primary h-4.5 w-4.5"
                    />
                    <span className="text-xs font-semibold text-foreground/80">In Stock</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-cream-dark text-primary focus:ring-primary h-4.5 w-4.5"
                    />
                    <span className="text-xs font-semibold text-foreground/80">Visible</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="organic_badge"
                      checked={formData.organic_badge}
                      onChange={handleInputChange}
                      className="rounded border-cream-dark text-primary focus:ring-primary h-4.5 w-4.5"
                    />
                    <span className="text-xs font-semibold text-foreground/80">Organic</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 border-t border-cream-dark/25 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-cream-dark text-foreground/70 font-semibold text-sm hover:bg-cream-dark/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-cream px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
