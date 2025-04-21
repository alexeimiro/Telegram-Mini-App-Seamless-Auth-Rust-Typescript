import React from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      const { initDataRaw, initData } = retrieveLaunchParams();
      if (!initDataRaw || !initData) {
        console.error('No init data available');
        return;
      }

      // The authentication will be handled by the App component
      // This component just shows a loading state while the parent
      // component verifies the authentication
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Verifying authentication...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Login error:', error);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-500">
            <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
            <p>Please try again later</p>
          </div>
        </div>
      );
    }
  };

  return handleLogin();
};

export default Login; 