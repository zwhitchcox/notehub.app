import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import NotePage from './routes/note-page';
import Root from './routes/root';
import ErrorPage from './routes/error-page';
import HomePage from './routes/home-page';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      errorElement={<ErrorPage />}
    >
      <Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/note" element={<NotePage />} />
      </Route>
    </Route>
  )
)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
   <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
