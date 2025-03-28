
import React from 'react';

interface RainbowKitWrapperProps {
  children: React.ReactNode;
  projectId: string;
}

export const RainbowKitWrapper: React.FC<RainbowKitWrapperProps> = ({ 
  children,
  projectId = "0b7502f59a16b5cc689348f2c3bc8c26" // Use default project ID
}) => {
  return (
    <>
      {children}
    </>
  );
};
