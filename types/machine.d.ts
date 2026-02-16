export interface IMachineInventoryDisplayProps {
  qty: number;
  min: number;
  status: number;
  capacity?: number;
  denom?: number;
  label?: string;
  icon?: boolean;
  cassette?: boolean;
  cassetteAmount?: number;
}
