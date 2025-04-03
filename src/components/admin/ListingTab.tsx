"use client";

import dynamic from "next/dynamic";

const ListingTabComponent = dynamic(() => import("./ListingTabComponent"), {
  ssr: false,
});

export default function ListingTab() {
  // await listForSale(values.fractionId, values.price);

  return <ListingTabComponent />;
}
