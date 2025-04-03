"use client";
import dynamic from "next/dynamic";
import React from "react";
import { AirNodePerformance } from "./AirNodeCardComponent";
import { UTxO } from "@lucid-evolution/lucid";
const NodePurchaseDialogComponent = dynamic(
  () => import("./NodePurchaseDialogComponent"),
  { ssr: false }
);
interface NodePurchaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: {
    id: string;
    name: string;
    price: number;
    availableShares: number;
    performance: AirNodePerformance;
  };
  utxo: UTxO | undefined;
  shareAmount: number;
  setShareAmount: (amount: number) => void;
}

export const NodePurchaseDialog: React.FC<NodePurchaseProps> = ({
  open,
  onOpenChange,
  node,
  utxo,
  shareAmount,
  setShareAmount,
}) => {
  return (
    <NodePurchaseDialogComponent
      open={open}
      onOpenChange={onOpenChange}
      node={node}
      utxo={utxo}
      shareAmount={shareAmount}
      setShareAmount={setShareAmount}
    />
  );
};
