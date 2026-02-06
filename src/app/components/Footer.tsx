// components/Footer.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export function Footer() {

  // Footer 元素专用的微动效果
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const footerItemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } },
  };

  return (
    <footer className="bg-[#1a1c18] text-[#F8F5F1] pt-16 sm:pt-24 pb-12 sm:pb-16 page-padding-x overflow-hidden">

      {/* Top Section: Grid Layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // 露出20%时触发
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 md:gap-8 mb-16 sm:mb-24"
      >

        {/* Column 1: Brand & Address */}
        <motion.div variants={footerItemVariant} className="md:col-span-4 space-y-8">
          <img
            src="/AushenLogo.webp"
            alt="Aushen"
            className="h-10 w-auto brightness-0 invert opacity-90"
          />
          <div className="text-sm leading-relaxed text-white/60 pt-2">
            <p>123 Architectural Ave,</p>
            <p>Melbourne, VIC 3000</p>
            <p className="mt-4">+61 (03) 9000 0000</p>
            <p>hello@aushen.com.au</p>
          </div>
        </motion.div>

        {/* Column 2: Navigation Links */}
        <motion.div variants={footerItemVariant} className="md:col-span-2 space-y-6">
          <h4 className="font-serif text-lg text-white">Explore</h4>
          <ul className="space-y-4 text-sm text-white/60">
            {[
              { label: "Products", href: "/products" },
              { label: "Projects", href: "/projects" },
              { label: "Services", href: "/services" },
              { label: "Our Story", href: "/about" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-white transition-colors block w-max group">
                  {item.label}
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-px bg-white/50"></span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Utility Links */}
        <motion.div variants={footerItemVariant} className="md:col-span-2 space-y-6">
          <h4 className="font-serif text-lg text-white">Company</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li>
              <Link href="/contact" className="hover:text-white transition-colors block w-max">
                Contact
              </Link>
            </li>
            <li>
              <a
                href="mailto:hello@aushen.com.au?subject=Careers%20at%20Aushen"
                className="hover:text-white transition-colors block w-max"
              >
                Careers
              </a>
            </li>
            <li>
              <span className="text-white/40 block w-max">Privacy Policy (On Request)</span>
            </li>
            <li>
              <span className="text-white/40 block w-max">Terms of Use (On Request)</span>
            </li>
          </ul>
        </motion.div>

        {/* Column 4: Newsletter */}
        <motion.div variants={footerItemVariant} className="md:col-span-4 flex flex-col justify-between h-full gap-6">
          <div>
            <h4 className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight mb-2">
              Stay Inspired.
            </h4>
            <p className="text-white/40 text-sm mb-8">
              Join our community of architects and designers.
            </p>
          </div>

          <form className="group relative">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-white/20 py-4 text-base sm:text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white hover:text-black rounded-full transition-all duration-300"
            >
              <ArrowUpRight size={20} />
            </button>
          </form>
        </motion.div>

      </motion.div>

      {/* Middle Section: Socials & Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        viewport={{ once: true }}
        className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end pt-8 sm:pt-12"
      >
        <div className="flex gap-6 mb-8 md:mb-0">
          {[
            { Icon: Instagram, href: "https://www.instagram.com" },
            { Icon: Facebook, href: "https://www.facebook.com" },
            { Icon: Linkedin, href: "https://www.linkedin.com" },
            { Icon: Twitter, href: "https://x.com" },
          ].map(({ Icon, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all duration-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="text-white/30 text-xs uppercase tracking-widest flex gap-8">
          <span>© 2024 Aushen Stone</span>
        </div>
      </motion.div>

    </footer>
  );
}
