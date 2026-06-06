"use client";

import { useCallback, useEffect, useState } from "react";

export function useFullscreen<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === element);
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [element]);

  const toggleFullscreen = useCallback(async () => {
    if (!element) return;

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      // Browser may block fullscreen without user gesture
    }
  }, [element]);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  return {
    ref: setElement,
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
  };
}
