import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-bloom-pink/30 floral-gradient">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Get in Touch</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
            Have a question about our collections or need help with a custom order? We're here to help you bloom.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="lg:col-span-1 space-y-8">
            <ContactInfoCard 
              icon={<Phone />} 
              title="Call Us" 
              desc="+91 8076323737" 
              sub="Mon - Sat, 10am - 6pm" 
            />
            <ContactInfoCard 
              icon={<Mail />} 
              title="Email Us" 
              desc="info@bloomandblossom.in" 
              sub="We reply within 24 hours" 
            />
            <ContactInfoCard 
              icon={<MapPin />} 
              title="Visit Us" 
              desc={<>Shivlok Colony Haridwar<br/>Uttarakhand 249403</>} 
              sub="Open for pickup by appt." 
            />
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-bloom-pink/20 border border-gray-50 space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold">Send a Message</h2>
              <p className="text-gray-400 font-light">Our team typically responds to inquiries within one business day.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
                <input className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20 transition-all" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20 transition-all" placeholder="Enter your email" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">How can we help?</label>
                <select className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20 transition-all appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Customised Order Request</option>
                  <option>Shipping & Delivery</option>
                  <option>Returns & Refunds</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-bloom-rose/20 transition-all min-h-[150px]" placeholder="Tell us more..."></textarea>
              </div>
              <div className="md:col-span-2">
                <button className="h-16 px-12 bg-bloom-rose text-white rounded-full font-bold shadow-xl shadow-bloom-rose/20 hover:scale-105 transition-all flex items-center justify-center space-x-3">
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoCard({ icon, title, desc, sub }: { icon: React.ReactNode, title: string, desc: React.ReactNode, sub: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-6">
       <div className="w-12 h-12 bg-bloom-pink rounded-2xl flex items-center justify-center text-bloom-rose">
         {icon}
       </div>
       <div className="space-y-1">
         <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">{title}</h4>
         <p className="text-xl font-bold">{desc}</p>
         <p className="text-xs text-gray-400">{sub}</p>
       </div>
    </div>
  );
}
