import { InfoRow } from "./InfoRow";

type TStatusSaleProps = {
  amount?: number;
  cashin?: number | null;
};

export const StatusSaleLabel = ({
  amount = 0,
  cashin = 0,
}: TStatusSaleProps) => {
  const reqAmount = amount || 0;
  const actCashIn = cashin || 0;

  const remain = reqAmount - actCashIn;
  const isErr = reqAmount < 0 || actCashIn < 0;

  return (
    <InfoRow
      label={isErr ? "-" : remain > 0 ? "ค้างอีก" : "เงินทอน"}
      value={
        isErr
          ? "-"
          : `${Math.abs(remain).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} บาท`
      }
    />
  );
};
