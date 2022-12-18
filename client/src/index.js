import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import Board from './components/Board';

ReactDOM.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={ <Home/> }>
        </Route>
        <Route path='/register' element={ <Registration/> }>
        </Route>
        <Route path='/login' element={ <Login/> }>
        </Route>
        <Route path='/board/:id' element={ <Board/> }>
        </Route>
      </Routes>
    </BrowserRouter>,
  </ChakraProvider>,
  document.getElementById('root')
);