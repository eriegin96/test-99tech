import {
  defaultSwapFormValue,
  swapFormSchema,
  TSwapForm,
} from "@/configs/swapForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { delay } from "@/utils";
import { useWalletContext } from "@/providers/WalletProvider";

export const useSwapForm = () => {
  const form = useForm<TSwapForm>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: defaultSwapFormValue,
  });
  const { balance, swapBalance } = useWalletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionError, setTransactionError] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState("");

  const fromCurrency = form.watch("fromCurrency");
  const toCurrency = form.watch("toCurrency");

  const swapCurrencyPosition = () => {
    form.reset(
      {
        fromAmount: form.getValues("toAmount"),
        fromCurrency: form.getValues("toCurrency"),
        toAmount: form.getValues("fromAmount"),
        toCurrency: form.getValues("fromCurrency"),
      },
      { keepDirty: true }
    );
  };

  const onSubmit = async (values: TSwapForm) => {
    setIsLoading(true);

    await delay(1000);

    setIsLoading(false);

    if (
      form.getValues("fromAmount") > balance[form.getValues("fromCurrency")]
    ) {
      setTransactionError("Your account has insufficient balance");
    } else {
      setTransactionSuccess("Your transaction is placed successfully");
      swapBalance(
        values.fromCurrency,
        values.fromAmount,
        values.toCurrency,
        values.toAmount
      );
      form.reset({ ...defaultSwapFormValue, fromCurrency, toCurrency });
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    setTransactionError("");
    setTransactionSuccess("");
  };

  useEffect(() => {
    if (transactionError || transactionSuccess) {
      setIsDialogOpen(true);
    }
  }, [transactionError, transactionSuccess]);

  return {
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
  };
};
