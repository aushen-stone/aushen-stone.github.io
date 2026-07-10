/* eslint-disable @next/next/no-img-element -- CMS image domains are managed at runtime. */
import Link from "next/link";
import type { ManagedPage } from "@/types/siteContent";
import { Footer } from "@/app/components/Footer";

export function ManagedPageRenderer({ page }: { page: ManagedPage }) {
  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#1A1C18]">
      {page.blocks.map((block) => {
        if (block.type === "hero") return (
          <section key={block.id} className={`relative min-h-[clamp(30rem,80vh,54rem)] overflow-hidden page-padding-x pb-20 pt-36 ${block.dark ? "bg-[#1A1C18] text-white" : "bg-[#F8F5F1]"}`}>
            {block.imageUrl ? <img src={block.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
            <div className="relative z-10 mx-auto flex min-h-[30rem] max-w-[1600px] flex-col justify-end"><h1 className="max-w-5xl font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.9]">{block.title}</h1>{block.text ? <p className="mt-8 max-w-xl text-base leading-8 opacity-75">{block.text}</p> : null}</div>
          </section>
        );
        if (block.type === "text") return <section key={block.id} className="page-padding-x py-20 sm:py-28"><div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2"><h2 className="font-serif text-[clamp(2.2rem,6vw,5rem)] leading-none">{block.title}</h2><p className="max-w-2xl text-base leading-8 text-gray-600">{block.text}</p></div></section>;
        if (block.type === "cards") return <section key={block.id} className="page-padding-x py-20"><div className="mx-auto max-w-[1400px]"><h2 className="font-serif text-4xl sm:text-5xl">{block.title}</h2><div className="mt-12 grid border-l border-t border-[#D8D2C8] md:grid-cols-3">{block.items.map((item) => <article key={item.title} className="border-b border-r border-[#D8D2C8] bg-white p-7 sm:p-9">{item.imageUrl ? <img src={item.imageUrl} alt="" className="mb-7 aspect-[4/3] w-full object-cover" /> : null}<h3 className="font-serif text-2xl">{item.title}</h3><p className="mt-4 text-sm leading-7 text-gray-600">{item.text}</p></article>)}</div></div></section>;
        if (block.type === "gallery") return <section key={block.id} className="page-padding-x py-20"><div className="mx-auto max-w-[1400px]"><h2 className="font-serif text-4xl">{block.title}</h2><div className="mt-10 grid gap-5 md:grid-cols-2">{block.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover" />)}</div></div></section>;
        return <section key={block.id} className="bg-[#1A1C18] px-6 py-20 text-white"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 md:flex-row md:items-center"><div><h2 className="font-serif text-4xl sm:text-5xl">{block.title}</h2>{block.text ? <p className="mt-3 text-white/60">{block.text}</p> : null}</div><Link href={block.href} className="border border-white/30 px-7 py-4 text-xs uppercase tracking-[0.15em] hover:bg-white hover:text-black">{block.label}</Link></div></section>;
      })}
      <Footer />
    </main>
  );
}
