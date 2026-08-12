"use client";

import { Plus, Trash2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { getProductDisplayName } from "@/data/product_display_names";
import type { SeoLandingPage } from "@/types/seoLandingPage";

const id = () => crypto.randomUUID();

export default function SeoLandingPageEditor({ value, onChange }: { value: SeoLandingPage; onChange: (value: SeoLandingPage) => void }) {
  const update = <K extends keyof SeoLandingPage>(key: K, next: SeoLandingPage[K]) => onChange({ ...value, [key]: next });
  return (
    <section className="space-y-6 border border-[#D8D2C8] bg-[#F8F5F1] p-5">
      <div><h3 className="font-serif text-2xl">SEO and page content</h3><p className="mt-1 text-xs text-gray-500">Products appear before the long-form content. Leave product selection empty to link automatically by material or application.</p></div>
      <Field label="Meta title"><input value={value.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} className="admin-input" required maxLength={70} /><Count value={value.metaTitle} recommended="50–60" /></Field>
      <Field label="Meta description"><textarea rows={3} value={value.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} className="admin-input py-3" required maxLength={170} /><Count value={value.metaDescription} recommended="140–160" /></Field>
      <Field label="Melbourne / Victoria service area"><input value={value.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} className="admin-input" /></Field>
      <Field label="Products shown on this page">
        <select multiple value={value.productSlugs} onChange={(e) => update("productSlugs", Array.from(e.currentTarget.selectedOptions, (option) => option.value))} className="admin-input min-h-48 py-2">
          {PRODUCTS.toSorted((a,b) => getProductDisplayName(a).localeCompare(getProductDisplayName(b))).map((product) => <option key={product.slug} value={product.slug}>{getProductDisplayName(product)} · {product.materialName}</option>)}
        </select>
        <p className="mt-2 text-xs text-gray-500">Use Ctrl/Cmd to select multiple. Clear all selections for automatic category matching.</p>
      </Field>
      <Repeatable title="Content sections" addLabel="Add section" items={value.sections} onAdd={() => update("sections", [...value.sections, { id: id(), heading: "", body: "" }])} onRemove={(index) => update("sections", value.sections.filter((_, i) => i !== index))} render={(item,index) => <><input aria-label={`Section ${index+1} heading`} value={item.heading} onChange={(e) => update("sections", value.sections.map((entry,i) => i===index ? {...entry,heading:e.target.value}:entry))} className="admin-input" placeholder="Section heading" /><textarea aria-label={`Section ${index+1} body`} rows={7} value={item.body} onChange={(e) => update("sections", value.sections.map((entry,i) => i===index ? {...entry,body:e.target.value}:entry))} className="admin-input py-3" placeholder="Section text" /></>} />
      <Repeatable title="FAQs" addLabel="Add FAQ" items={value.faqs} onAdd={() => update("faqs", [...value.faqs, { id: id(), question: "", answer: "" }])} onRemove={(index) => update("faqs", value.faqs.filter((_, i) => i !== index))} render={(item,index) => <><input aria-label={`FAQ ${index+1} question`} value={item.question} onChange={(e) => update("faqs", value.faqs.map((entry,i) => i===index ? {...entry,question:e.target.value}:entry))} className="admin-input" placeholder="Question" /><textarea aria-label={`FAQ ${index+1} answer`} rows={4} value={item.answer} onChange={(e) => update("faqs", value.faqs.map((entry,i) => i===index ? {...entry,answer:e.target.value}:entry))} className="admin-input py-3" placeholder="Answer" /></>} />
      <Repeatable title="Explore More links" addLabel="Add link" items={value.exploreLinks} onAdd={() => update("exploreLinks", [...value.exploreLinks, { id: id(), label: "", href: "/products/" }])} onRemove={(index) => update("exploreLinks", value.exploreLinks.filter((_, i) => i !== index))} render={(item,index) => <div className="grid gap-3 sm:grid-cols-2"><input aria-label={`Link ${index+1} label`} value={item.label} onChange={(e) => update("exploreLinks", value.exploreLinks.map((entry,i) => i===index ? {...entry,label:e.target.value}:entry))} className="admin-input" placeholder="Link label" /><input aria-label={`Link ${index+1} URL`} value={item.href} onChange={(e) => update("exploreLinks", value.exploreLinks.map((entry,i) => i===index ? {...entry,href:e.target.value}:entry))} className="admin-input" placeholder="/materials/bluestone/" /></div>} />
    </section>
  );
}

function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.12em] text-gray-500">{label}</span>{children}</label>; }
function Count({value,recommended}:{value:string;recommended:string}) { return <span className="mt-1 block text-right text-[11px] text-gray-500">{value.length} characters · recommended {recommended}</span>; }
function Repeatable<T>({title,addLabel,items,onAdd,onRemove,render}:{title:string;addLabel:string;items:T[];onAdd:()=>void;onRemove:(index:number)=>void;render:(item:T,index:number)=>React.ReactNode}) { return <div><div className="mb-3 flex items-center justify-between"><h4 className="font-serif text-xl">{title}</h4><button type="button" onClick={onAdd} className="inline-flex items-center gap-1 border px-3 py-2 text-xs"><Plus size={14}/>{addLabel}</button></div><div className="space-y-4">{items.map((item,index)=><div key={(item as {id?:string}).id ?? index} className="space-y-3 border border-[#D8D2C8] bg-white p-4">{render(item,index)}<button type="button" onClick={()=>onRemove(index)} className="inline-flex items-center gap-1 text-xs text-red-700"><Trash2 size={13}/>Remove</button></div>)}</div></div>; }
