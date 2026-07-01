'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export default function ContactClient() {
  const { settings, homepageContent, socialLinks } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone1 = settings?.contact_details.phone_1 || '7981544848';
  const phone2 = settings?.contact_details.phone_2 || '7995986012';
  const emailAddress = settings?.contact_details.email || 'sampyadav12@gmail.com';
  const physicalAddress = settings?.contact_details.address || 'Bowrampet, Hyderabad, Telangana';
  const timings = settings?.business_hours.timings || '6:00 AM - 9:00 PM';
  const days = settings?.business_hours.days || 'Monday - Sunday';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit message');
      }
      
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('Failed to send your message. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappSocial = socialLinks?.find(s => s.icon_name.toLowerCase() === 'whatsapp');
  const whatsappUrl = whatsappSocial?.url || `https://wa.me/917981544848?text=${encodeURIComponent(
    'Hello Mana Inti Farms, I have an inquiry about your country chicken/eggs.'
  )}`;

  return (
    <div className="py-12 sm:py-16 font-body text-left">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-accent font-semibold uppercase tracking-widest text-xs">Get in Touch</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-primary mt-2 mb-4 tracking-tight">
          Contact Mana Inti Farms
        </h1>
        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          Have questions about our free-range farm, bulk egg orders, or delivery zones? We are here to help you. Reach out via the form, phone, or WhatsApp.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* LEFT: Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <h2 className="font-display font-bold text-2xl text-primary">Our Contact Info</h2>
          
          {/* Farm Scenic Image */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-cream-dark/40 shadow-sm">
            <Image
              src={homepageContent?.contact_image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80"}
              alt="Mana Inti Farms pastures"
              fill
              className="object-cover hover:scale-103 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Phone */}
          <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-cream-dark/20 rounded-xl text-primary">
              <Phone size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1">Call Us</span>
              <a href={`tel:${phone1}`} className="font-bold text-primary hover:underline">+91 {phone1}</a>
              <a href={`tel:${phone2}`} className="font-bold text-primary hover:underline">+91 {phone2}</a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-cream-dark/20 rounded-xl text-primary">
              <Mail size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1">Email Us</span>
              <a href={`mailto:${emailAddress}`} className="font-bold text-primary hover:underline break-all">{emailAddress}</a>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-cream-dark/20 rounded-xl text-primary">
              <MapPin size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1">Our Farm Location</span>
              <span className="font-bold text-primary leading-normal">{physicalAddress}</span>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-6 rounded-2xl border border-cream-dark/40 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-cream-dark/20 rounded-xl text-primary">
              <Clock size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-1">Business Hours</span>
              <span className="font-bold text-primary">{days}</span>
              <span className="text-sm text-foreground/60">{timings}</span>
            </div>
          </div>

          {/* Quick WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            <span>Quick Help via WhatsApp</span>
          </a>
        </div>

        {/* RIGHT: Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-cream-dark/40 shadow-sm">
          <h2 className="font-display font-bold text-2xl text-primary mb-6">Send Us a Message</h2>
          
          {submitted ? (
            <div className="bg-[#1e3f20]/5 border border-primary/20 text-primary p-8 rounded-2xl text-center flex flex-col items-center gap-4">
              <div className="text-primary bg-primary/10 p-3 rounded-full">
                <Send size={32} />
              </div>
              <h3 className="font-display font-bold text-xl">Message Sent!</h3>
              <p className="text-sm text-foreground/70 leading-relaxed max-w-md">
                Thank you for contacting Mana Inti Farms. We have received your inquiry and will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-primary hover:underline text-sm font-bold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground/80">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground/80">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Inquiry about country eggs / bulk order"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-foreground/80">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary hover:bg-primary-hover text-cream py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                <Send size={16} />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Embedded Google Maps (Full Width) */}
      <section className="w-full h-96 border-t border-cream-dark/40 shadow-inner">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15214.730303867623!2d78.36979607873499!3d17.568453412571227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8ebdf4ea9999%3A0xe5a3c106b3a0cc52!2sBowrampet%2C%20Hyderabad%2C%20Telangana%20500043!5e0!3m2!1sen!2sin!4v1719600000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mana Inti Farms Interactive Map"
        />
      </section>

    </div>
  );
}
