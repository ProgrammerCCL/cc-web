export interface IEODStep {
  value: string;
  no: string;
  label: string;
  isFinished?: boolean;
}
export interface IEODState {
  value: string;
  no?: string;
  label: string;
  steps: IEODStep[];
}
