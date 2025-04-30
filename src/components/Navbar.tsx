"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import WalletConnect from "./WalletConnect";
import { useWeb3 } from "@/contexts/Web3Context";

import clsx from "clsx";
import Image from "next/image";
interface RedirectingProp {
  setIsRedirecting: (value: boolean) => void;
}
const Navbar = ({ setIsRedirecting }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="px-4 py-3 bg-ana-darkblue/80 backdrop-blur-md border-b border-ana-purple/20 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-bold bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text">
            AirNode Alliance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-white/80 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/governance"
              className="text-white/80 hover:text-white transition-colors"
            >
              Governance
            </Link>
            <Link
              href="/admin"
              className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield size={16} />
              Admin
            </Link>
          </div>
          <NetworkDropdown setIsRedirecting={setIsRedirecting} />

          <WalletConnect className="hidden md:block" />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-ana-darkblue/95 backdrop-blur-lg border-b border-ana-purple/20 py-4 px-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/governance"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            <Link
              href="/admin"
              className="text-white/80 hover:text-white transition-colors py-2 flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} />
              Admin
            </Link>
            <div className="pt-2">
              {" "}
              <WalletConnect />{" "}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

type NetworkType = {
  id: string;
  name: "Cardano" | "Ethereum";
  logo: React.ReactNode;
};

const Network: { [key: string]: NetworkType } = {
  Cardano: {
    id: "cardano",
    name: "Cardano",
    logo: (
      <Image
        src="/cardano.webp"
        width={24}
        height={24}
        alt="Cardano Logo"
        priority
        fetchPriority="high"
        unoptimized
      />
    ),
  },
  Ethereum: {
    id: "ethereum",
    name: "Ethereum",
    logo: (
      <Image
        src="/ethereum.webp"
        width={24}
        height={24}
        priority
        fetchPriority="high"
        unoptimized
        alt="Ethereum Logo"
      />
    ),
  },
};

const NetworkDropdown: React.FC<RedirectingProp> = ({ setIsRedirecting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { chain, setChain } = useWeb3();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectNetwork = (network: NetworkType) => {
    setChain(network.name);
    if (network.name == "Ethereum") {
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = "https://airnodealliance.com";
      }, 1500);
    }
    setIsOpen(false);
  };

  return (
    <div className="">
      <div className="relative w-full max-w-xs">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-fit gap-2 px-2 py-2 bg-transparent border border-gray-700 rounded-md text-white"
        >
          {chain && (
            <div className="flex items-center gap-3">{Network[chain].logo}</div>
          )}
          <ChevronDown
            className={clsx(
              "w-5 h-5 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-[150px] mt-1 bg-ana-darkblue border border-gray-700 rounded-md shadow-lg">
            <ul className="">
              {Object.values(Network).map((network) => (
                <li key={network.id}>
                  <button
                    onClick={() => selectNetwork(network)}
                    className="flex items-center justify-start w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                  >
                    <span className="mr-3">{network.logo}</span>
                    <span>{network.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
