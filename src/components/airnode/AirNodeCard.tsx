"use client";

import { UTxO } from "@lucid-evolution/lucid";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const AirNodeCardComponent = dynamic(() => import("./AirNodeCardComponent"), {
  ssr: false,
});

export interface AirNodePerformance {
  uptime: number;
  earnings: number;
  roi: number;
}

export interface AirNodeProps {
  name: string;
  image: string;
  location: string;
  airNodeId: string;
  fractions: number;
  price: number;
  performance?: AirNodePerformance;
  className?: string;
  utxo?: UTxO;
}

const AirNodeCard: React.FC<AirNodeProps> = ({
  name = "not available",
  location = "not available",
  image = "not available",
  airNodeId = "not available",
  price = 0,
  fractions = 0,
  performance = {
    uptime: 99.2,
    earnings: 2.4,
    roi: 18.6,
  },
  utxo,
  className = "",
}) => {
  return (
    <AirNodeCardComponent
      name={name}
      image={image}
      location={location}
      airNodeId={airNodeId}
      fractions={fractions}
      price={price}
      performance={performance}
      className={className}
      utxo={utxo}
    />
  );
};

export default AirNodeCard;
