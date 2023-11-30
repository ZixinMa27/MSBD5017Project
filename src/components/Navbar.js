import FormDialog from './FormDialog';

const Navbar = ({ cost, web3Handler, reviseCost, account }) => {
    return (
        <nav className="flex-between">
            <a
                className='flex'
                // href="/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                Virland
            </a>

            {/* change current cost */}
            <a className="button">Current Cost: {cost} AXM</a>

            {/* <a className="button" onClick={reviseCost}>Change cost</a> */}
            <FormDialog reviseCost={reviseCost} currentCost={cost}/>

            {account ? (
                <a
                    // href={`${""}/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </a>
            ) : (
                <button onClick={web3Handler} className="button">Connect Wallet</button>
            )}
        </nav>
    )
}

export default Navbar;