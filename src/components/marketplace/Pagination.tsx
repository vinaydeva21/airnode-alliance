
import React from "react";
import { Button } from "@/components/ui/button";

export const Pagination: React.FC = () => {
  return (
    <div className="mt-12 flex justify-center">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button variant="outline" size="sm" className="bg-ana-purple/20">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  );
};
