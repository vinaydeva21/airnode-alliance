
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ExternalLink } from "lucide-react";
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCardanoNetworkSwitch = () => {
    window.open("https://airnode-alliance.netlify.app/", "_blank");
  };

  return (
    <nav className="px-4 py-3 bg-ana-darkblue/80 backdrop-blur-md border-b border-ana-purple/20 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-lg font-bold bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text">
            AirNode Alliance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/marketplace" className="text-white/80 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/governance" className="text-white/80 hover:text-white transition-colors">
              Governance
            </Link>
            <Link to="/admin" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
              <Shield size={16} />
              Admin
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white/80 hover:text-white border-ana-purple/30 hover:bg-ana-purple/20 flex items-center gap-1"
              onClick={handleCardanoNetworkSwitch}
            >
              <ExternalLink size={16} />
              Switch Cardano Network
            </Button>
          </div>
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
            <Button 
              variant="outline" 
              size="sm"
              className="text-white/80 hover:text-white border-ana-purple/30 hover:bg-ana-purple/20 flex items-center gap-1 w-full justify-start"
              onClick={handleCardanoNetworkSwitch}
            >
              <ExternalLink size={16} />
              Switch Cardano Network
            </Button>
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
