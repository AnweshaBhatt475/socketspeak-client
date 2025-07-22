// src/routes/index.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import RegisterPage from '../pages/RegisterPage';
import CheckEmailPage from '../pages/CheckEmailPage';
import CheckPasswordPage from '../pages/CheckPasswordPage';
import ForgotPassword from '../pages/Forgotpassword';
import Home from '../pages/Home';
import MessagePage from '../components/MessagePage';
import GroupChat from '../components/GroupChat';       // ✅ Add this
import GroupList from '../components/GroupList';       // ✅ Add this
import CreateGroup from '../components/CreateGroup';   // ✅ Add this
import AuthLayouts from '../layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },
      {
        path: 'email',
        element: (
          <AuthLayouts>
            <CheckEmailPage />
          </AuthLayouts>
        ),
      },
      {
        path: 'password',
        element: (
          <AuthLayouts>
            <CheckPasswordPage />
          </AuthLayouts>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: ':userId',
            element: <MessagePage />,
          },

          // ✅ GROUP CHAT ROUTES
          {
            path: 'group/:groupId',
            element: <GroupChat />,
          },
          {
            path: 'groups',
            element: <GroupList />,
          },
          {
            path: 'create-group',
            element: <CreateGroup />,
          },
        ],
      },
    ],
  },
]);

export default router;
