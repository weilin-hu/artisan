import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './Login.css';

import { BsArrowBarLeft } from 'react-icons/bs';

/**
 * TODO: make Login button text stay on one line when zooming in 
 * @returns 
 */
const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const { push } = useHistory();

  const register = () => {
    push('/');
  };

  const login = () => {
      push('/login');
  };

  return (
    <div className='background'>
      <div className='drawer'>
        <div className='form-container'>
          <div className='go-back' onClick={login}>
            <BsArrowBarLeft size='24'/>
            <span>
              Back
            </span>
          </div>

          <div className='form-title'>
            Register
          </div>

          <div>
            <input placeholder='Username' value = { username } onChange = { (e) => setUsername(e.target.value) }/>
          </div>
          <div>
            <input placeholder='Email' value = { email } onChange = { (e) => setEmail(e.target.value) }/>
          </div>
          <div>
            <input placeholder='Password' type='password' value = { password } onChange = { (e) => setPassword(e.target.value) }/>
          </div>
          <div>
            <input placeholder='Confirm Password' type='password' value = { confirm } onChange = { (e) => setConfirm(e.target.value) }/>
          </div>

          <button onClick={ register }>
            <span>JOIN</span>
          </button>
        </div>
        <div className='user-agreement'>
            By clicking Join, I confirm that I have read and agree to the Artisan Terms of Service, Privacy Policy, and to receive emails and updates.
        </div>
      </div>
    </div>
  );
};

export default Registration;
