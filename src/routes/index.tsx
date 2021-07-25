import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes  } from './auth.routes';
import { AppRoutes  } from './app.routes';

import { useAuthContext } from '../hooks/auth';

export function Routes(){
  const { user } = useAuthContext();
  
  return(
    <NavigationContainer>
      {user.id ? <AppRoutes/> : <AuthRoutes />}
    </NavigationContainer>
  );
}