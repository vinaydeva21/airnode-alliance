
// Global type definitions
interface Window {
  ethereum?: any;
  cardano?: {
    [key: string]: any;
    yoroi?: any;
    lace?: any;
    nami?: any;
    enable?: () => Promise<any>;
  };
}
