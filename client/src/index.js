import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login';
import Test from './Test';
import App from './App';
import ForgotLogin from './components/ForgotLogin';
import Registration from './components/Registration';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}
const theme = extendTheme({ colors })

ReactDOM.render(
  <ChakraProvider theme={theme}>
  <BrowserRouter>
    <Test />
    <Switch>
      <Route path='/home'>
        <App />
      </Route>
      <Route path='/forgotlogin'>
        <ForgotLogin />
      </Route>
      <Route path='/register'>
        <Registration />
      </Route>
    </Switch>
  </BrowserRouter>
  </ChakraProvider>,
  document.getElementById('root')
);

