"use client";
// import Marketplace from "@/airnode_pages/Marketplace";
import dynamic from "next/dynamic";
import React from "react";
const Marketplace = dynamic(() => import("@/airnode_pages/Marketplace"), {
  ssr: false,
});

export default function Page() {
  return <Marketplace />;
}
