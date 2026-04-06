"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

export default function RichContent({ html }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current
      .querySelectorAll('pre[class*="language-"]')
      .forEach((el) => Prism.highlightElement(el));
  }, [html]);

  return (
    <article
      ref={ref}
      className="rich-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
