"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MAX_SAMPLE_LINES,
  SAMPLE_CART_STORAGE_KEY,
  SAMPLE_SIZE,
  type AddSampleInput,
  type AddSampleResult,
  type SampleCartLine,
} from "@/types/cart";

type StorageMode = "local" | "memory";

type SampleCartContextValue = {
  lines: SampleCartLine[];
  lineCount: number;
  isDrawerOpen: boolean;
  storageMode: StorageMode;
  addSample: (input: AddSampleInput) => AddSampleResult;
  removeSample: (productSlug: string, finishId: string) => void;
  clearSamples: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  buildContactPrefillMessage: () => string;
};

const SampleCartContext = createContext<SampleCartContextValue | null>(null);

function isSampleCartLine(value: unknown): value is SampleCartLine {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.productSlug === "string" &&
    typeof candidate.productName === "string" &&
    typeof candidate.finishId === "string" &&
    typeof candidate.finishName === "string" &&
    candidate.sampleSize === SAMPLE_SIZE &&
    typeof candidate.addedAt === "string"
  );
}

export function SampleCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<SampleCartLine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("local");

  const linesRef = useRef<SampleCartLine[]>(lines);
  linesRef.current = lines;

  const hydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(SAMPLE_CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const hydratedLines = parsed
            .filter(isSampleCartLine)
            .slice(0, MAX_SAMPLE_LINES);
          linesRef.current = hydratedLines;
          setLines(hydratedLines);
        }
      }
    } catch {
      setStorageMode("memory");
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || storageMode !== "local") return;
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(SAMPLE_CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      setStorageMode("memory");
    }
  }, [lines, storageMode]);

  const addSample = useCallback((input: AddSampleInput): AddSampleResult => {
    const existing = linesRef.current.find(
      (line) =>
        line.productSlug === input.productSlug && line.finishId === input.finishId
    );
    if (existing) {
      return "exists";
    }

    if (linesRef.current.length >= MAX_SAMPLE_LINES) {
      return "limit_reached";
    }

    const nextLine: SampleCartLine = {
      ...input,
      sampleSize: SAMPLE_SIZE,
      addedAt: new Date().toISOString(),
    };

    const nextLines = [...linesRef.current, nextLine];
    linesRef.current = nextLines;
    setLines(nextLines);
    return "added";
  }, []);

  const removeSample = useCallback((productSlug: string, finishId: string) => {
    const nextLines = linesRef.current.filter(
      (line) => !(line.productSlug === productSlug && line.finishId === finishId)
    );
    linesRef.current = nextLines;
    setLines(nextLines);
  }, []);

  const clearSamples = useCallback(() => {
    linesRef.current = [];
    setLines([]);
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const buildContactPrefillMessage = useCallback(() => {
    if (linesRef.current.length === 0) return "";

    const rows = linesRef.current
      .map(
        (line, index) =>
          `${index + 1}. ${line.productName} - ${line.finishName} (${line.sampleSize})`
      )
      .join("\n");

    return [
      "Hi Aushen team,",
      "",
      "I'd like to request the following samples:",
      rows,
      "",
      "Thank you.",
    ].join("\n");
  }, []);

  const value = useMemo<SampleCartContextValue>(
    () => ({
      lines,
      lineCount: lines.length,
      isDrawerOpen,
      storageMode,
      addSample,
      removeSample,
      clearSamples,
      openDrawer,
      closeDrawer,
      buildContactPrefillMessage,
    }),
    [
      lines,
      isDrawerOpen,
      storageMode,
      addSample,
      removeSample,
      clearSamples,
      openDrawer,
      closeDrawer,
      buildContactPrefillMessage,
    ]
  );

  return (
    <SampleCartContext.Provider value={value}>
      {children}
    </SampleCartContext.Provider>
  );
}

export function useSampleCart() {
  const context = useContext(SampleCartContext);
  if (!context) {
    throw new Error("useSampleCart must be used within SampleCartProvider");
  }
  return context;
}
