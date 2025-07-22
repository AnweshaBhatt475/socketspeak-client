// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { RouterProvider } from 'react-router-dom';
// import router from './rotues';
// import { Provider } from 'react-redux'
// import { store } from './redux/store';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router}>
//         <App />import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// import { RouterProvider } from 'react-router-dom';
// import router from './routes'; // ✅ make sure this file exists
// import { Provider } from 'react-redux';
// import { store } from './redux/store';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </React.StrictMode>
// );

// reportWebVitals();

//       </RouterProvider>
//     </Provider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ Tailwind CSS directives must be inside this
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes'; // ✅ Ensure the file is correctly named (not './rotues')
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// ✅ Call once
reportWebVitals();
