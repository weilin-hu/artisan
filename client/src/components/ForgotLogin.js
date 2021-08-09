import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './Login.css';

import { BsArrowBarLeft } from 'react-icons/bs';
import { VscSignIn } from "react-icons/vsc";

/**
 * TODO: make Login button text stay on one line when zooming in 
 * @returns 
 */
const ForgotLogin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { push } = useHistory();

  const login = () => {
    push('/');
  };

  const submitUsername = () => {

  };

  const submitEmail = () => {

  };

  return (
    <div className='background'>
      <div className='drawer'>
        <div className='form-container'>
          <div className='go-back' onClick={login}>
            <BsArrowBarLeft size='24'/>
            <span>
              Back to Log In
            </span>
          </div>

          <div className='form-title'>
            Forgot Password?
          </div>

          <div>
            <input placeholder='Username' value = { username } onChange = { (e) => setUsername(e.target.value) }/>
          </div>

          <button onClick={ submitUsername }>
            <VscSignIn size='25px'/>
            <span>Send Email</span>
          </button>
          
          <div className='form-title'>
            Forgot Username?
          </div>

          <div>
            <input placeholder='Email' value = { email } onChange = { (e) => setEmail(e.target.value) }/>
          </div>

          <button onClick={ submitEmail }>
            <VscSignIn size='25px'/>
            <span>Send Email</span>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ForgotLogin;
