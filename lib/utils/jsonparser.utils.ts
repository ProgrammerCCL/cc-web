export const apiDenomSafeParse = (val: any) => {
  try {
    if (typeof val === "string") {
      return JSON.parse(val);
    } else {
      return [];
    }
  } catch (err: any) {}
};
