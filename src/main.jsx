import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';              // <-- Import Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import store from './store';                         // <-- Import your redux store
import App from './App';
import { store } from './store/store';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>                        {/* Wrap in Redux Provider */}
      <QueryClientProvider client={queryClient}>   {/* React Query Provider */}
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
