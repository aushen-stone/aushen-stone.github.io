"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  // 鼠标位置的 MotionValue
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 使用弹簧物理效果，让光标跟随有一种“被拖拽”的顺滑感 (Spring Physics)
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // 减去一半宽度以居中 (w-8 = 32px)
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      // 检测鼠标是否悬停在可点击元素上 (Link, Button, Inputs)
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference hidden md:block" // 移动端隐藏
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* 光标主体 */}
      <motion.div
        animate={{
          scale: isHovering ? 2.5 : 1, // 悬停时放大
          backgroundColor: isHovering ? "white" : "transparent", // 悬停时变实心
          borderWidth: isHovering ? "0px" : "1.5px",
        }}
        transition={{ duration: 0.2 }}
        className="w-8 h-8 rounded-full border border-white bg-transparent"
      />
    </motion.div>
  );
}
