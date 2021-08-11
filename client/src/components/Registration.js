import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postFetch, getFetch } from './../fetch/auth';

import './Login.css';

import { BsArrowBarLeft, BsClipboard, BsChevronDown, BsEyeSlash, BsEye, BsX, BsCheck } from 'react-icons/bs';

import { Box, Button, Select, Input, Flex, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const year = new Date().getFullYear();
const years = Array(120).fill().map((_, idx) => year - idx);

const inputStyle = {
  color: 'white',
  letterSpacing: 2,
  opacity: '40%',
}

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [month, setMonth] = useState('Month');
  const [day, setDay] = useState('Day');
  const [year, setYear] = useState('Year');

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);
  const handleShowConfirm = () => setShowConfirm(!showConfirm);

  const [userError, setUserError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  const { push } = useHistory();

  const register = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('Password and confirmed password must be the same');
      return;
    }

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
      alert('Password should be 6 to 50 characters, contain at least one numeric digit, one uppercase, and one lowercase letter');
      return;
    }

    const data = {
      username: username,
      password: password,
      email: email,
      birth_month: month,
      birth_day: day,
      birth_year: year,
    };
    const response = await postFetch('http://localhost:5000/register', data);
    if (!response.success) {
      alert(`Registration Error: \n${response.error.msg}`);
      return;
    } else {
      alert(`Registered successfully with username ${username}!`);
      push('/login');
    }
  };

  const login = () => {
      push('/login');
  };

  const onChangeUsername = async (e) => {
    if (!e.target.value) {
      setUserError('Please select a username');
    } else {
      const data = await getFetch(`http://localhost:5000/user/${e.target.value}`);
      if (data.success) {
        setUserError('Username taken');
      } else {
        setUserError('');
      }
    }
    setUsername(e.target.value);
  };

  const onChangeEmail = async (e) => {
    if (!e.target.value.match(/\S+@\S+\.\S+/)) {
      setEmailError('Please enter a valid email.');
    } else {
      setEmailError('');
    }
    setEmail(e.target.value)
  };

  const onChangePassword = (e) => {
    if (!e.target.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
      setPassError('Password must contain at least one digit, lower and uppercase letter, and be between 6-50 characters.');
    } else if (e.target.value !== confirm) {
      setPassError('Passwords do not match');
    } else {
      setPassError('');
    }
    setPassword(e.target.value);
  };

  const onChangeConfirm = (e) => {
    if (password !== e.target.value) {
      setPassError('Passwords do not match');
    } else if (!e.target.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/)) {
      setPassError('Password must contain at least one digit, lower and uppercase letter, and be between 6-50 characters.');
    } else if (password === e.target.value) {
      setPassError('');
    }

    setConfirm(e.target.value);
  };

  return (
    <Box className='background'>
      <Flex className='drawer'>
        <Box>
          <Flex className='back' onClick={login}>
            <BsArrowBarLeft size='24'/>
            <Box ml='2%' alignSelf='center' letterSpacing={1}>
              Back
            </Box>
          </Flex>

          <Box my={15} letterSpacing={3} color='white' fontSize='5xl' fontWeight='bold'>
            Register
          </Box>

          <Formik onSubmit={register}>
            <Form>
              <InputGroup>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' placeholder='Username' onChange={(e) => onChangeUsername(e)}/>
                <InputRightElement color='#9d00ff' mt={2}>
                  {userError ? <BsX size={24}/> : <BsCheck size={24}/>}
                </InputRightElement>
              </InputGroup>
              <Box color='#BD52FF' opacity={'80%'} fontSize={14}>{userError}</Box>
              
              <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' mt={4} placeholder='Email' onChange={(e) => onChangeEmail(e)}/>
              <Box color='#BD52FF' opacity={'80%'} fontSize={14}>{emailError}</Box>

              <InputGroup>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' mt={4} type={showPass ? 'text' : 'password'} placeholder='Password' onChange={(e) => onChangePassword(e)}/>
                <InputRightElement onClick={handleShowPass} mt={6} color='#9d00ff' cursor='pointer' _hover={{ color: '#BD52FF'}} _active={{ color: '#bd52ff80' }}>
                  {showPass ? <BsEyeSlash size={24}/> : <BsEye size={24}/>}
                </InputRightElement>
              </InputGroup>

              <InputGroup>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#BD52FF' size='lg' mt={4} type={showConfirm ? 'text' : 'password'} placeholder='Confirm Password' onChange={(e) => onChangeConfirm(e)}/>
                <InputRightElement onClick={handleShowConfirm} mt={6} color='#9d00ff' cursor='pointer' _hover={{ color: '#BD52FF'}} _active={{ color: '#bd52ff80' }}>
                  {showConfirm ? <BsEyeSlash size={24}/> : <BsEye size={24}/>}
                </InputRightElement>
              </InputGroup>
              <Box color='#BD52FF' opacity={'80%'} fontSize={14}>{passError}</Box>

              <Box color='white' opacity='35%' fontSize='lg' letterSpacing={2} mt={8}>
                Birthday
              </Box>
              <Flex color='#ffffff7e' mt={-2}>
                <Select style={inputStyle} flex={5} icon={<BsChevronDown/>} variant='flushed' focusBorderColor='#BD52FF' size='lg' mt={4} placeholder='Month' onChange={(e) => setMonth(e.target.value)}>
                  {months.map((month, idx) => <option key={idx}>{month}</option>)}
                </Select>
                <Select style={inputStyle} flex={3} icon={<BsChevronDown/>} variant='flushed' focusBorderColor='#BD52FF' size='lg' mt={4} placeholder='Day' onChange={(e) => setDay(e.target.value)}>
                  {days.map((day, idx) => <option key={idx}>{day}</option>)}
                </Select>
                <Select style={inputStyle} flex={4} variant='flushed' icon={<BsChevronDown/>} focusBorderColor='#BD52FF' size='lg' mt={4} placeholder='Year' onChange={(e) => setYear(e.target.value)}>
                  {years.map((year, idx) => <option key={idx}>{year}</option>)}
                </Select>
              </Flex>

              <Button leftIcon={<BsClipboard color='FFA800' size={24}/>} colorScheme='blackAlpha' variant='outline' 
                my={8} 
                size={'lg'}
                color='#FFA800' 
                backgroundColor='#00000033' 
                _hover={{ backgroundColor: '#ffaa001c' }}
                onClick={(e) => {register(e)}}
              >
                JOIN
              </Button>
            </Form>          
          </Formik>
        </Box>
        <Box className='user-agreement'>
          By clicking Join, I confirm that I have read and agree to the Artisan Terms of Service, Privacy Policy, and to receive emails and updates.
        </Box>
      </Flex>
    </Box>
  );
};

export default Registration;
