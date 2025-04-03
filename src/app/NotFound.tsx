import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NetworkBackground from "@/components/NetworkBackground";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <NetworkBackground className="flex items-center justify-center">
      <div className="text-center px-4 py-12">
        <Logo size={80} className="mx-auto mb-6" />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-ana-purple to-ana-pink text-transparent bg-clip-text mb-4">
          404
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Oops! This AirNode doesn't exist yet
        </p>
        <p className="text-white/60 max-w-md mx-auto mb-8">
          The page you're looking for cannot be found. It might have been moved
          or doesn't exist in the AirNode Alliance network.
        </p>
        <Link to="/">
          <Button size="lg">Return to Homepage</Button>
        </Link>
      </div>
    </NetworkBackground>
  );
};

export default NotFound;
