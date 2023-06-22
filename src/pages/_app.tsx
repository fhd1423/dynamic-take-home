import '@/styles/globals.css'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react';
import Navbar from './Navbar';
import Home from './Home';

const App = () => (
  <DynamicContextProvider settings={{ environmentId: 'b043b1a4-b703-4f61-91b3-fd33fe32eb25' }}>
    <div>
      <Navbar />
      <Home />
    </div>
  </DynamicContextProvider>
);

export default App;

