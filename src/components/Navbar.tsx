
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";
import { NetworkDropdown } from "./NetworkSelector";

interface RedirectingProp {
  setIsRedirecting: (value: boolean) => void;
  chain: "Ethereum" | "Cardano";
  setChain: (value: "Ethereum" | "Cardano") => void;
}

const Navbar = (props: RedirectingProp) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="px-6 py-4 bg-white/95 backdrop-blur-md border-b border-mono-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-xl font-semibold text-mono-gray-900 tracking-tight">
            AirNode Alliance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors font-medium tracking-tight"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors font-medium tracking-tight"
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors font-medium tracking-tight"
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors font-medium tracking-tight"
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors flex items-center gap-2 font-medium tracking-tight"
            >
              <Shield size={16} />
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <NetworkDropdown {...props} />
            <WalletConnect className="hidden md:block" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-mono-gray-900" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-mono-gray-200 py-6 px-6 shadow-lg">
          <div className="flex flex-col gap-6">
            <Link
              to="/"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors py-2 font-medium tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors py-2 font-medium tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors py-2 font-medium tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors py-2 font-medium tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-mono-gray-600 hover:text-mono-gray-900 transition-colors py-2 flex items-center gap-2 font-medium tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} />
              Admin
            </Link>
            <div className="pt-4 border-t border-mono-gray-200">
              <NetworkDropdown {...props} />
            </div>
            <div className="pt-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
