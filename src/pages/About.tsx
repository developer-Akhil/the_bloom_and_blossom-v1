import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Scissors, Leaf } from 'lucide-react';
import { OptimizedImage } from '../components/common/OptimizedImage';

export function About() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden floral-gradient">
        <div className="container mx-auto px-4 text-center z-10 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-serif text-5xl md:text-7xl font-bold"
          >
            Our Story of <span className="text-bloom-rose italic">Blossom</span>
          </motion.h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
            A mother of two, driven by passion and determination, she set out to redefine the way things are done—turning ideas into reality with perseverance and purpose.
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-gray-50 bg-[url('https://images.unsplash.com/photo-1501004318641-729e8e26bd05?auto=format&fit=crop&q=60&w=1200')] bg-cover bg-center" />
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={<Scissors />} 
            title="Handcrafted" 
            desc="Each piece is meticulously crafted by skilled artisans who care about the fine details." 
          />
          <ValueCard 
            icon={<Leaf />} 
            title="Sustainably Sourced" 
            desc="We use premium fabrics and materials that are kind to you and the environment." 
          />
          <ValueCard 
            icon={<Sparkles />} 
            title="Unique Designs" 
            desc="Our collections are limited and inspired by the changing seasons of nature." 
          />
          <ValueCard 
            icon={<Heart />} 
            title="Made with Love" 
            desc="From the first sketch to the final package, love is infused in every step." 
          />
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-32 space-y-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">Delicate Details, <br/>Deep Intentions.</h2>
            <div className="space-y-6 text-gray-500 font-light leading-relaxed">
              <p>
                At Bloom & Blossom, we curate premium hair accessories designed for comfort, durability, and timeless sophistication. What began as a passion for elegant styling has grown into a brand that celebrates effortless beauty and refined individuality.
              </p>
              <p>
                Each piece is thoughtfully crafted to elevate your everyday look — from subtle classics to statement styles — bringing confidence and grace to every moment. With minimal effort and maximum impact, our collections are made to seamlessly transition you from day to night.
              </p>
            </div>
            <div className="pt-4">
              <OptimizedImage src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=60&w=200&h=80" alt="Founder Signature" className="opacity-40 grayscale" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">Founder, The Bloom & Blossom</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <div className="space-y-4">
              <div className="h-2/3 rounded-[3rem] overflow-hidden">
                <OptimizedImage src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=60&w=400&h=600" alt="Process" className="w-full h-full object-cover" />
              </div>
              <div className="h-1/3 rounded-[3rem] overflow-hidden">
                 <OptimizedImage src="https://images.unsplash.com/photo-1621236304195-06ba064f307a?auto=format&fit=crop&q=60&w=400&h=300" alt="Fabrics" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="h-1/3 rounded-[3rem] overflow-hidden">
                 <OptimizedImage src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=60&w=400&h=300" alt="Ribbons" className="w-full h-full object-cover" />
              </div>
              <div className="h-2/3 rounded-[3rem] overflow-hidden">
                 <OptimizedImage src="https://images.unsplash.com/photo-1606160732449-182746ef7446?auto=format&fit=crop&q=60&w=400&h=600" alt="Final Product" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Join the journey */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h3 className="font-serif text-3xl md:text-4xl font-bold">Follow Our Journey</h3>
          <p className="text-gray-500 font-light">
            We love sharing our process, new drops, and styling inspiration on Instagram. Join our community of over 50k blossom lovers.
          </p>
          <a 
            href="https://www.instagram.com/bows_scrunchies.love/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-bloom-rose font-bold text-xl hover:scale-105 transition-all"
          >
            <span>@bloomandblossom.official</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-bloom-pink/30 space-y-6 hover:-translate-y-2 transition-all">
      <div className="w-14 h-14 bg-bloom-pink rounded-2xl flex items-center justify-center text-bloom-rose shadow-inner">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="font-serif text-xl font-bold">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
}
