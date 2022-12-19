import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Image,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { BsClipboard, BsList, BsLayoutWtf } from 'react-icons/bs';
import { VscSignOut, VscAccount } from 'react-icons/vsc';
import { NavLinkStyle, registerButtonStyle } from '../style/NavStyle';

const Links = ['PAGE 1', 'PAGE 2', 'MOOD BOARDS'];

const NavLink = ({ children }) => (
    localStorage.getItem('token') ?
    <Link
        style={NavLinkStyle}
        h={16}
        p={5}
        color={'gray.500'}
        _hover={{ color: 'teal.700', bgColor: 'gray.900' }}
        _active={{ color: 'teal.800', bgColor: 'gray.900' }}
        href={''}
    >
        <Flex>
            {(children === 'MOOD BOARDS') ? <BsLayoutWtf size={24}/> : <></>}
            <Box ml={2}>
                {children}
            </Box>
        </Flex>
    </Link> :
    <></>
);

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const login = (e) => {
    e.preventDefault();
    navigate('/login');
  }

  return (
    <>
      <Box bg={'gray.800'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            h={16}
            rounded={'none'}
            mr={2}
            p={1}
            display={{ md: 'none' }}
            bg='none'
            icon={isOpen ? <BsList color='#2C7A7B' size={36}/> : <BsList color='#B7791F' size={36}/>}
            _hover={{ bgColor: 'gray.900' }}
            _active={{ bgColor: 'gray.900' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'} height='20px'>
            <Button variant='link'>
                <Image  src={require('../images/logo.png')} alt='logo' h={14} />
            </Button>
            <HStack display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'} spacing={2}>
            {!localStorage.getItem('token') ?
            <>
                <Button 
                    h={16}
                    p={4}
                    size={'lg'}
                    colorScheme='blackAlpha' 
                    variant='ghost'
                    letterSpacing={1.5}
                    fontWeight={'normal'}
                    color='yellow.600' 
                    backgroundColor='gray.800' 
                    _hover={{ color: 'yellow.700', backgroundColor: 'gray.900' }}
                    _active={{ color: 'yellow.800', backgroundColor: 'gray.900' }}
                    onClick={(e) => login(e)}
                >
                    Log In
                </Button>
                <Button 
                    style={registerButtonStyle}
                    leftIcon={<BsClipboard color={'#B7791F'} size={24} />}
                    h={16}
                    rounded={'none'}
                    p={4}
                    size={'lg'}
                    colorScheme='blackAlpha' 
                    variant='outline'
                    fontWeight={'normal'}
                    color='yellow.500' 
                    backgroundColor='gray.800' 
                    _hover={{ color: 'yellow.600', backgroundColor: 'gray.900' }}
                    _active={{ color: 'yellow.700', backgroundColor: 'gray.900' }}
                    onClick={() => navigate('/register')}
                >
                    Register
                </Button>
            </>
            :
            <Menu>
                <MenuButton
                    rounded={'full'}
                    variant={'link'}
                    minW={0}>
                    <Avatar
                        size={'md'}
                        src={'https://bit.ly/dan-abramov'}
                    />
                </MenuButton>
                <MenuList bgColor='gray.600' rounded={4} border='none'>
                    <MenuItem 
                        _hover={{ color: 'gray.500', bgColor: 'gray.700' }}
                        onClick={() => navigate('/')}
                    >
                        <HStack>
                            <VscAccount color='#718096' size={20}/>
                            <Box letterSpacing={1.5}>
                                Profile
                            </Box>
                        </HStack>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        color={'gray.400'}
                        _hover={{ color: 'gray.500', bgColor: 'gray.700' }}
                        onClick={(e) => logout(e)}
                    >
                        <HStack>
                            <VscSignOut color='#718096' size={20}/>
                            <Box letterSpacing={1.5}>
                                Log Out
                            </Box>
                        </HStack>
                    </MenuItem>
                </MenuList>
            </Menu>
            }
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack spacing={2}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default NavBar;
