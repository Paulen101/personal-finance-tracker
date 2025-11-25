import WalletForm from "../components/WalletForm";
import WalletList from "../components/WalletList";
import TransferForm from "../components/TransferForm";

function Wallet () {

    return (
        <div>
            <h1>Wallet Page</h1>
            <WalletForm />
            <TransferForm />
            <WalletList />

        </div>
    );
}

export default Wallet;