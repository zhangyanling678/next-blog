"use client";

import { useMDXComponent } from "next-contentlayer/hooks";

export default function MDXContent({ code }) {
  const MDXContent = useMDXComponent(code);
  return (
    <>
      <MDXContent />
    </>
  );
}
