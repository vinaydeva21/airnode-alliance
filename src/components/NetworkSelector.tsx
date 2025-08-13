
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
type NetworkType = {
  id: string;
  name: "Cardano" | "Base";
  logo: React.ReactNode;
};
interface RedirectingProp {
  setIsRedirecting: (value: boolean) => void;
  chain: "Base" | "Cardano";
  setChain: (value: "Base" | "Cardano") => void;
}
const Network: {
  [key: string]: NetworkType;
} = {
  Cardano: {
    id: "cardano",
    name: "Cardano",
    logo: <img src="/cardano.webp" alt="Cardano Logo" className="w-6 h-6" />
  },
  "Base": {
    id: "base",
    name: "Base",
    logo: <img alt="Base Logo" className="w-6 h-6" src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo.png" />
  }
};
export const NetworkDropdown: React.FC<RedirectingProp> = ({
  setIsRedirecting,
  setChain,
  chain
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
  return <div className="">
      <div className="relative w-full max-w-xs">
        <button onClick={toggleDropdown} className="flex items-center justify-between w-fit gap-2 px-2 py-2 bg-transparent  border border-gray-700 rounded-md text-white">
          {chain && <div className="flex items-center gap-3">
            {Network[chain].logo}
            <span>WMTx</span>
          </div>}
          <ChevronDown className={clsx("w-5 h-5 transition-transform", isOpen && "transform rotate-180")} />
        </button>

        {isOpen && <div className="absolute z-10 w-[150px] mt-1 bg-ana-darkblue border border-gray-700 rounded-md shadow-lg">
            <ul className="">
              {Object.values(Network).map(network => <li key={network.id}>
                  <Button onClick={() => selectNetwork(network)} variant={"ghost"} className="flex items-center justify-start w-full px-4 py-2 text-left text-white hover:bg-gray-700">
                    <span className="mr-3">{network.logo}</span>
                    <span>{network.name}</span>
                  </Button>
                </li>)}
            </ul>
          </div>}
      </div>
    </div>;
};
