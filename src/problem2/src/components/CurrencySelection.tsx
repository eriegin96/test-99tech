import { CURRENCY_ICON } from "@/constants/currency";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { TSwapForm } from "@/configs/swapForm";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MAX_INPUT, MIN_INPUT } from "@/constants/balance";
import { calculateSwapAmount, fixAmountDecimal } from "@/utils";
import { priceSummary } from "@/constants/price";

type TCurrencySelectionProps = {
  inputName: keyof Pick<TSwapForm, "fromAmount" | "toAmount">;
  selectName: keyof Pick<TSwapForm, "fromCurrency" | "toCurrency">;
  currencyList: string[];
  willPay?: boolean;
  balance: number;
  isDisabled: boolean;
};

export function CurrencySelection({
  inputName,
  selectName,
  willPay,
  currencyList,
  isDisabled = false,
  balance = 0,
}: TCurrencySelectionProps) {
  const { control, setValue, getValues } = useFormContext<TSwapForm>();

  const handleChangeAmount = (
    value: number,
    fieldName: keyof Pick<TSwapForm, "fromAmount" | "toAmount">
  ) => {
    setValue(fieldName, value, { shouldDirty: true });

    if (fieldName === "fromAmount") {
      setValue(
        "toAmount",
        calculateSwapAmount(
          priceSummary[getValues("fromCurrency")].price,
          value,
          priceSummary[getValues("toCurrency")].price
        )
      );
    } else {
      setValue(
        "fromAmount",
        calculateSwapAmount(
          priceSummary[getValues("toCurrency")].price,
          value,
          priceSummary[getValues("fromCurrency")].price
        )
      );
    }
  };

  return (
    <div className="w-full bg-dark2 rounded-2xl p-4">
      <div className="flex justify-between items-center">
        <span>You {willPay ? "pay" : "receive"}</span>
        <span>Balance: {fixAmountDecimal(balance)}</span>
      </div>
      <div className="my-3 flex justify-between items-center gap-10">
        <FormField
          control={control}
          name={inputName}
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                {MIN_INPUT.toFixed(8).toString()} - {MAX_INPUT}
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={MIN_INPUT}
                  className="!text-4xl font-semibold border-0 p-0"
                  placeholder=""
                  onChange={(e) => {
                    const value = Number(
                      e.currentTarget.value.match(
                        /^-?\d+(?:\.\d{0,8})?/
                      )?.[0] ?? 0
                    );
                    handleChangeAmount(value, inputName);
                  }}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={selectName}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-28 bg-dark2">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent className="bg-dark2 text-white">
                  {currencyList.map((currency) => (
                    <SelectItem
                      key={currency}
                      value={currency}
                      className="flex"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={CURRENCY_ICON[currency]}
                          alt={currency}
                          width={24}
                          height={24}
                        />{" "}
                        {currency}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          onClick={() =>
            handleChangeAmount(fixAmountDecimal(balance), inputName)
          }
        >
          Max
        </Button>
      </div>
    </div>
  );
}
