// components/animations/FadeIn.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number; // 控制初始向下偏移的距离
}

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.8, // 默认 0.8秒，营造缓慢的高级感
  yOffset = 40    // 默认向下偏移 40px
}: FadeInProps) {
  const ref = useRef(null);
  
  // margin: "-50px" 意味着元素进入视口底部 50px 后才开始触发，避免一露头就动
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{ 
        duration: duration, 
        ease: [0.21, 0.47, 0.32, 0.98], // 这是经典的 Apple 风格缓动曲线 (Out-Quart 变体)
        delay: delay 
      }}
    >
      {children}
    </motion.div>
  );
}
