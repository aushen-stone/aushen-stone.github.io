// components/BrandBanner.tsx
export function BrandBanner() {
  return (
    // 背景色吸取了图片中的深橄榄绿
    <div className="bg-[#3B4034] py-14 sm:py-20 md:py-24 page-padding-x">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-16">
        
        {/* 左侧线框 Logo (用 CSS 模拟截图中的 S 形状) */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform mt-1 sm:mt-2 ml-1 sm:ml-2">
          <img src="/AushenLogoLetterS.webp" alt="Aushen letter S logo" />
          </div>
        </div>

        {/* 右侧文字内容 */}
        <p className="text-white/90 font-serif text-[clamp(1.1rem,3.2vw,1.55rem)] leading-relaxed max-w-4xl font-light">
          At Aushen, we craft and curate only the best natural stone, architectural surfaces and outdoor furniture. We celebrate the imperfections and textural richness that can only be found in nature.
        </p>
      </div>
    </div>
  );
}
