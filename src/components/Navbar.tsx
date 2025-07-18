import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import WalletConnect from "./WalletConnect";
import { NetworkDropdown } from "./NetworkSelector";

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

  const handleLogoClick = () => {
    window.open("https://www.airnodealliance.com", "_self");
  };

  return (
    <nav className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - Left */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img 
            src="/lovable-uploads/59368f04-0783-4804-b487-66dcc0ccfd29.png" 
            alt="ANA Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex items-center space-x-6">
            <Link
              to="/marketplace"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Governance
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
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
            <WalletConnect className="text-white" onAdminLogin={handleAdminLogin} />
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
              to="/marketplace"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/governance"
              className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Governance
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-red-600 hover:text-red-800 transition-colors py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <NetworkDropdown {...props} />
            <div className="pt-2">
              <WalletConnect className="text-white" onAdminLogin={handleAdminLogin} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
