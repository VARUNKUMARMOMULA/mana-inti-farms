'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowLeft, Send, CheckCircle2, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderClient() {
  const {
    cart,
    settings,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getDeliveryCharge,
    getGrandTotal,
    placeOrder,
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    orderType: 'delivery' as 'delivery' | 'pickup',
    paymentMethod: 'COD' as 'COD' | 'UPI',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // If order type changes, validate/reset address
  useEffect(() => {
    if (formData.orderType === 'pickup') {
      setFormData((prev) => ({ ...prev, address: 'Store Pickup (Bowrampet, Hyderabad)' }));
    } else if (formData.address === 'Store Pickup (Bowrampet, Hyderabad)') {
      setFormData((prev) => ({ ...prev, address: '' }));
    }
  }, [formData.orderType]);

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required.';
    
    // Simple Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      tempErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.orderType === 'delivery' && !formData.address.trim()) {
      tempErrors.address = 'Delivery address is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await placeOrder({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      orderType: formData.orderType,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    });
    setIsSubmitting(false);

    if (result.success && result.order && result.whatsappUrl) {
      setPlacedOrder(result.order);
      setWhatsappUrl(result.whatsappUrl);
      setShowSuccessModal(true);
      
      // Trigger Confetti Celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#1e3f20', '#ff6f00', '#f5ebd6', '#e6a100'],
      });
      
      // Auto redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        window.open(result.whatsappUrl, '_blank');
      }, 2500);
    } else {
      alert(result.error || 'Something went wrong. Please try again.');
    }
  };

  const subtotal = getCartTotal();
  const deliveryCharge = formData.orderType === 'pickup' ? 0 : getDeliveryCharge();
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-body text-left">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>

      <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary mb-8 tracking-tight">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-dark/40 rounded-3xl max-w-lg mx-auto">
          <div className="bg-cream-dark/20 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-primary/40">
            <ShoppingBag size={40} />
          </div>
          <h3 className="font-display font-bold text-2xl text-primary mb-2">Your Cart is Empty</h3>
          <p className="text-sm text-foreground/60 leading-relaxed mb-6 px-6">
            You haven't added any country chicken or eggs to your cart yet. Visit our products page to order.
          </p>
          <Link
            href="/products"
            className="bg-primary text-cream px-8 py-3 rounded-full font-semibold shadow-md hover:bg-primary-hover transition-all inline-flex items-center gap-2"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Checkout Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-cream-dark/40 shadow-sm">
            <h2 className="font-display font-bold text-2xl text-primary mb-6">Delivery Details</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.name ? 'border-red-500' : 'border-cream-dark/85'
                  }`}
                />
                {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.phone ? 'border-red-500' : 'border-cream-dark/85'
                  }`}
                />
                {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
              </div>

              {/* Order Type Toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground/80">Order Type</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, orderType: 'delivery' }))}
                    className={`py-3 rounded-xl border font-semibold text-sm transition-all flex flex-col items-center ${
                      formData.orderType === 'delivery'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-cream-dark/85 text-foreground/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    <span>🚗 Delivery</span>
                    <span className="text-[10px] font-normal text-foreground/50 mt-0.5">Hyderabad-wide</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, orderType: 'pickup' }))}
                    className={`py-3 rounded-xl border font-semibold text-sm transition-all flex flex-col items-center ${
                      formData.orderType === 'pickup'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-cream-dark/85 text-foreground/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    <span>🏪 Store Pickup</span>
                    <span className="text-[10px] font-normal text-foreground/50 mt-0.5">From Bowrampet</span>
                  </button>
                </div>
              </div>

              {/* Address (conditional) */}
              {formData.orderType === 'delivery' && (
                <div className="flex flex-col gap-1.5 animate-fade-in">
                  <label htmlFor="address" className="text-sm font-semibold text-foreground/80">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter house number, street, landmark, and area in Hyderabad"
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                      errors.address ? 'border-red-500' : 'border-cream-dark/85'
                    }`}
                  />
                  {errors.address && <span className="text-xs text-red-500 font-medium">{errors.address}</span>}
                </div>
              )}

              {/* Payment Method */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground/80">Payment Method</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'COD' }))}
                    className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                      formData.paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-cream-dark/85 text-foreground/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    💵 Cash On Delivery
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'UPI' }))}
                    className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                      formData.paymentMethod === 'UPI'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-cream-dark/85 text-foreground/70 hover:bg-cream-dark/20'
                    }`}
                  >
                    📱 UPI (Pay on Delivery)
                  </button>
                </div>
              </div>

              {/* Special Notes */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className="text-sm font-semibold text-foreground/80">
                  Special Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Please dress chicken into small pieces, or call before arriving."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-primary hover:bg-primary-hover text-cream py-4 rounded-xl font-bold text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Place Order & Send on WhatsApp'}</span>
                <Send size={18} />
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="bg-white p-6 rounded-3xl border border-cream-dark/40 shadow-sm">
              <h2 className="font-display font-bold text-2xl text-primary mb-4">Order Summary</h2>
              
              {/* Fresh Produce Banner */}
              <div className="relative w-full h-24 rounded-2xl overflow-hidden mb-5 border border-cream-dark/30 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80"
                  alt="Farm Fresh Eggs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg tracking-wider drop-shadow-md">
                    Farm Fresh Selection
                  </span>
                </div>
              </div>
              
              {/* Cart Items List */}
              <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-cream-dark/25 last:border-0">
                    {/* Item Name & Details */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm text-primary leading-tight">{item.product.name}</h3>
                      <span className="text-[11px] text-foreground/50 font-medium">
                        ₹{item.product.price} / {item.product.unit}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-cream-dark/30 border border-cream-dark/85 rounded-full px-2 py-0.5 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-0.5 text-primary hover:bg-white rounded-full transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-primary px-1 min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-0.5 text-primary hover:bg-white rounded-full transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="flex flex-col items-end gap-1 shrink-0 min-w-[60px]">
                      <span className="text-sm font-bold text-primary">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-cream-dark/40 pt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary">{formatINR(subtotal)}</span>
                </div>
                
                {formData.orderType === 'delivery' && (
                  <div className="flex justify-between text-foreground/80">
                    <span>Delivery Charges</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#25D366] font-semibold">FREE</span>
                    ) : (
                      <span className="font-semibold text-primary">{formatINR(deliveryCharge)}</span>
                    )}
                  </div>
                )}
                
                <div className="border-t border-cream-dark/40 pt-3 flex justify-between text-base font-bold text-primary">
                  <span>Total Amount</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Alert / Badge */}
            {settings && subtotal < settings.delivery_charge.free_above && formData.orderType === 'delivery' && (
              <div className="bg-[#ff6f00]/5 border border-[#ff6f00]/25 text-[#ff6f00] px-5 py-3.5 rounded-2xl text-xs font-semibold text-center leading-relaxed">
                Add products worth {formatINR(settings.delivery_charge.free_above - subtotal)} more to get FREE delivery!
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && placedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border border-cream-dark/50 flex flex-col items-center gap-6"
            >
              <div className="text-[#25D366]">
                <CheckCircle2 size={64} className="stroke-[1.5]" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-2xl text-primary">Order Placed Successfully!</h3>
                <p className="text-sm text-foreground/60">
                  Your order <strong>{placedOrder.order_number}</strong> has been saved.
                </p>
              </div>

              <div className="bg-cream/50 border border-cream-dark/40 rounded-2xl p-4 w-full text-left flex flex-col gap-2 text-xs">
                <div className="flex justify-between"><span className="font-semibold text-foreground/50">Name:</span> <span className="font-bold text-primary">{placedOrder.customer_name}</span></div>
                <div className="flex justify-between"><span className="font-semibold text-foreground/50">Phone:</span> <span className="font-bold text-primary">{placedOrder.customer_phone}</span></div>
                {placedOrder.order_type === 'delivery' && (
                  <div className="flex flex-col gap-0.5"><span className="font-semibold text-foreground/50">Address:</span> <span className="font-bold text-primary leading-normal">{placedOrder.delivery_address}</span></div>
                )}
                <div className="flex justify-between border-t border-cream-dark/20 pt-2 mt-1"><span className="font-semibold text-foreground/50">Total Amount:</span> <span className="font-bold text-lg text-primary">{formatINR(placedOrder.total_amount)}</span></div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <a
                  href={whatsappUrl}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Send Order Details to WhatsApp</span>
                </a>
                
                <Link
                  href="/"
                  className="text-primary hover:underline text-sm font-semibold"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Go back to Homepage
                </Link>
              </div>

              <p className="text-[10px] text-foreground/50 leading-relaxed">
                You will be redirected to WhatsApp to send your order. If not redirected, please click the button above.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
