type InfoRowProps = {
  label: string;
  value: string | number;
};

export const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex w-full justify-between  text-start text-5xl font-semibold text-blue-900">
    <h1>{label}</h1>
    <h1>{value}</h1>
  </div>
);
