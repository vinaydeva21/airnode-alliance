
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type NetworkType = {
  id: string;
  name: "Cardano" | "Ethereum";
  logo: React.ReactNode;
};

interface RedirectingProp {
  setIsRedirecting: (value: boolean) => void;
  chain: "Ethereum" | "Cardano";
  setChain: (value: "Ethereum" | "Cardano") => void;
}

const Network: { [key: string]: NetworkType } = {
  Cardano: {
    id: "cardano",
    name: "Cardano",
    logo: <img src="/cardano.webp" alt="Cardano Logo" className="w-5 h-5 filter grayscale opacity-70" />,
  },
  Ethereum: {
    id: "ethereum",
    name: "Ethereum",
    logo: <img src="/ethereum.webp" alt="Ethereum Logo" className="w-5 h-5 filter grayscale opacity-70" />,
  },
};

export const NetworkDropdown: React.FC<RedirectingProp> = ({
  setIsRedirecting,
  setChain,
  chain,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectNetwork = (network: NetworkType) => {
    setChain(network.name);
    if (network.name == "Cardano") {
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = "https://airnode-alliance.netlify.app";
      }, 1500);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative w-full max-w-xs">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-fit gap-3 px-4 py-2.5 bg-white border border-mono-gray-300 rounded-lg text-mono-gray-700 hover:border-mono-gray-400 hover:bg-mono-gray-50 transition-all duration-200 shadow-sm"
        >
          {chain && (
            <div className="flex items-center gap-3">
              {Network[chain].logo}
              <span className="text-sm font-medium">{Network[chain].name}</span>
            </div>
          )}
          <ChevronDown
            className={clsx(
              "w-4 h-4 transition-transform duration-200 text-mono-gray-500",
              isOpen && "transform rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-[160px] mt-2 bg-white border border-mono-gray-200 rounded-lg shadow-lg overflow-hidden">
            <ul className="">
              {Object.values(Network).map((network) => (
                <li key={network.id}>
                  <Button
                    onClick={() => selectNetwork(network)}
                    variant={"ghost"}
                    className="flex items-center justify-start w-full px-4 py-3 text-left text-mono-gray-700 hover:bg-mono-gray-50 transition-colors rounded-none border-0"
                  >
                    <span className="mr-3">{network.logo}</span>
                    <span className="text-sm font-medium">{network.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
