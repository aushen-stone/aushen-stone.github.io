"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

type SmoothScrollProps = {
  children: React.ReactElement | React.ReactElement[];
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  // lerp: 0.1 控制惯性大小，数值越小越“滑”
  // duration: 1.5 控制滚动时长
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children as unknown as JSX.Element}
    </ReactLenis>
  );
}
