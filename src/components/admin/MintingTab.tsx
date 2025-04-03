"use client";

import dynamic from "next/dynamic";

const MintingTabComponent = dynamic(() => import("./MintingTabComponent"), {
  ssr: false,
});
export default function MintingTab() {
  return <MintingTabComponent />;
}
