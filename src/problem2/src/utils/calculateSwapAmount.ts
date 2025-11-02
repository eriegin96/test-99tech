import { fixAmountDecimal } from "./fixAmountDecimal";

export const calculateSwapAmount = (
  price1: number,
  amount1: number,
  price2: number
) => {
  const amount = (price1 * amount1) / price2;

  return fixAmountDecimal(amount);
};
