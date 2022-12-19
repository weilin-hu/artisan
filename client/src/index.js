import React from 'react';
import ReactDOM from 'react-dom';
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import Board from './components/Board';
import Boards from './components/Boards';

ReactDOM.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> }>
        </Route>
        <Route path='/register' element={ localStorage.getItem('token') ? <Navigate to='/' /> : <Registration/> }>
        </Route>
        <Route path='/login' element={ localStorage.getItem('token') ? <Navigate to='/' /> : <Login/> }>
        </Route>
        <Route path='/board/:id' element={ <Board/> }>
        </Route>
        <Route path='/boards' element={ <Boards/> }>
        </Route>
      </Routes>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById('root')
);