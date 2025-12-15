export function GrainOverlay() {
  return (
    // pointer-events-none 确保鼠标能穿透它点击下面的内容
    // mix-blend-overlay 让噪点与背景颜色融合
    <div className="pointer-events-none fixed inset-0 z-[90] opacity-[0.07] mix-blend-overlay overflow-hidden select-none">
      <div className="absolute inset-[-200%] w-[400%] h-[400%] animate-grain bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
