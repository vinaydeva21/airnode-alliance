
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
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
    <nav className="px-4 py-3 bg-ana-darkblue/80 backdrop-blur-md border-b border-ana-purple/20 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/59368f04-0783-4804-b487-66dcc0ccfd29.png" 
            alt="ANA Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-white/80 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-white/80 hover:text-white transition-colors"
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
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
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-ana-darkblue/95 backdrop-blur-lg border-b border-ana-purple/20 py-4 px-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            <Link
              to="/admin"
              className="text-white/80 hover:text-white transition-colors py-2 flex items-center gap-1"
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
