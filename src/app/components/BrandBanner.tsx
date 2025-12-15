// components/BrandBanner.tsx
export function BrandBanner() {
  return (
    // 背景色吸取了图片中的深橄榄绿
    <div className="bg-[#3B4034] py-20 md:py-24 px-10 md:px-16">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
        
        {/* 左侧线框 Logo (用 CSS 模拟截图中的 S 形状) */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 flex items-center justify-center transform mt-2 ml-2">
          <img src="AushenLogoLetterS.webp" />
          </div>
        </div>

        {/* 右侧文字内容 */}
        <p className="text-white/90 font-serif text-lg md:text-2xl leading-relaxed max-w-4xl font-light">
          At Aushen, we craft and curate only the best natural stone, architectural surfaces and outdoor furniture. We celebrate the imperfections and textural richness that can only be found in nature.
        </p>
      </div>
    </div>
  );
}
