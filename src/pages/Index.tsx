import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Shield, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import AirNodeCard from "@/components/airnode/AirNodeCard";

const HomePage = () => {
  const upcomingNodes = [
    {
      id: "portal-180",
      name: "Portal 180",
      location: "Nairobi, Kenya",
      price: 45,
      imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
      totalShares: 1000,
      availableShares: 850,
    },
    {
      id: "portal-360",
      name: "Portal 360",
      location: "Lagos, Nigeria",
      price: 60,
      imageUrl: "/lovable-uploads/b43073b7-44b5-4631-b30f-dc3671d1e301.png",
      totalShares: 1000,
      availableShares: 600,
    },
  ];

  return (
    <NetworkBackground>
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-ana-purple via-white to-ana-pink text-transparent bg-clip-text mb-6">
              AirNode Alliance
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Decentralized | Fractionalized | AirNodes
            </p>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Own a piece of the future of telecommunications through fractional
              NFT ownership. Earn passive income and participate in
              decentralized governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-ana-darkpurple/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text">
            Democratizing Telecom Infrastructure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-ana-darkblue/40 backdrop-blur-sm p-6 rounded-lg border border-ana-purple/20">
              <div className="w-12 h-12 bg-ana-purple/20 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="text-ana-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Fractional Ownership
              </h3>
              <p className="text-white/70">
                Own shares of AirNodes as NFTs and receive passive income based
                on your ownership percentage.
              </p>
            </div>

            <div className="bg-ana-darkblue/40 backdrop-blur-sm p-6 rounded-lg border border-ana-purple/20">
              <div className="w-12 h-12 bg-ana-purple/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-ana-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Decentralized Governance
              </h3>
              <p className="text-white/70">
                Participate in the DAO and vote on proposals regarding reward
                distribution and infrastructure expansion.
              </p>
            </div>

            <div className="bg-ana-darkblue/40 backdrop-blur-sm p-6 rounded-lg border border-ana-purple/20">
              <div className="w-12 h-12 bg-ana-purple/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-ana-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Global Connectivity
              </h3>
              <p className="text-white/70">
                Support the expansion of telecommunications infrastructure in
                underserved regions around the world.
              </p>
            </div>

            <div className="bg-ana-darkblue/40 backdrop-blur-sm p-6 rounded-lg border border-ana-purple/20">
              <div className="w-12 h-12 bg-ana-purple/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-ana-purple" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Secured by Blockchain
              </h3>
              <p className="text-white/70">
                All transactions and ownership records are secured on the World
                Mobile Chain (WMC) blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Drops Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-white">
              Upcoming AirNode Drops
            </h2>
            <Link
              to="/marketplace"
              className="text-ana-purple hover:text-ana-pink flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingNodes.map((node) => (
              <AirNodeCard key={node.id} {...node} />
            ))}

            <div className="flex items-center justify-center h-full min-h-[300px] airnode-card rounded-lg border border-ana-purple/20 p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  More Coming Soon
                </h3>
                <p className="text-white/70 mb-4">
                  Stay tuned for more AirNode opportunities
                </p>
                <Button variant="outline">Get Notified</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-ana-darkpurple to-ana-darkblue">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join the AirNode Alliance?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Sign up now to get notified about upcoming AirNode drops and start
              your journey into decentralized telecommunications ownership.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="px-8">
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </NetworkBackground>
  );
};

export default HomePage;
