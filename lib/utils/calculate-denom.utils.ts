import { IDenomQty } from "@/types/withdraw";

export const calculateDenom = (amount: number, available: IDenomQty[]) => {
  try {
    let remain = amount;

    if (amount < 0) {
      throw new Error("Amount must be possitive number");
    }

    const sortedAvailable = available.sort((a, b) => b.value - a.value);

    const denoms: IDenomQty[] = [];

    for (const denom of sortedAvailable) {
      if (remain <= 0) break;

      // Max number of this denom needed to cover 'remain'
      const needed = Math.floor(remain / denom.value);

      // Actual quantity we can dispense (cannot exceed what we have)
      const useQty = Math.min(needed, denom.qty);

      if (useQty > 0) {
        denoms.push({
          key: denom.key,
          value: denom.value,
          qty: useQty,
        });
        // Reduce the remain by the total value we dispensed
        remain -= useQty * denom.value;
      }
    }

    if (remain > 0) {
      throw new Error("Insufficient availagle denominations");
    }

    return {
      success: remain === 0,
      denoms,
      error: remain > 0 ? "Insufficient availagle denominations" : null,
    };
  } catch (err: any) {
    const error = err.message || "Calculation error.";
    console.error("[ERROR] calculateDenom", error);
    return {
      success: false,
      denoms: [],
      error,
    };
  }
};
