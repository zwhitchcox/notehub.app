import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/styles.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import store from './store';
import routes from './app/routes';
import { Provider } from 'react-redux';
import SocketProvider from './features/socket';
import CanvasProvider from './features/canvas';

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <CanvasProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </CanvasProvider>
    </SocketProvider>
  </React.StrictMode>
);

reportWebVitals();
