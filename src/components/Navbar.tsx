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
  chain: "WMC" | "Cardano";
  setChain: (value: "WMC" | "Cardano") => void;
}
const Navbar = (props: RedirectingProp) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAdminLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
  };

  return (
    <nav className="px-4 py-3 bg-mono-gray-950/90 backdrop-blur-md border-b border-mono-gray-800 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ANA Logo"
            height={100}
            width={100}
            className="h-8 w-auto"
            priority
            fetchPriority="high"
            unoptimized
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex items-center space-x-6">
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
            {isAdmin && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-800 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Network & Wallet - Right */}
        <div className="hidden md:flex items-center space-x-6">
          <NetworkDropdown {...props} />
          <div className="block">
            <WalletConnect
              className="text-white"
              onAdminLogin={handleAdminLogin}
            />
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
            {isAdmin && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-800 transition-colors py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <NetworkDropdown {...props} />
            <div className="pt-2">
              <WalletConnect
                className="text-white"
                onAdminLogin={handleAdminLogin}
              />
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
  currency: string;
};

const Network: { [key: string]: NetworkType } = {
  Cardano: {
    id: "cardano",
    name: "Cardano",
    currency: "ADA",
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
    id: "WMTC",
    name: "WMC",
    currency: "WMTX",
    logo: (
      <Image
        src="https://imgs.search.brave.com/kXH8Z5WXis9UzBpv6GgG08AZ8Dei-V7psLqw6EdG0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93ZWIt/Y21zLWNkbi51cGhv/bGQud29ybGQvaW1h/Z2VzL1o4aXExeHNB/SEpXb21KLXZfV01U/WEAyeC5wbmc_YXV0/bz1mb3JtYXQsY29t/cHJlc3M"
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
export const NetworkDropdown: React.FC<RedirectingProp> = ({
  setIsRedirecting,
  setChain,
  chain,
}) => {
  console.log(chain);
  const [isOpen, setIsOpen] = useState(false);
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
          className="flex items-center justify-between w-fit gap-2 px-2 py-2 bg-transparent  border border-gray-700 rounded-md text-white"
        >
          {chain && (
            <div className="flex items-center gap-3">
              {Network[chain].logo}
              <span>{Network[chain].currency}</span>
            </div>
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
