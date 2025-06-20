import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Send,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-ana-darkblue border-t border-ana-purple/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                height={100}
                width={100}
                src="/logo.png"
                alt="ANA Logo"
                className="h-8 w-auto"
                priority
                fetchPriority="high"
                unoptimized
              />
            </div>
            <p className="text-white/70 text-sm mb-4">
              Democratizing access to telecommunications infrastructure through
              NFTs and blockchain technology.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://discord.gg/HmeWMSwQaQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ana-purple transition-colors"
              >
                <MessageCircle size={20} />
              </Link>
              <Link
                href="https://t.me/AirnodeAlliance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ana-purple transition-colors"
              >
                <Send size={20} />
              </Link>
              <Link
                href="https://x.com/airnodealliance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ana-purple transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/showcase/airnode-alliance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ana-purple transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/airnodealliance/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-ana-purple transition-colors"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">World Mobile Chain</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://worldmobile.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  World Mobile
                </Link>
              </li>
              <li>
                <Link
                  href="https://worldmobile.io/about/ecosystem-metrics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Ecosystem Metrics
                </Link>
              </li>
              <li>
                <Link
                  href="https://airnode.worldmobile.net/explore/ecosystem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  AirNode Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="https://airnode.worldmobile.net/explore/ecosystem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  WMTx Staking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">
            © 2025 AirNode Alliance. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
