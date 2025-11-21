import { useFinance } from "../context/FinanceContext";

function Wallet () {
    const { wallets, balance } = useFinance();

    return (
        <div>
            <h1>Wallet Page</h1>
            <h2>Balance ${balance}</h2>
        </div>
    );
}

export default Wallet;