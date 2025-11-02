import { CURRENCY_LIST } from "@/constants/currency";
import { z } from "zod";

export const swapFormSchema = z
  .object({
    fromCurrency: z.enum(CURRENCY_LIST as [string, ...string[]]),
    fromAmount: z.coerce.number().positive(),
    toCurrency: z.enum(CURRENCY_LIST as [string, ...string[]]),
    toAmount: z.coerce.number().positive(),
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: "The currencies must be distinguished",
    path: ["fromCurrency"],
  });

export type TSwapForm = z.infer<typeof swapFormSchema>;

export const defaultSwapFormValue = {
  fromCurrency: CURRENCY_LIST[0],
  fromAmount: 0,
  toCurrency: CURRENCY_LIST[1],
  toAmount: 0,
};
