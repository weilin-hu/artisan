import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { postFetch } from './../fetch/auth';

import './Auth.css';

import { BsArrowBarLeft, BsEnvelope, BsExclamation, BsCheck } from 'react-icons/bs';
import { Box, Button, Input, Flex } from '@chakra-ui/react';

const inputStyle = {
  color: '#ffffff7e',
  letterSpacing: 2,
  opacity: '60%',
}
const ForgotLogin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();

  const { push } = useHistory();

  const login = () => {
    push('/login');
  };

  const submitUsername = async (e) => {
    e.preventDefault();
    const data = { username: username };
    const response = await postFetch('http://localhost:5000/forgotPassword', data);

    if (!response.success) {
      toast({
        position: 'top',
        render: () => (
          <Box className='error-toast'>
            <BsExclamation size={24}/>
            <Box>
              {response.error.msg}
            </Box>
          </Box>
        ),
      })
    } else {
      toast({
        position: 'top',
        render: () => (
          <Box className='success-toast'>
            <BsCheck size={24}/>
            <Box ml={'2%'}>
              Email Sent
            </Box>
          </Box>
        ),
      });
    }
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    const data = { email: email };
    const response = await postFetch('http://localhost:5000/forgotUsername', data);

    if (!response.success) {
      toast({
        position: 'top',
        render: () => (
          <Box className='error-toast'>
            <BsExclamation size={24}/>
            <Box>
              {response.error.msg}
            </Box>
          </Box>
        ),
      })
    } else {
      toast({
        position: 'top',
        render: () => (
          <Box className='success-toast'>
            <BsCheck size={24}/>
            <Box ml={'2%'}>
              Email Sent
            </Box>
          </Box>
        ),
      });
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
