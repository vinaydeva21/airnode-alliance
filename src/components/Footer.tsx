import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, MessageCircle, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ana-darkblue border-t border-ana-purple/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/59368f04-0783-4804-b487-66dcc0ccfd29.png" 
                alt="ANA Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text">
                AirNode Alliance
              </span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Democratizing access to telecommunications infrastructure through NFTs and blockchain technology.
            </p>
            <div className="flex gap-4">
              <a href="https://discord.gg/HmeWMSwQaQ" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-ana-purple transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="https://t.me/AirnodeAlliance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-ana-purple transition-colors">
                <Send size={20} />
              </a>
              <a href="https://x.com/airnodealliance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-ana-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/showcase/airnode-alliance" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-ana-purple transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/airnodealliance/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-ana-purple transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">World Mobile Chain</h3>
            <ul className="space-y-2">
              <li><a href="https://worldmobile.io/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">World Mobile</a></li>
              <li><a href="https://worldmobile.io/about/ecosystem-metrics" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">Ecosystem Metrics</a></li>
              <li><a href="https://airnode.worldmobile.net/explore/ecosystem/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">AirNode Explorer</a></li>
              <li><a href="https://airnode.worldmobile.net/explore/ecosystem/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">WMTx Staking</a></li>
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
