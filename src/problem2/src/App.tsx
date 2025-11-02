import { SwapForm } from "./components";
import { WalletProvider } from "./providers/WalletProvider";
import "./App.css";

function App() {
  return (
    <WalletProvider>
      <div className="bg-gradient-to-br from-dark1 to-dark2 w-screen h-screen flex flex-col justify-center items-center">
        <h2 className="text-7xl font-bold text-white mb-20">Swap Currency</h2>
        <SwapForm />
      </div>
    </WalletProvider>
  );
}

export default App;
