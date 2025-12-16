"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight, Check } from "lucide-react";

// === 组件: 身份切换器 (The Identity Toggle) ===
function IdentityToggle({ active, onChange }: { active: 'homeowner' | 'pro', onChange: (val: 'homeowner' | 'pro') => void }) {
  return (
    <div className="flex flex-col gap-4 mb-12">
      <span className="text-xs uppercase tracking-widest text-gray-500">I am a...</span>
      <div className="flex gap-6">
        <button 
          onClick={() => onChange('homeowner')}
          className={`group flex items-center gap-3 text-lg md:text-2xl font-serif transition-colors ${active === 'homeowner' ? 'text-[#1a1c18]' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${active === 'homeowner' ? 'border-[#1a1c18] bg-[#1a1c18] text-white' : 'border-gray-300'}`}>
            {active === 'homeowner' && <Check size={14} />}
          </span>
          Homeowner
        </button>

        <button 
          onClick={() => onChange('pro')}
          className={`group flex items-center gap-3 text-lg md:text-2xl font-serif transition-colors ${active === 'pro' ? 'text-[#1a1c18]' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${active === 'pro' ? 'border-[#1a1c18] bg-[#1a1c18] text-white' : 'border-gray-300'}`}>
             {active === 'pro' && <Check size={14} />}
          </span>
          Architect / Builder
        </button>
      </div>
    </div>
  );
}

// === 组件: 极简输入框 (Underline Input) ===
function InputField({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) {
  return (
    <div className="group relative">
      <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-[#1a1c18] transition-colors">
        {label}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-gray-200 py-4 text-lg text-[#1a1c18] placeholder:text-gray-200 focus:outline-none focus:border-[#1a1c18] transition-colors font-serif"
      />
    </div>
  );
}

export default function ContactPage() {
  const [userType, setUserType] = useState<'homeowner' | 'pro'>('homeowner');

  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      <Navbar />

      {/* Global Noise Overlay (Consistent with Story Page) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-40 pb-24 relative z-10">
        
        {/* Header Title */}
        <div className="mb-24 md:mb-32">
           <h1 className="font-serif text-6xl md:text-8xl text-[#1a1c18] leading-[0.9]">
             Start the <br/> <span className="italic text-gray-400">Conversation.</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start">
          
          {/* === LEFT COLUMN: The Invitation (Info) === */}
          <div className="lg:col-span-4 lg:sticky lg:top-40">
             
             {/* Info Block */}
             <div className="space-y-12">
                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <MapPin size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Showroom</span>
                   </div>
                   <p className="font-serif text-xl text-gray-800 leading-relaxed">
                     123 Architectural Avenue,<br/>
                     Bayside, Melbourne VIC 3186
                   </p>
                   <a href="#" className="inline-block mt-4 text-xs uppercase tracking-widest text-gray-400 border-b border-gray-300 pb-1 hover:text-[#1a1c18] hover:border-[#1a1c18] transition-all">
                      Get Directions
                   </a>
                </div>

                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <Clock size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Open Hours</span>
                   </div>
                   <p className="text-sm text-gray-600 leading-loose">
                     Mon — Fri: 9:00am — 5:00pm<br/>
                     Sat: 10:00am — 4:00pm<br/>
                     Sun: By Appointment
                   </p>
                </div>

                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <Phone size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Contact</span>
                   </div>
                   <p className="text-sm text-gray-600 leading-loose">
                     (03) 9555 1234<br/>
                     hello@aushenstone.com.au
                   </p>
                </div>
             </div>

             {/* The "Map" Visual (Stylized Abstract Block) */}
             <div className="mt-16 w-full aspect-square bg-gray-200 grayscale opacity-80 overflow-hidden relative group cursor-pointer">
                {/* Placeholder Map Image */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                  alt="Map Location" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-[#1a1c18]/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute center inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight size={20} className="text-[#1a1c18] group-hover:-rotate-45 transition-transform duration-300" />
                   </div>
                </div>
             </div>
          </div>

          {/* === RIGHT COLUMN: The Letter (Form) === */}
          <div className="lg:col-span-8 bg-white p-8 md:p-16 shadow-sm border border-gray-100">
             
             {/* 1. Identity Selector */}
             <IdentityToggle active={userType} onChange={setUserType} />

             {/* 2. The Form Fields */}
             <form className="space-y-12 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <InputField label="First Name" placeholder="John" />
                   <InputField label="Last Name" placeholder="Doe" />
                </div>
                
                <InputField label="Email Address" type="email" placeholder="john@example.com" />
                
                <InputField label="Phone Number" type="tel" placeholder="0400 000 000" />

                {/* Conditional Field based on user type */}
                <div className="group relative">
                   <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                     {userType === 'homeowner' ? 'Tell us about your dream project' : 'Project Scope / Estimated Volume'}
                   </label>
                   <textarea 
                     rows={4}
                     className="w-full bg-transparent border-b border-gray-200 py-4 text-lg text-[#1a1c18] placeholder:text-gray-200 focus:outline-none focus:border-[#1a1c18] transition-colors font-serif resize-none"
                     placeholder={userType === 'homeowner' ? "I'm looking for bluestone pavers for my new pool area..." : "Commercial project in CBD, approx 500m2..."}
                   ></textarea>
                </div>

                {/* 3. Submit Button */}
                <div className="pt-8 flex justify-end">
                   <button className="bg-[#1a1c18] text-white px-12 py-5 uppercase tracking-[0.25em] text-xs hover:bg-[#3B4034] transition-colors shadow-xl shadow-gray-900/10 flex items-center gap-4 group">
                      Send Message
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                   </button>
                </div>
             </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
