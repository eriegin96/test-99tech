import { useWalletContext } from "@/providers/WalletProvider";
import { CurrencySelection } from "./CurrencySelection";
import { Button } from "./ui/button";
import { ArrowUpDown, LoaderCircle } from "lucide-react";
import { useSwapForm } from "@/hooks";
import { Form } from "./ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import clsx from "clsx";
import { calculateSwapAmount } from "@/utils";
import { priceSummary } from "@/constants/price";
import { CURRENCY_LIST } from "@/constants/currency";

export function SwapForm() {
  const { balance } = useWalletContext();
  const {
    form,
    fromCurrency,
    toCurrency,
    onSubmit,
    isLoading,
    isDialogOpen,
    transactionError,
    transactionSuccess,
    handleDialogClose,
    swapCurrencyPosition,
  } = useSwapForm();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-[500px] border border-gray-400 p-6 rounded-2xl bg-dark1 text-gray-200 shadow-xl shadow-gray-900 flex flex-col gap-5">
            <div className="relative flex flex-col gap-5">
              <CurrencySelection
                inputName="fromAmount"
                selectName="fromCurrency"
                currencyList={CURRENCY_LIST}
                willPay
                balance={balance[fromCurrency]}
                isDisabled={isLoading}
              />
              <Button
                variant="outline"
                className="absolute rounded-full text-violet-600 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                size="icon"
                type="button"
                onClick={swapCurrencyPosition}
                disabled={isLoading}
              >
                <ArrowUpDown />
              </Button>
              <CurrencySelection
                inputName="toAmount"
                selectName="toCurrency"
                currencyList={CURRENCY_LIST}
                balance={balance[toCurrency]}
                isDisabled={isLoading}
              />
            </div>

            <div className="my-1 self-center text-sm">
              1 {fromCurrency} ={" "}
              {calculateSwapAmount(
                priceSummary[fromCurrency].price,
                1,
                priceSummary[toCurrency].price
              )}{" "}
              {toCurrency}
            </div>
            <Button
              className="uppercase"
              type="submit"
              disabled={!form.formState.isDirty || isLoading}
            >
              {isLoading && <LoaderCircle className="animate-spin" />} Swap
            </Button>
          </div>
        </form>
      </Form>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent
          aria-describedby={undefined}
          className="bg-dark2 text-white"
        >
          <DialogHeader>
            <DialogTitle
              className={clsx(
                transactionError && "text-red-500",
                transactionSuccess && "text-green-500"
              )}
            >
              {transactionError && "Error"}
              {transactionSuccess && "Success"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            {transactionError || transactionSuccess}
          </div>
          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
