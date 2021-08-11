import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postFetch } from './../fetch/auth';

import './Login.css';

import { BsArrowBarLeft, BsEnvelope } from 'react-icons/bs';
import { Box, Button, Input, Flex } from '@chakra-ui/react';

const inputStyle = {
  color: '#ffffff7e',
  letterSpacing: 2,
  opacity: '60%',
}
/**
 * TODO: make Login button text stay on one line when zooming in 
 * @returns 
 */
const ForgotLogin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const[error1, setError1] = useState('');
  const[error2, setError2] = useState('');
  const { push } = useHistory();

  const login = () => {
    push('/login');
  };

  const submitUsername = async (e) => {
    e.preventDefault();
    const data = { username: username };
    const response = await postFetch('http://localhost:5000/forgotPassword', data);

    if (!response.success) {
      setError1(response.error.msg);
    } else {
      setError1('Email sent.');
    }
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    const data = { email: email };
    const response = await postFetch('http://localhost:5000/forgotUsername', data);

    if (!response.success) {
      setError2(response.error.msg);
    } else {
      setError2('Email sent.');
    }
  };

  return (
    <Box className='background'>
      <Flex className='drawer'>
        <Box>
          <Flex className='back' onClick={login}>
            <BsArrowBarLeft size='24'/>
            <Box ml='2%' alignSelf='center' letterSpacing={1}>
              Back to Log In
            </Box>
          </Flex>

          <Box my={15} letterSpacing={3} color='white' fontSize='3xl' fontWeight='bold'>
            Forgot Password?
          </Box>
          
          <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
          <Box color='#BD52FF' opacity={'80%'} fontSize={14}>{error1}</Box>

          <Button leftIcon={<BsEnvelope color='BD52FF' size={18}/>} colorScheme='blackAlpha' variant='outline' 
            my={4}
            size={'sm'}
            fontWeight={'medium'}
            color='#BD52FF' 
            backgroundColor='#00000033' 
            letterSpacing={2}
            _hover={{ backgroundColor: '#bd52ff11' }}
            onClick={(e) => {submitUsername(e)}}
          >
            Send Email
          </Button>
          
          <Box my={15} letterSpacing={3} color='white' fontSize='3xl' fontWeight='bold'>
            Forgot Username?
          </Box>

          <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          />
          <Box color='#BD52FF' opacity={'80%'} fontSize={14}>{error2}</Box>

          <Button leftIcon={<BsEnvelope color='BD52FF' size={18}/>} colorScheme='blackAlpha' variant='outline' 
            my={4}
            size={'sm'}
            fontWeight={'medium'}
            color='#BD52FF' 
            backgroundColor='#00000033' 
            letterSpacing={2}
            _hover={{ backgroundColor: '#bd52ff11' }}
            onClick={(e) => {submitEmail(e)}}
          >
            Send Email
          </Button>
        </Box>        
      </Flex>
    </Box>
  );
};

export default ForgotLogin;
