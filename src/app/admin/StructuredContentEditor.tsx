"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const labelFor = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase());

const emptyLike = (value: JsonValue | undefined): JsonValue => {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyLike(child)]));
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
};

export function StructuredContentEditor({ value, onChange }: { value: JsonValue; onChange: (value: JsonValue) => void }) {
  return <ValueEditor label="Page content" value={value} onChange={onChange} depth={0} />;
}

function ValueEditor({ label, value, onChange, depth }: { label: string; value: JsonValue; onChange: (value: JsonValue) => void; depth: number }) {
  if (Array.isArray(value)) {
    return (
      <fieldset className="rounded-sm border border-[#D8D2C8] bg-[#F8F5F1]/60 p-4">
        <legend className="px-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-600">{labelFor(label)}</legend>
        <div className="space-y-4">
          {value.map((item, index) => (
            <div key={index} className="rounded-sm border border-[#D8D2C8] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-[0.12em] text-gray-500">Item {index + 1}</span>
                <div className="flex gap-1">
                  <IconButton label="Move up" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}><ArrowUp size={14} /></IconButton>
                  <IconButton label="Move down" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}><ArrowDown size={14} /></IconButton>
                  <IconButton label="Delete item" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></IconButton>
                </div>
              </div>
              <ValueEditor label={`${label} ${index + 1}`} value={item} onChange={(nextItem) => onChange(value.map((current, itemIndex) => itemIndex === index ? nextItem : current))} depth={depth + 1} />
            </div>
          ))}
          <button type="button" onClick={() => onChange([...value, emptyLike(value.at(-1))])} className="inline-flex h-10 items-center gap-2 border border-[#BEB6AA] bg-white px-4 text-xs uppercase tracking-[0.1em]"><Plus size={14} /> Add item</button>
        </div>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className={depth ? "space-y-4" : "space-y-5"}>
        {Object.entries(value).map(([key, child]) => (
          <ValueEditor key={key} label={key} value={child} onChange={(nextChild) => onChange({ ...value, [key]: nextChild })} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /> {labelFor(label)}</label>;
  }

  const stringValue = value === null ? "" : String(value);
  const longText = stringValue.length > 90 || /text|description|quote|lead|intro/i.test(label);
  return (
    <label className="block text-xs uppercase tracking-[0.12em] text-gray-500">
      {labelFor(label)}
      {longText ? (
        <textarea rows={4} value={stringValue} onChange={(event) => onChange(event.target.value)} className="admin-input mt-2 py-3 normal-case tracking-normal" />
      ) : (
        <input type={typeof value === "number" ? "number" : "text"} value={stringValue} onChange={(event) => onChange(typeof value === "number" ? Number(event.target.value) : event.target.value)} className="admin-input mt-2 normal-case tracking-normal" />
      )}
    </label>
  );
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="grid h-8 w-8 place-items-center border border-[#D8D2C8] disabled:opacity-30">{children}</button>;
}
