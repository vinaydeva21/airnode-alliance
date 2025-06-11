
import React from "react";
import { Button } from "@/components/ui/button";

export const Pagination: React.FC = () => {
  return (
    <div className="mt-16 flex justify-center">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled className="border-mono-gray-300 text-mono-gray-400">
          Previous
        </Button>
        <Button variant="outline" size="sm" className="bg-mono-gray-900 text-white border-mono-gray-900 hover:bg-mono-gray-800">
          1
        </Button>
        <Button variant="outline" size="sm" className="border-mono-gray-300 text-mono-gray-600 hover:bg-mono-gray-50">
          2
        </Button>
        <Button variant="outline" size="sm" className="border-mono-gray-300 text-mono-gray-600 hover:bg-mono-gray-50">
          3
        </Button>
        <Button variant="outline" size="sm" className="border-mono-gray-300 text-mono-gray-600 hover:bg-mono-gray-50">
          Next
        </Button>
      </div>
    </div>
  );
};
