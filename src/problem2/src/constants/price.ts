import data from "@/assets/json/prices.json";

export const priceSummary = data.reduce((summary, current) => {
  const checkCurrency = current.currency;

  if (!summary[checkCurrency]) {
    summary[checkCurrency] = {
      price: current.price,
      date: current.date,
    };
    return summary;
  }

  if (
    new Date(current.date).getTime() >=
    new Date(summary[checkCurrency].date).getTime()
  ) {
    summary[checkCurrency].price = current.price;
    summary[checkCurrency].date = current.date;
  }

  return summary;
}, {} as Record<string, { price: number; date: string }>);
