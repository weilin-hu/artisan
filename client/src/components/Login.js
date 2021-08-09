import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postFetch } from './../fetch/auth';

import './Login.css';

import { BsArrowBarLeft } from 'react-icons/bs';
import { VscSignIn } from "react-icons/vsc";

/**
 * TODO: make Login button text stay on one line when zooming in 
 * @returns 
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { push } = useHistory();

  const goToArtisan = () => {
    push('/home');
  };

  const login = async (e) => {
    e.preventDefault();
    const data = { username : username, password: password };
    const login = await postFetch('http://localhost:5000/login', data);

    if (!login.success) {
      alert(`Login Error: \n${login.error.msg}`);
    } else {
      // save token in localStorage
      localStorage.setItem('token', login.token);
      push('/home');
    }
  };

  const forgotLogin = () => {
    push('/forgotLogin');
  };

  const register = () => {
    push('/register');
  };

  return (
    <div className='background'>
      <div className='drawer'>
        <div className='form-container'>
          <div className='go-back' onClick={goToArtisan}>
            <BsArrowBarLeft size='24'/>
            <span>
              Go to Artisan
            </span>
          </div>
          <div className='form-title'>
            Log In
          </div>
          <div>
            <input placeholder='Username' value = {username} onChange = {(e) => setUsername(e.target.value)}/>
          </div>
          <div>
            <input placeholder='Password' type='password' value = {password} onChange = {(e) => setPassword(e.target.value)}/>
          </div>
          <button onClick={(e) => {login(e)}}>
            <VscSignIn size='25px'/>
            <span>Log In</span>
          </button>
          <div className='additional-options' onClick={forgotLogin}>
            Forgot log in Information?
          </div>
          <div className='additional-options' onClick={register}>
            New User?
          </div>
        </div>
        <div className='user-agreement'>
            By clicking Log In, I confirm that I have read and agree to the Artisan Terms of Service, Privacy Policy, and to receive emails and updates.
        </div>
      </div>
    </div>
  );
};

export default Login;
