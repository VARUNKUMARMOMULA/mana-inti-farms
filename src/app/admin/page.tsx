'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from '@/lib/dbService';
import { Order, DashboardStats } from '@/lib/types';
import { formatINR, formatDate } from '@/lib/utils';
import { ShoppingBag, TrendingUp, Clock, FileText, Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Package, Truck, Compass, Printer, Calendar, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ orderCount: 0, revenue: 0, avgOrderValue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Print State
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  // Edit fields for expanded order
  const [estDelivery, setEstDelivery] = useState('');
  const [admNotes, setAdmNotes] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        dbService.getOrders(),
        dbService.getDashboardStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      await fetchData();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update status');
    }
  };

  const handleSaveTrackingDetails = async (orderId: string, currentStatus: Order['status']) => {
    setSavingId(orderId);
    try {
      await dbService.updateOrderStatus(orderId, currentStatus, estDelivery, admNotes);
      await fetchData();
      alert('Tracking details updated successfully!');
    } catch (err) {
      console.error('Error saving tracking details:', err);
      alert('Failed to save tracking details');
    } finally {
      setSavingId(null);
    }
  };

  const toggleExpandOrder = (order: Order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(order.id);
      setEstDelivery(order.estimated_delivery || '');
      setAdmNotes(order.admin_notes || '');
    }
  };

  const triggerPrint = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Filter and Search orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'transit':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivery':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'placed': return 'Placed 📝';
      case 'packed': return 'Packed 📦';
      case 'transit': return 'In Transit 🚚';
      case 'delivery': return 'Out for Delivery 🛵';
      case 'delivered': return 'Delivered ✅';
      case 'cancelled': return 'Cancelled ❌';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-8 font-body">
      
      {/* 1. Page Header */}
      <div className="no-print">
        <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-foreground/60">Manage orders, update live delivery tracking, and print invoices.</p>
      </div>

      {/* 2. Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
        {loading && orders.length === 0 ? (
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white h-28 rounded-2xl animate-pulse border border-cream-dark/25" />
          ))
        ) : (
          <>
            {/* Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Total Revenue</span>
                <span className="text-2xl font-display font-bold text-primary">{formatINR(stats.revenue)}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
            </div>

            {/* Orders Count */}
            <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Total Orders</span>
                <span className="text-2xl font-display font-bold text-primary">{stats.orderCount}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <ShoppingBag size={24} />
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Active Orders</span>
                <span className="text-2xl font-display font-bold text-primary">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Clock size={24} className="animate-pulse" />
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Avg Order Value</span>
                <span className="text-2xl font-display font-bold text-primary">{formatINR(stats.avgOrderValue)}</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <FileText size={24} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Orders List Section */}
      <div className="bg-white border border-cream-dark/40 rounded-3xl shadow-sm overflow-hidden no-print">
        
        {/* Controls Header */}
        <div className="p-6 border-b border-cream-dark/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <h2 className="font-display font-bold text-xl text-primary shrink-0">Customer Orders</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-3xl md:justify-end">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, order #..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/20 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="placed">Placed 📝</option>
              <option value="packed">Packed 📦</option>
              <option value="transit">In Transit 🚚</option>
              <option value="delivery">Out for Delivery 🛵</option>
              <option value="delivered">Delivered ✅</option>
              <option value="cancelled">Cancelled ❌</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {loading && orders.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <span>No orders found matching the filters.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-cream/40 text-xs font-bold uppercase tracking-wider text-foreground/50 border-b border-cream-dark/25">
                  <th className="py-4 px-6">Order Number</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/20 text-sm text-foreground/80">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className={`hover:bg-cream/20 transition-colors ${isExpanded ? 'bg-cream/10' : ''}`}>
                        {/* Order Number */}
                        <td className="py-4 px-6 font-bold text-primary">
                          <button
                            onClick={() => toggleExpandOrder(order)}
                            className="flex items-center gap-2 hover:text-primary-hover cursor-pointer"
                          >
                            <span>{order.order_number}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 font-medium text-xs">
                          {formatDate(order.created_at)}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold">{order.customer_name}</span>
                            <span className="text-xs text-foreground/50">{order.customer_phone}</span>
                          </div>
                        </td>

                        {/* Order Type */}
                        <td className="py-4 px-6 font-semibold text-xs">
                          {order.order_type === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6 font-bold text-primary">
                          {formatINR(order.total_amount)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>

                        {/* Actions (One-Click Stepper Shortcuts) */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => triggerPrint(order)}
                              className="p-1.5 text-primary hover:bg-cream-dark/40 rounded-lg border border-cream-dark/60 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer size={16} />
                            </button>
                            
                            {order.status === 'placed' && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'packed')}
                                className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                              >
                                Pack 📦
                              </button>
                            )}

                            {order.status === 'packed' && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'transit')}
                                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                              >
                                Dispatch 🚚
                              </button>
                            )}

                            {order.status === 'transit' && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'delivery')}
                                className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                Out for Delivery 🛵
                              </button>
                            )}

                            {order.status === 'delivery' && (
                              <button
                                onClick={() => handleStatusChange(order.id, 'delivered')}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                              >
                                Complete ✅
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Order Details Row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="p-0 bg-cream/5">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-8 py-6 border-b border-cream-dark/25 overflow-hidden text-left"
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  
                                  {/* Left: Shipping & Details */}
                                  <div className="lg:col-span-4 flex flex-col gap-3">
                                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider border-b border-cream-dark pb-2">Order Information</h4>
                                    
                                    <div className="flex flex-col text-xs gap-1.5 text-foreground/80">
                                      <div>
                                        <span className="font-bold text-foreground/50 mr-1">Customer Name:</span>
                                        <span className="font-medium">{order.customer_name}</span>
                                      </div>
                                      <div>
                                        <span className="font-bold text-foreground/50 mr-1">Phone Number:</span>
                                        <span>+91 {order.customer_phone}</span>
                                      </div>
                                      <div>
                                        <span className="font-bold text-foreground/50 mr-1">Payment Method:</span>
                                        <span className="font-semibold text-primary">{order.payment_method}</span>
                                      </div>
                                      <div>
                                        <span className="font-bold text-foreground/50 mr-1">Delivery Fee:</span>
                                        <span>{formatINR(order.delivery_charge)}</span>
                                      </div>
                                      {order.order_type === 'delivery' ? (
                                        <div className="flex flex-col gap-0.5 mt-1">
                                          <span className="font-bold text-foreground/50">Delivery Address:</span>
                                          <span className="leading-normal bg-white p-2.5 rounded-lg border border-cream-dark/50 text-xs">{order.delivery_address}</span>
                                        </div>
                                      ) : (
                                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg text-center mt-1">🏪 Customer Self-Pickup</span>
                                      )}
                                    </div>
                                    
                                    {order.notes && (
                                      <div className="flex flex-col gap-1 mt-2 p-3 bg-amber-50/40 border border-amber-200/50 rounded-xl">
                                        <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Customer Instructions:</span>
                                        <span className="text-xs text-foreground/80 italic">"{order.notes}"</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Center: Ordered Items */}
                                  <div className="lg:col-span-4 flex flex-col gap-3">
                                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider border-b border-cream-dark pb-2">Items Ordered</h4>
                                    <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-cream-dark/30 max-h-[220px] overflow-y-auto">
                                      {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-cream-dark/15 last:border-0">
                                          <div className="flex flex-col text-left">
                                            <span className="font-bold text-primary">{item.name}</span>
                                            <span className="text-[10px] text-foreground/50">{item.quantity} x {formatINR(item.price)}/{item.unit}</span>
                                          </div>
                                          <span className="font-bold text-primary">{formatINR(item.total)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Right: Live Tracking Editor & Controls */}
                                  <div className="lg:col-span-4 flex flex-col gap-3 bg-cream/30 p-4 rounded-2xl border border-cream-dark/50">
                                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider border-b border-cream-dark/40 pb-2">Live Tracking Panel</h4>
                                    
                                    {/* 1-Click Status Stepper */}
                                    <div className="flex flex-col gap-1.5">
                                      <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Update Lifecycle Status:</span>
                                      <div className="grid grid-cols-2 gap-1.5">
                                        {(['placed', 'packed', 'transit', 'delivery', 'delivered', 'cancelled'] as const).map((st) => (
                                          <button
                                            key={st}
                                            type="button"
                                            onClick={() => handleStatusChange(order.id, st)}
                                            className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                              order.status === st
                                                ? 'bg-primary border-primary text-cream shadow-sm'
                                                : 'bg-white border-cream-dark hover:bg-cream-dark/30 text-foreground/70'
                                            }`}
                                          >
                                            {st.toUpperCase()}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Expected Delivery Time */}
                                    <div className="flex flex-col gap-1 mt-1">
                                      <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Estimated Delivery Time:</label>
                                      <input
                                        type="text"
                                        value={estDelivery}
                                        onChange={(e) => setEstDelivery(e.target.value)}
                                        placeholder="e.g. Today by 6:00 PM"
                                        className="w-full px-3 py-1.5 rounded-lg border border-cream-dark bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                    </div>

                                    {/* Admin Notes */}
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Delivery Notes / Rider Info:</label>
                                      <textarea
                                        value={admNotes}
                                        onChange={(e) => setAdmNotes(e.target.value)}
                                        placeholder="e.g. Rider Rajesh (9876543210) assigned."
                                        rows={2}
                                        className="w-full px-3 py-1.5 rounded-lg border border-cream-dark bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-normal"
                                      />
                                    </div>

                                    {/* Save Button */}
                                    <button
                                      onClick={() => handleSaveTrackingDetails(order.id, order.status)}
                                      disabled={savingId === order.id}
                                      className="mt-1.5 w-full bg-accent hover:bg-accent-hover text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                      {savingId === order.id ? (
                                        <RefreshCw size={12} className="animate-spin" />
                                      ) : (
                                        <Save size={12} />
                                      )}
                                      <span>Save Live Tracking Details</span>
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>

                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- HIDDEN PRINT-ONLY INVOICE COMPONENT --- */}
      {printOrder && (
        <div className="hidden print:block print-container w-full text-left p-6 font-body bg-white">
          <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
            <div>
              <h3 className="font-bold text-2xl text-black">Mana Inti Farms</h3>
              <p className="text-xs text-gray-500">Bowrampet, Hyderabad, Telangana</p>
              <p className="text-xs text-gray-500">Phone: +91 7981544848</p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-xl text-black">INVOICE / RECEIPT</h4>
              <p className="text-sm font-bold text-gray-800">Order #: {printOrder.order_number}</p>
              <p className="text-xs text-gray-500">Date: {formatDate(printOrder.created_at)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-b border-gray-300 pb-6 mb-6">
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-1">Customer Details</h5>
              <p className="font-semibold text-sm">{printOrder.customer_name}</p>
              <p className="text-xs text-gray-700">Phone: +91 {printOrder.customer_phone}</p>
              <p className="text-xs text-gray-700 leading-normal max-w-sm">Address: {printOrder.delivery_address}</p>
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-1">Order Info</h5>
              <p className="text-xs text-gray-700">Order Type: {printOrder.order_type === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</p>
              <p className="text-xs text-gray-700">Payment Method: {printOrder.payment_method}</p>
              <p className="text-xs text-gray-700">Status: <span className="font-bold uppercase">{printOrder.status}</span></p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">Items Ordered</h5>
            <table className="w-full text-sm border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-xs font-bold text-black">
                  <th className="py-2.5 px-4 text-left border border-gray-300">Product</th>
                  <th className="py-2.5 px-4 text-center border border-gray-300">Unit Price</th>
                  <th className="py-2.5 px-4 text-center border border-gray-300">Quantity</th>
                  <th className="py-2.5 px-4 text-right border border-gray-300">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 text-gray-800">
                {printOrder.items.map((item) => (
                  <tr key={item.id} className="border border-gray-300">
                    <td className="py-2.5 px-4 text-left border border-gray-300">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-[10px] text-gray-500 block">Unit: {item.unit}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center border border-gray-300">{formatINR(item.price)}</td>
                    <td className="py-2.5 px-4 text-center border border-gray-300 font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-4 text-right border border-gray-300 font-bold">{formatINR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-start gap-8 border-t border-gray-300 pt-6">
            <div className="flex-grow text-left">
              {printOrder.notes && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-300 text-xs text-gray-600 italic">
                  <strong>Customer Instructions:</strong> "{printOrder.notes}"
                </div>
              )}
            </div>
            <div className="w-64 text-right flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal:</span>
                <span>{formatINR(printOrder.total_amount - printOrder.delivery_charge)}</span>
              </div>
              {printOrder.order_type === 'delivery' && (
                <div className="flex justify-between text-xs text-gray-500 border-b border-gray-200 pb-1.5">
                  <span>Delivery Charge:</span>
                  <span>{formatINR(printOrder.delivery_charge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-black pt-1">
                <span>Grand Total:</span>
                <span>{formatINR(printOrder.total_amount)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 border-t border-gray-200 pt-6 text-center text-[10px] text-gray-400">
            Thank you for purchasing organic produce from Mana Inti Farms! 🌾🐔
          </div>
        </div>
      )}

    </div>
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
