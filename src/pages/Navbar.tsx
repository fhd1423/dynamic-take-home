import { useDynamicContext } from '@dynamic-labs/sdk-react';

const Navbar = () => {
  const {
    handleLogOut,
    setShowAuthFlow,
    showAuthFlow,
    primaryWallet
  } = useDynamicContext();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <p className="text-white font-bold text-lg">Dynamic Take Home</p>
          </div>
          {primaryWallet && !showAuthFlow ? (
            <div className="hidden md:flex items-center">
              <p className="text-gray-300 mr-4">{primaryWallet.address}</p>
              <button type="button" onClick={handleLogOut} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Log Out
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <button type="button" onClick={() => { setShowAuthFlow(true) }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Connect With My Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar