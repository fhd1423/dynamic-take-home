import '@/styles/globals.css'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react';
import Navbar from './Navbar';
import Home from './Home';

const App = () => (
  <DynamicContextProvider settings={{ environmentId: '27c02be4-503e-4531-9538-bd1a32781d30' }}>
    <div>
      <Navbar />
      <Home />
    </div>
  </DynamicContextProvider>
);

export default App;

