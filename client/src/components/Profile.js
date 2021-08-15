
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
    BsHeart,
    BsHeartHalf,
    BsHeartFill,
    BsThreeDots,
    BsEye,
  } from 'react-icons/bs';
  
  import {
    VscFlame,
    VscBriefcase,
  } from 'react-icons/vsc';

import { 
    Box,
    Button,
    Center,
    GridItem,
    Image,
    Wrap,
    Flex,
    WrapItem,
    Grid,
  } from '@chakra-ui/react';


const Profile = () => {

    return (
        <Box>
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
                    <Center className='profile-stat' mx={4}> 
                        <BsEye size={30}/>
                        <Box ml={2}>
                            1,053
                        </Box>
                    </Center>
                    <Center className='profile-stat' mx={4}>
                        <VscFlame size={30}/>
                        <Box ml={2}>
                            50.3 K
                        </Box>
                    </Center>
                    <Center className='profile-stat' mx={4}>
                        <VscBriefcase size={30}/>
                        <Box ml={2}>
                            143
                        </Box>
                    </Center>
                    <Center className='profile-stat' mx={4}>
                        <RiUserHeartLine size={30}/>
                        <Box  ml={2}>
                            53
                        </Box>
                    </Center>
                    <Center className='profile-stat' mx={4}>
                        <RiHandHeartLine size={30}/>
                        <Box ml={3}>
                            265
                        </Box>
                    </Center>
                </Flex>
                <Flex>
                    <Center className='profile-button'>
                        <BsHeart size={20}/>
                    </Center>
                    <Center className='profile-button'>
                        <BsEnvelope size={20}/>
                    </Center>
                    <Center mx={2}>
                        <BsThreeDots size={24}/>
                    </Center>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Profile;
