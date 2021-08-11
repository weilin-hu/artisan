import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postFetch } from './../fetch/auth';

import './Login.css';

import { BsArrowBarLeft, BsEyeSlash, BsEye } from 'react-icons/bs';
import { VscSignIn } from 'react-icons/vsc';
import { Box, Button, Input, Flex, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

const inputStyle = {
  color: '#ffffff7e',
  letterSpacing: 2,
  opacity: '60%',
}

/**
 * TODO: make Login button text stay on one line when zooming in 
 * @returns 
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);
  const { push } = useHistory();

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

  const goToArtisan = () => {
    push('/home');
  };

  const forgotLogin = () => {
    push('/forgotLogin');
  };

  const register = () => {
    push('/register');
  };

  return (
    <Box className='background'>
      <Flex className='drawer'>
        <Box>
          <Flex className='back' onClick={goToArtisan}>
            <BsArrowBarLeft size='24'/>
            <Box ml='2%' alignSelf='center' letterSpacing={1}>
              Go to Artisan
            </Box>
          </Flex>

          <Box my={15} letterSpacing={3} color='white' fontSize='5xl' fontWeight='bold'>
            Log In
          </Box>

          <Formik onSubmit={(e) => login(e)}>
            <Form>
              <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
              />

              <InputGroup>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' my={6} type={show ? 'text' : 'password'} placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement onClick={handleShow} mt={8} color='#9d00ff' cursor='pointer' _hover={{ color: '#BD52FF'}} _active={{ color: '#bd52ff80' }}>
                  {show ? <BsEyeSlash size={24}/> : <BsEye size={24}/>}
                </InputRightElement>
              </InputGroup>

              <Button 
                leftIcon={<VscSignIn color='FFA800' size={24}/>} 
                colorScheme='blackAlpha' 
                variant='outline' 
                my={4}
                size={'lg'}
                color='#FFA800' 
                backgroundColor='#00000033' 
                _hover={{ backgroundColor: '#ffaa001c' }}
                onClick={(e) => {login(e)}}
              >
                JOIN
              </Button>
            </Form>          
          </Formik>

          <Box className='additional-options' onClick={forgotLogin}>
            Forgot log in Information?
          </Box>
          <Box className='additional-options' onClick={register}>
            New User?
          </Box>

        </Box>
        <Box className='user-agreement'>
            By clicking Log In, I confirm that I have read and agree to the Artisan Terms of Service, Privacy Policy, and to receive emails and updates.
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
