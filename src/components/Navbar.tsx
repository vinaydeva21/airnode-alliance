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
    <nav className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ANA Logo"
            height={100}
            width={100}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <div className="flex gap-6">
            <Link
              href="/marketplace"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/governance"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Governance
            </Link>
            {/* <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Shield size={16} />
              Admin
            </Link> */}
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NetworkDropdown setIsRedirecting={setIsRedirecting} />
          <div className="block">
            <WalletConnect className="hidden md:block" />
            {/* <WalletConnect /> */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-900" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 py-4 px-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <Link
              href="/marketplace"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/governance"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            {/* <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2 flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} />
              Admin
            </Link> */}
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
  name: "Cardano" | "WMC";
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
    name: "WMC",
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
    if (network.name == "WMC") {
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
