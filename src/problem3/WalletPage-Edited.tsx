import { useMemo } from "react";
import classes from "./styles.module.css";
import { BoxProps } from "./another";

interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

/*
  Line: 
    - interface Props extends BoxProps {}
  Assumption: 
    - `BoxProps` is imported from another file
    - If there are no interface `BoxProps`, just declare `interface WalletPageProps {}`
  Problem: Should not give a common name, give clearer name
  Solution: Change `Props` to `WalletPageProps`
*/
interface WalletPageProps extends BoxProps {}

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
  const { children, ...rest } = props;
  /*
    Line: 
      - const balances = useWalletBalances();
      - const prices = usePrices();
    Assumption: 
      - `useWalletBalances` and `usePrices` are imported from another file
  */
  const balances = useWalletBalances();
  const prices = usePrices();

  /*
    Line: 
      - const getPriority = (blockchain: any): number => {
    Problem: Should not use any, use specific type
    Solution: Change `any` to `string`
  */
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  /*
    Line: 
      - const sortedBalances = useMemo(() => {
    
    Problem: 
      - Type of `sortedBalances` is any
    Solution: Add type to `sortedBalances`
  */
  const sortedBalances: WalletBalance[] = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        /*
          Line: 
            - const balancePriority = getPriority(balance.blockchain);
          Problem: Property `blockchain` does not exist on type `WalletBalance`
          Solution: Change `blockchain` to `currency`
        */
        const balancePriority = getPriority(balance.currency);
        /*
          Line: s
            - if (lhsPriority > -99) {
          Problem: `lhsPriority` is not declared
          Solution: Change `lhsPriority` to `balancePriority`
        */
        /*
            Line: 
              -  if (balance.amount <= 0) {
            Problem: I think we are filtering the balance with amount higher than 0
            Solution: Change `<=` to `>`
          */
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        /*
          Line: 
            - const leftPriority = getPriority(lhs.blockchain);
            - const rightPriority = getPriority(rhs.blockchain);
          Problem: Property `blockchain` does not exist on type `WalletBalance`
          Solution: change `blockchain` to `currency`
        */
        const leftPriority = getPriority(lhs.currency);
        const rightPriority = getPriority(rhs.currency);
        /*
          Line: 
            - if (leftPriority > rightPriority) {
                return -1;
              } else if (rightPriority > leftPriority) {
                return 1;
              }
          Problem: Code is complicated
          Solution: If we need to sort in descending order, simplify it 
        */
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  /*
    Line: 
      - const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    Problem: Type of `formattedBalances` is any
    Solution: Add type to `formattedBalances`
  */
  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    /*
      Line: 
        - balance: WalletBalance
      Problem: `balance` is now understood as type `WalletBalance`, we don't need type annotation here
      Solution: Remove `WalletBalance`
    */
    (balance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    }
  );

  /*
    Line: 
      - (balance: FormattedWalletBalance, index: number) => {
    Problem: Type of `balance` is conflicted with type of each element in `sortedBalances`
    Solution: Because we need to use `balance.formatted` for `formattedAmount`, we need to change 
              `sortedBalances` to `formattedBalances`
  */
  const rows = formattedBalances.map(
    /*
      Line: 
        - (balance: FormattedWalletBalance, index: number) => {
      Problem: 
        - `balance` is now understood as type `FormattedWalletBalance`,
        - `index` is also understood as type number
        => We don't need type annotation here
      Solution: Remove `FormattedWalletBalance` and `number`
    */
    (balance, index) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        /*
          Line: 
            - <WalletRow
          Assumption: 
            - `WalletRow` is imported from another file
        */
        <WalletRow
          /*
            Line: 
              - className={classes.row}
            Assumption: 
              - `classes` is imported from css module file
          */
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

/*
  Problem: `WalletPage` is declared but not exported
  Solution: export `WalletPage` for usage
*/
export default WalletPage;
