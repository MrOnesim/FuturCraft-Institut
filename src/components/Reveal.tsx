"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

const visibleClass = "opacity-100 translate-y-0";
const hiddenClass = "opacity-0 translate-y-5";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Visible par défaut si IntersectionObserver n'est pas disponible (SEO / anciens navigateurs)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Pas d'observer disponible : afficher immédiatement (via un tick pour éviter setState synchrone)
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Comp = Tag as ElementType;

  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? visibleClass : hiddenClass
      } ${className}`}
    >
      {children}
    </Comp>
  );
}
