"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

type FilterOption = {
  name: string;
  slug: string;
};

type FilterState = {
  material: string[];
  application: string[];
  tone: string[];
};

type ProductSidebarProps = {
  materials: FilterOption[];
  applications: FilterOption[];
  tones: FilterOption[];
  selected: FilterState;
  onToggle: (group: keyof FilterState, slug: string) => void;
  onClear: () => void;
};

export function ProductSidebar({
  materials,
  applications,
  tones,
  selected,
  onToggle,
  onClear,
}: ProductSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "material",
    "application",
    "tone",
  ]);

  const sections = useMemo(
    () =>
      [
        { id: "material", name: "Material", options: materials },
        { id: "application", name: "Application", options: applications },
        { id: "tone", name: "Color Tone", options: tones },
      ].filter((section) => section.options.length > 0),
    [materials, applications, tones]
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-28 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <span className="font-serif text-lg text-gray-900">Filters</span>
          <button
            className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900"
            onClick={onClear}
          >
            Clear All
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-100 pb-6 last:border-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full py-2 group"
            >
              <span className="text-sm font-medium uppercase tracking-widest text-gray-900 group-hover:text-gray-600 transition-colors">
                {section.name}
              </span>
              {openSections.includes(section.id) ? (
                <ChevronUp size={14} className="text-gray-400" />
              ) : (
                <ChevronDown size={14} className="text-gray-400" />
              )}
            </button>

            {openSections.includes(section.id) && (
              <div className="mt-4 space-y-3">
                {section.options.map((option) => {
                  const group = section.id as keyof FilterState;
                  const isChecked = selected[group].includes(option.slug);
                  return (
                    <label
                      key={option.slug}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative w-4 h-4 border border-gray-300 rounded-sm bg-white transition-colors group-hover:border-gray-500">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggle(group, option.slug)}
                          className="peer appearance-none w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                        />
                        <Check
                          size={12}
                          className="absolute inset-0 m-auto text-gray-900 opacity-0 peer-checked:opacity-100 pointer-events-none"
                        />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {option.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
