
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
    <nav className="px-4 py-3 bg-mono-gray-950/90 backdrop-blur-md border-b border-mono-gray-800 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-bold gradient-text">
            AirNode Alliance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-mono-gray-200 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-mono-gray-200 hover:text-white transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-mono-gray-200 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-mono-gray-200 hover:text-white transition-colors font-medium"
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-mono-gray-200 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <Shield size={16} />
              Admin
            </Link>
          </nav>
          <NetworkDropdown {...props} />
          <WalletConnect className="hidden md:block" />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-mono-gray-950/95 backdrop-blur-lg border-b border-mono-gray-800 py-4 px-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-mono-gray-200 hover:text-white transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-mono-gray-200 hover:text-white transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-mono-gray-200 hover:text-white transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-mono-gray-200 hover:text-white transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-mono-gray-200 hover:text-white transition-colors py-2 flex items-center gap-1 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} />
              Admin
            </Link>
            <NetworkDropdown {...props} />
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
