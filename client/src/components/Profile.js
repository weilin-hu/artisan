import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react'
import FeaturedGallery from './FeaturedGallery';
import Details from './Profile/Details';
import './Profile.css';

import { 
    RiEmpathizeLine, 
    RiHandHeartLine, 
    RiHandHeartFill,
    RiUserHeartLine,
    RiUserHeartFill,
  } from 'react-icons/ri';
  
  import {
    BsEnvelope,
    BsExclamationOctagon,
    BsHeart,
    BsHeartHalf,
    BsHeartFill,
    BsThreeDots,
    BsEye,
  } from 'react-icons/bs';
  
  import {
    VscFlame,
    VscBriefcase,
    VscCircleSlash,
  } from 'react-icons/vsc';

import {
    Box,
    Button,
    Center,
    Divider,
    GridItem,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Lorem,
    Text,
    Tooltip,
    Wrap,
    Flex,
    WrapItem,
    Grid,
    IconButton,
  } from '@chakra-ui/react';


const Profile = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [following, setFollowing] = useState(false);
    const [hovering, setHovering] = useState(false);

    const onHover = (e) => {
      e.preventDefault();
      setHovering(true);
    };
  
    const onLeave = (e) => {
      e.preventDefault();
      setHovering(false);
    };
  
    const onClick = (e) => {
      e.preventDefault();
      setFollowing(!following);
    }
    
    const hover = (e) => {
        e.preventDefault();
        console.log('hover');
    };

    const handleSizeClick = (e) => {
        e.preventDefault();
        console.log('click');
        onOpen();
    }

    return (
        <Box>
            <Center
                className='profile-banner'
                display='flex'
                justifyContent='space-evenly'
                zIndex={100}
                onClick={(e) => hover(e)}
            >
                <Image
                    src='https://i.redd.it/armojo64gc031.jpg'
                    boxSize='80px'
                    objectFit='cover'
                    mx='10px'
                    borderRadius='8px'
                    cursor='pointer'
                />
                <Text mx='10px' isTruncated>
                    lona
                </Text>
            </Center>
            <Image 
                width='100%'
                height='300px'
                zIndex={-10}
                objectFit='cover'
                src='https://pbs.twimg.com/media/EuU9HniVkAMkxVI.jpg' 
                alt='Dead Dreams'
            />
            <Flex className='profile-stats' bg='blackAlpha.700' position='absolute'>
                <Flex>
                     <Tooltip 
                         label='Views' 
                         placement='bottom'
                         letterSpacing={2}
                         backgroundColor='#ffaa0040'
                         color='#ffa800'
                         fontWeight='normal'
                     >
                         <Center className='profile-stat' m={4}>
                             <BsEye size={30}/>
                             <Box ml={3}>
                                1,053
                             </Box>
                         </Center>
                     </Tooltip>
                     <Tooltip 
                         label='Reputation' 
                         backgroundColor='#ffaa0040'
                         color='#ffa800'
                         letterSpacing={2}
                         fontWeight='normal'
                         placement='bottom' 
                     >
                         <Center className='profile-stat' m={4}>
                             <VscFlame size={30}/>
                             <Box ml={3}>
                                50.3 K
                             </Box>
                         </Center>
                     </Tooltip>
                     <Tooltip 
                         label='Artifacts' 
                         backgroundColor='#ffaa0040'
                         color='#ffa800'
                         letterSpacing={2}
                         fontWeight='normal'
                         placement='bottom' 
                     >
                         <Center className='profile-stat' m={4}>
                             <VscBriefcase size={30}/>
                             <Box ml={3}>
                                143
                             </Box>
                         </Center>
                     </Tooltip>
                     <Tooltip 
                         label='Admirers' 
                         backgroundColor='#ffaa0040'
                         color='#ffa800'
                         letterSpacing={2}
                         fontWeight='normal'
                         placement='bottom' 
                     >
                         <Center className='profile-stat' m={4}>
                             <RiUserHeartLine size={30}/>
                             <Box ml={3}>
                                 53
                             </Box>
                         </Center>
                     </Tooltip>
                     <Tooltip 
                         label='Admiring' 
                         backgroundColor='#ffaa0040'
                         color='#ffa800'
                         letterSpacing={2}
                         fontWeight='normal'
                         placement='bottom' 
                     >
                         <Center className='profile-stat' m={4}>
                             <RiHandHeartLine size={30}/>
                             <Box ml={3}>
                                 265
                             </Box>
                         </Center>
                     </Tooltip>
                </Flex>
                <Flex>
                    <Center className='profile-button' onMouseOver={(e) => onHover(e)} onMouseLeave={(e) => onLeave(e)} onClick={(e) => onClick(e)}>
                        {hovering ? <BsHeartHalf size={24}/> : following ? <BsHeartFill size={24}/> : <BsHeart size={24}/>}
                    </Center>
                    <Center className='profile-button'>
                        <BsEnvelope size={20}/>
                    </Center>
                    <Menu autoSelect={false}>
                        <MenuButton 
                            m={'6px'}
                            alignSelf='center'
                            as={IconButton} 
                            aria-label='More Options' 
                            icon={<BsThreeDots color='#ffa800' size={24}/>} 
                            variant='ghost'
                            _hover={{ backgroundColor: '#ffaa0040' }}
                            _active={{ backgroundColor: '#ffaa0020' }}
                        />
                        <MenuList
                            backgroundColor='blackAlpha.800'
                            border='none'
                        > 
                            <MenuItem 
                                icon={<VscCircleSlash size={18}/>} 
                                letterSpacing={2}
                                mb={2}
                                _hover={{backgroundColor: '#ffaa0040'}}
                                onClick={(e) => handleSizeClick(e)}
                            >
                                Block
                                <Modal 
                                    size='sm' 
                                    autoFocus={false}
                                    onClose={onClose} 
                                    isOpen={isOpen}
                                >
                                    <ModalOverlay />
                                    <ModalContent backgroundColor='blackAlpha.700'>
                                        <ModalBody color='whiteAlpha.800' letterSpacing='1.5px'>
                                            Are you sure you want to block this user?

                                            This user will no longer be able to see your posts.
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                m={2}
                                                size='sm'
                                                variant='outline' 
                                                colorScheme='blackAlpha'
                                                color='#ffa800'
                                                letterSpacing='1.5px'
                                                onClick={onClose}
                                                _hover={{backgroundColor: '#ffaa0040'}}
                                            >
                                                Block
                                            </Button>
                                            <Button 
                                                m={2}
                                                size='sm'
                                                variant='outline' 
                                                colorScheme='blackAlpha'
                                                color='#ffa800'
                                                letterSpacing='1.5px'
                                                onClick={onClose}
                                                _hover={{backgroundColor: '#ffaa0040'}}
                                            >
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </MenuItem>
                            <MenuItem 
                                icon={<BsExclamationOctagon size={18}/>}
                                letterSpacing={2}
                                mt={2}
                                _hover={{backgroundColor: '#ffaa0040'}}
                                onClick={(e) => handleSizeClick(e)}
                            >
                                Report
                                <Modal 
                                    size='sm' 
                                    autoFocus={false}
                                    onClose={onClose} 
                                    isOpen={isOpen}
                                >
                                    <ModalOverlay />
                                    <ModalContent backgroundColor='blackAlpha.700'>
                                        <ModalBody color='whiteAlpha.800' letterSpacing='1.5px'>
                                            Are you sure you want to report this user?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button 
                                                m={2}
                                                size='sm'
                                                variant='outline' 
                                                colorScheme='blackAlpha'
                                                color='#ffa800'
                                                letterSpacing='1.5px'
                                                onClick={onClose}
                                                _hover={{backgroundColor: '#ffaa0040'}}
                                            >
                                                Report
                                            </Button>
                                            <Button 
                                                m={2}
                                                size='sm'
                                                variant='outline' 
                                                colorScheme='blackAlpha'
                                                color='#ffa800'
                                                letterSpacing='1.5px'
                                                onClick={onClose}
                                                _hover={{backgroundColor: '#ffaa0040'}}
                                            >
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Flex>
                <Box flex={2} width='100%' height='100px' backgroundColor='#141414'>

                </Box>
                <Center p={2} flex={1} flexDirection='column' width='100%' alignSelf='center' justifyContent='center' height={'100%'} backgroundColor='#141414'>
                    <Details />
                </Center>
            </Flex>
        </Box>
    );
};

export default Profile;
