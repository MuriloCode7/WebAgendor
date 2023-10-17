import React from 'react';
import ReactDOM from 'react-dom/client';
import AllRoutes from './routes';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<<<<<<< HEAD
  < Provider store={store}>
    < AllRoutes />
  </Provider>
=======
  <React.StrictMode>
    < Routes />
  </React.StrictMode>
>>>>>>> 5b0e96102ff20a2e8051f0f8165898c9792e5134
);

    