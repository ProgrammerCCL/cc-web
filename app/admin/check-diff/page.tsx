import { CheckDifWip, CheckTotalDif } from "@/components/check-diff";

const CheckDif = async () => {
  return (
    <div className="mt-4 w-full space-y-6 p-4 md:px-10">
      <CheckTotalDif />
      <CheckDifWip />
    </div>
  );
};

export default CheckDif;
