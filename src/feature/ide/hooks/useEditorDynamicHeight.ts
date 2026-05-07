import { useCallback, useEffect, useState, RefObject } from "react";
import { IDE_SELECTORS } from "@/feature/ide/constants";

/**
 * Hook to calculate and maintain the dynamic height of the editor.
 *
 * Formula: 100vh - (top_position of the editor, but at least 30px) - (height of footer, but minimum 30px)
 *
 * @param containerRef - Ref to the editor's container element.
 * @returns The calculated height string (e.g., "500px" or "85vh" as default).
 */
export const useEditorDynamicHeight = (
  containerRef: RefObject<HTMLDivElement>,
) => {
  const [editorHeight, setEditorHeight] = useState("85vh");

  const calculateHeight = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.top;

      const footer = document.querySelector(
        `.${IDE_SELECTORS.footer}`,
      ) as HTMLElement;
      const footerHeight = footer?.offsetHeight || 0;

      const subtractedTop = Math.max(top, 30);
      const subtractedFooter = Math.max(footerHeight, 30);

      // Using window.innerHeight instead of 100vh for more accurate pixel calculation.
      const calculatedHeight =
        window.innerHeight - subtractedTop - subtractedFooter;

      setEditorHeight(`${calculatedHeight}px`);
    }
  }, [containerRef]);

  useEffect(() => {
    calculateHeight();

    const observer = new ResizeObserver(() => {
      calculateHeight();
    });

    observer.observe(document.body);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const footer = document.querySelector(`.${IDE_SELECTORS.footer}`);
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, [calculateHeight, containerRef]);

  return editorHeight;
};
