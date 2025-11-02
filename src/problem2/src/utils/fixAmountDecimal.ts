import { MAX_DECIMAL } from "@/constants/balance";

export const fixAmountDecimal = (
  amount: number,
  decimal: number = MAX_DECIMAL
) => {
  return Math.round((amount + Number.EPSILON) * 10 ** decimal) / 10 ** decimal;
};
