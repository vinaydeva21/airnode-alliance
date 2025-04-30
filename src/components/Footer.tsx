
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Twitter, Facebook, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ana-darkblue border-t border-ana-purple/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={32} />
              <span className="text-lg font-bold bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text">
                AirNode Alliance
              </span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Democratizing access to telecommunications infrastructure through NFTs and blockchain technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-ana-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-ana-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-ana-purple transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-ana-purple transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/team" className="text-white/70 hover:text-white transition-colors text-sm">Our Team</Link></li>
              <li><Link to="/partners" className="text-white/70 hover:text-white transition-colors text-sm">Partners & Investors</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white transition-colors text-sm">Blog & News</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Governance</h3>
            <ul className="space-y-2">
              <li><Link to="/dao" className="text-white/70 hover:text-white transition-colors text-sm">DAO</Link></li>
              <li><Link to="/proposals" className="text-white/70 hover:text-white transition-colors text-sm">Proposals</Link></li>
              <li><Link to="/voting" className="text-white/70 hover:text-white transition-colors text-sm">Voting & Delegation</Link></li>
              <li><Link to="/treasury" className="text-white/70 hover:text-white transition-colors text-sm">Treasury</Link></li>
              <li><Link to="/token" className="text-white/70 hover:text-white transition-colors text-sm">ANA Token</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">World Mobile Chain</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Explorer</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Bridge to WMC</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">AirNode System</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">© 2023 AirNode Alliance. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-white/50 hover:text-white text-sm">Terms of Service</Link>
            <Link to="/privacy" className="text-white/50 hover:text-white text-sm">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
