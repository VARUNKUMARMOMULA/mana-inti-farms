'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { dbService } from '@/lib/dbService';
import { Order } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { Search, MapPin, Phone, Calendar, CreditCard, ShoppingBag, Clock, FileText, ArrowLeft, CheckCircle, Package, Truck, Compass, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { socialLinks } = useStore();
  
  const [orderNumber, setOrderNumber] = useState(searchParams.get('id') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await dbService.trackOrder(orderNumber.trim(), phone.trim());
      setOrder(data);
      if (!data) {
        setError('No order found with the provided details. Please check your Order Number and Phone Number.');
      } else {
        const params = new URLSearchParams();
        params.set('id', orderNumber.trim().toUpperCase());
        params.set('phone', phone.trim());
        router.replace(`/track?${params.toString()}`);
      }
    } catch (err: any) {
      console.error('Error tracking order:', err);
      setError('An error occurred while fetching your order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('id') && searchParams.get('phone')) {
      handleTrack();
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined' || !order) return;

    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!isSupabaseConfigured) return;

    try {
      const { supabase } = require('@/lib/supabase');
      if (!supabase) return;

      const channel = supabase
        .channel(`realtime-order-${order.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${order.id}`,
          },
          (payload: any) => {
            console.log('⚡ Realtime update: order status changed', payload.new);
            setOrder(payload.new as Order);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error('Failed to subscribe to order realtime updates:', err);
    }
  }, [order]);

  const getStepStatus = (step: 'placed' | 'packed' | 'transit' | 'delivery' | 'delivered') => {
    if (!order) return 'upcoming';
    if (order.status === 'cancelled') return 'cancelled';

    const statusOrder = ['placed', 'packed', 'transit', 'delivery', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(step);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'We have received your order.', icon: <CheckCircle size={20} /> },
    { key: 'packed', label: 'Packed', desc: 'Dressed fresh and safely packed.', icon: <Package size={20} /> },
    { key: 'transit', label: 'In Transit', desc: 'Dispatched from Bowrampet Farm.', icon: <Truck size={20} /> },
    { key: 'delivery', label: 'Out for Delivery', desc: 'Rider is on the way to you.', icon: <Compass size={20} /> },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your farm fresh produce!', icon: <Check size={20} /> },
  ] as const;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-body text-left">
      
      <div className="flex flex-col gap-4 mb-8 no-print">
        <button
          onClick={() => router.push('/')}
          className="self-start flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight">Track Your Order</h1>
          <p className="text-sm text-foreground/60">Enter your order details to view live tracking and invoice.</p>
        </div>
      </div>

      <div className="bg-white border border-cream-dark/40 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 no-print">
        <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label htmlFor="order_id" className="text-xs font-bold text-foreground/70">Order Number *</label>
            <input
              type="text"
              id="order_id"
              required
              placeholder="e.g. MIF-10001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase font-bold text-primary"
            />
          </div>

          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label htmlFor="phone_number" className="text-xs font-bold text-foreground/70">Mobile Number *</label>
            <input
              type="text"
              id="phone_number"
              required
              placeholder="e.g. 7981544848"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold text-primary"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-cream py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  <Search size={16} />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="p-12 text-center text-foreground/50">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Searching for your order...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center shadow-sm no-print">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {order && !loading && (
        <div className="flex flex-col gap-8 print-container">
          
          <div className="bg-white border border-cream-dark/40 rounded-3xl p-6 sm:p-8 shadow-sm no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream-dark/20 pb-5 mb-6 gap-3">
              <div>
                <span className="text-xs text-foreground/40 font-bold uppercase tracking-wider">Status:</span>
                <h2 className="font-display font-bold text-2xl text-primary mt-0.5 flex items-center gap-2">
                  <span>{order.status.toUpperCase()}</span>
                  {order.status === 'cancelled' && <span className="text-red-500 text-sm font-bold">(Cancelled)</span>}
                </h2>
              </div>
              {order.estimated_delivery && (
                <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
                  <Clock size={18} className="text-amber-700" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-amber-800/70 font-bold uppercase tracking-wider">Expected Delivery:</span>
                    <span className="text-xs font-bold text-amber-950">{order.estimated_delivery}</span>
                  </div>
                </div>
              )}
            </div>

            {order.status !== 'cancelled' ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4 relative">
                <div className="hidden md:block absolute top-[28px] left-[4%] right-[4%] h-[3px] bg-cream-dark/30 z-0" />
                
                {steps.map((step, idx) => {
                  const status = getStepStatus(step.key);
                  return (
                    <div key={step.key} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 flex-1 relative z-10 w-full text-left md:text-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                        status === 'completed' 
                          ? 'bg-primary border-primary text-cream'
                          : status === 'active'
                          ? 'bg-accent border-accent text-white animate-pulse'
                          : 'bg-white border-cream-dark text-foreground/30'
                      }`}>
                        {step.icon}
                      </div>

                      <div className="flex flex-col md:items-center text-left md:text-center">
                        <span className={`text-sm font-bold ${
                          status === 'active' ? 'text-accent' : status === 'completed' ? 'text-primary' : 'text-foreground/50'
                        }`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-foreground/40 leading-tight md:max-w-[120px]">{step.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-rose-600 font-bold">
                This order was cancelled. Please contact customer support on WhatsApp for refunds or queries.
              </div>
            )}

            {order.admin_notes && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col gap-1 text-left">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Updates from Bowrampet Farm:</span>
                <p className="text-sm text-foreground/80 italic">"{order.admin_notes}"</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-cream-dark/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8 relative invoice-card">
            
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-cream-dark/20 pb-6 gap-6">
              <div className="text-left">
                <h3 className="font-display font-bold text-2xl text-primary">Mana Inti Farms</h3>
                <span className="text-xs text-foreground/50">Bowrampet, Hyderabad, Telangana</span>
                <span className="text-xs text-foreground/50 block">Phone: +91 7981544848</span>
              </div>
              <div className="text-left sm:text-right flex flex-col gap-0.5">
                <h4 className="font-bold text-lg text-primary">INVOICE / RECEIPT</h4>
                <span className="text-sm font-bold text-accent">Order #: {order.order_number}</span>
                <span className="text-xs text-foreground/50">Date: {formatDate(order.created_at)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left border-b border-cream-dark/20 pb-6">
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-primary">Customer Details</h5>
                <span className="font-semibold text-sm">{order.customer_name}</span>
                <span className="text-xs text-foreground/70 flex items-center gap-1.5">
                  <Phone size={14} className="text-foreground/40" />
                  <span>+91 {order.customer_phone}</span>
                </span>
                <span className="text-xs text-foreground/70 flex items-start gap-1.5 leading-normal max-w-sm">
                  <MapPin size={14} className="text-foreground/40 shrink-0 mt-0.5" />
                  <span>{order.delivery_address}</span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-primary">Order Info</h5>
                <div className="flex flex-col gap-1 text-xs text-foreground/70">
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span className="font-semibold text-foreground">{order.order_type === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-foreground">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Status:</span>
                    <span className="font-bold text-primary uppercase">{order.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <h5 className="font-bold text-xs uppercase tracking-wider text-primary mb-3">Items Ordered</h5>
              <div className="border border-cream-dark/30 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream/35 border-b border-cream-dark/20 text-xs font-bold text-primary">
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-center">Unit Price</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark/15 text-foreground/80">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3.5 px-4 font-medium text-primary text-left">
                           {item.name}
                          <span className="text-xs text-foreground/40 block">Unit: {item.unit}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium">{formatINR(item.price)}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-primary">{item.quantity}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-primary">{formatINR(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-t border-cream-dark/20 pt-6">
              <div className="flex-grow text-left max-w-md">
                {order.notes && (
                  <div className="p-3.5 bg-cream/15 rounded-xl border border-cream-dark/30">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Customer Notes:</span>
                    <p className="text-xs text-foreground/75 italic mt-1">"{order.notes}"</p>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-72 shrink-0 flex flex-col gap-2 text-left">
                <div className="flex justify-between text-sm text-foreground/60">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">{formatINR(order.total_amount - order.delivery_charge)}</span>
                </div>
                {order.order_type === 'delivery' && (
                  <div className="flex justify-between text-sm text-foreground/60 border-b border-cream-dark/15 pb-2">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-foreground">{formatINR(order.delivery_charge)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-primary pt-1">
                  <span>Grand Total:</span>
                  <span>{formatINR(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-cream-dark/15 pt-6 no-print">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 bg-white border border-cream-dark/60 hover:bg-cream-dark/20 text-primary font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={16} />
                <span>Print Invoice</span>
              </button>
              
              {(() => {
                const whatsappSocial = socialLinks?.find(s => s.icon_name.toLowerCase() === 'whatsapp');
                const whatsappNumber = whatsappSocial ? whatsappSocial.url.replace('https://wa.me/', '').split('?')[0] : '917981544848';
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Mana%20Inti%20Farms,%20I%20have%20a%20query%20regarding%20my%20order%20${order.order_number}`;
                const isWhatsappEnabled = whatsappSocial ? whatsappSocial.enabled : true;

                if (!isWhatsappEnabled) return null;

                return (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Phone size={16} />
                    <span>Support on WhatsApp</span>
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackClient() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center font-body">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

function RefreshCw({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
