// components/BrandBanner.tsx
import { CMS_LEGACY_PAGES } from "@/data/cms-site.generated";
import { HOME_SEO_CONTENT } from "@/data/pageSeoContent";
export function BrandBanner() {
  const content = CMS_LEGACY_PAGES.home?.brand;
  return (
    // 背景色吸取了图片中的深橄榄绿
    <section aria-label="About Aushen" className="bg-[#3B4034] py-14 sm:py-20 md:py-24 page-padding-x">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-16">
        
        {/* 左侧线框 Logo (用 CSS 模拟截图中的 S 形状) */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform mt-1 sm:mt-2 ml-1 sm:ml-2">
          <img src={content?.logo || "/AushenLogoLetterS.webp"} alt="Aushen letter S logo" />
          </div>
        </div>

        {/* 右侧文字内容 */}
        <div className="max-w-5xl space-y-4 text-white/90 font-serif text-[clamp(1rem,1.6vw,1.3rem)] leading-relaxed font-light">
          {HOME_SEO_CONTENT.introduction.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
