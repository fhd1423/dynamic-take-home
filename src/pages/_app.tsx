import '@/styles/globals.css'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react';
import Navbar from './Navbar';
import Home from './Home';

const App = () => (
  <DynamicContextProvider settings={{ environmentId: '80430acd-f59f-4594-8ca0-412a7d2bb541' }}>
    <div>
      <Navbar />
      <Home />
    </div>
  </DynamicContextProvider>
);

export default App;

