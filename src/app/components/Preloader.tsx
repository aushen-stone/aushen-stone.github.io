"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // 1. 禁用滚动：加载时禁止用户滑动页面
    document.body.style.overflow = "hidden";

    // 2. 模拟加载进度 (Counter Animation)
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev < 100) {
          // 随机增加进度，模拟真实网络波动
          return prev + Math.floor(Math.random() * 10) + 1;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 150);

    // 3. 进度条跑完后的收尾
    if (counter >= 100) {
      setCounter(100);
      // 延迟一点点，让用户看到 100%，然后触发离场动画
      setTimeout(() => {
        setIsLoading(false);
        // 恢复滚动
        document.body.style.overflow = "unset";
      }, 800);
    }

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          // 初始状态
          initial={{ y: 0 }}
          // 离场动画：向上滑出，就像幕布拉起
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // 这种曲线叫 Quintic Ease，非常有重量感
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a1c18] text-[#F8F5F1]"
        >
          {/* 中间的内容区域 */}
          <div className="flex flex-col items-center gap-4 overflow-hidden">

            {/* 品牌 Slogan */}
            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="font-serif text-2xl md:text-3xl italic font-light tracking-wider opacity-80"
            >
              Defining Spaces.
            </motion.p>

            {/* 百分比计数器 */}
            <motion.div
               className="text-6xl md:text-8xl font-serif font-bold tabular-nums" // tabular-nums 保证数字宽度一致，不会抖动
            >
              {counter}%
            </motion.div>

          </div>

          {/* 底部版权 (装饰用) */}
          <div className="absolute bottom-10 text-xs uppercase tracking-[0.2em] opacity-30">
            Aushen Stone
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
