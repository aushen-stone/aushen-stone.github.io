"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

// 定义过滤器的结构
const FILTERS = [
  {
    id: "material",
    name: "Material",
    options: ["Bluestone", "Travertine", "Limestone", "Granite", "Marble", "Sandstone"],
  },
  {
    id: "application",
    name: "Application",
    options: ["Pavers", "Pool Coping", "Wall Cladding", "Crazy Paving", "Cobblestones"],
  },
  {
    id: "tone",
    name: "Color Tone",
    options: ["Light", "Medium", "Dark", "Warm", "Cool"],
  },
];

export function ProductSidebar() {
  // 简单的折叠状态管理
  const [openSections, setOpenSections] = useState<string[]>(["material", "application"]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-28 space-y-8">
        
        {/* 标题 */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <span className="font-serif text-lg text-gray-900">Filters</span>
          <button className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900">
            Clear All
          </button>
        </div>

        {/* 循环渲染过滤器组 */}
        {FILTERS.map((section) => (
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

            {/* 折叠内容 */}
            {openSections.includes(section.id) && (
              <div className="mt-4 space-y-3">
                {section.options.map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    {/* 自定义 Checkbox 样式 */}
                    <div className="relative w-4 h-4 border border-gray-300 rounded-sm bg-white transition-colors group-hover:border-gray-500">
                      <input type="checkbox" className="peer appearance-none w-full h-full opacity-0 absolute inset-0 cursor-pointer" />
                      {/* 选中时的对钩 (这里只是模拟，实际需要绑定 state) */}
                      <Check size={12} className="absolute inset-0 m-auto text-gray-900 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
