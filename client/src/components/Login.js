import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { postFetch } from '../fetch/fetch';

import './Auth.css';

import { BsEyeSlash, BsEye, BsExclamation } from 'react-icons/bs';
import { VscSignIn } from 'react-icons/vsc';
import { Box, Button, Input, Flex, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Formik, Form } from 'formik';


const inputStyle = {
  color: '#ffffff7e',
  letterSpacing: 2,
  opacity: '60%',
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const toast = useToast();
  let navigate = useNavigate();

  const handleShow = () => setShow(!show);

  const login = async (e) => {
    e.preventDefault();
    const data = { username : username, password: password };
    const login = await postFetch('http://localhost:8080/login', data);

    if (!login.success) {
      toast({
        position: 'top',
        render: () => (
          <Box className='error-toast'>
            <BsExclamation size={24}/>
            <Box>
              {login.error.msg}
            </Box>
          </Box>
        ),
      })
    } else {
      // save token in localStorage
      localStorage.setItem('token', login.token);
      navigate('/home');
    }
  };

  const register = () => {
    navigate('/register');
  };

  return (
    <Box className='background'>
      <Flex className='drawer'>
        <Box>
          <Box my={15} letterSpacing={3} color='white' fontSize='5xl' fontWeight='bold'>
            Log In
          </Box>

          <Formik onSubmit={(e) => {login(e)}}>
            <Form>
              <Input style={inputStyle} variant='flushed' focusBorderColor='#823C40' size='lg' placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
              />

              <InputGroup>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#823C40' size='lg' my={6} type={show ? 'text' : 'password'} placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement onClick={handleShow} mt={8} color='#823C40' cursor='pointer' _hover={{ color: '#823C40'}} _active={{ color: '#823C4080' }}>
                  {show ? <BsEyeSlash size={24}/> : <BsEye size={24}/>}
                </InputRightElement>
              </InputGroup>

              <Button 
                leftIcon={<VscSignIn color='FFA800' size={24}/>} 
                colorScheme='blackAlpha' 
                variant='outline' 
                my={4}
                size={'lg'}
                letterSpacing={1.5}
                fontWeight={'medium'}
                color='#FFA800' 
                backgroundColor='#00000033' 
                _hover={{ backgroundColor: '#ffaa001c' }}
                onClick={(e) => {login(e)}}
              >
                Log In
              </Button>
            </Form>          
          </Formik>

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
