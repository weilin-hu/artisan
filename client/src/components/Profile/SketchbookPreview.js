import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react'

import '../Profile.css';
import { getNum } from '../functions/helper'

import {
  RiUserHeartLine,
} from 'react-icons/ri';

import {
  BsEye,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs';

import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  SlideFade,
  Text,
} from '@chakra-ui/react';

import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

const SketchbookPreview = ({ sketchbook, setSketchbook }) => {
  const [following, setFollowing] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const onHover = (e) => {
    e.preventDefault();
    if (!isOpen) {
      onToggle();
    }
  };
  
  const onLeave = (e) => {
    e.preventDefault();
    if (isOpen) {
      onToggle();
    }
  };
  
  const onClick = (e) => {
    e.preventDefault();
    setFollowing(!following);
  }

  const view = (e) => {
    e.preventDefault();
    setSketchbook(sketchbook);
  };
  
  return (
    <Flex bg='black' direction='column' p='1vh' onMouseOver={(e) => onHover(e)} onMouseLeave={(e) => onLeave(e)} >

      {/* SKETCHBOOK COVER  */}
      <AspectRatio w={'100%'} ratio={4/5}>
        <Box>
          <SlideFade in={isOpen} offsetY='40vh' className='sketchbook-preview'>
            <Flex className='sketchbook-preview'>

              {/* SKETCHBOOK TITLE and DATE CREATED*/}
              <Flex flexDirection='column' alignItems='center' mx='2vh'>
                <Text className='sketchbook-preview-title' isTruncated>
                  {sketchbook.title}
                </Text>
                <Text className='sketchbook-preview-date-created'>
                  Created {dayjs(sketchbook.date_created).fromNow()} on
                </Text>
                <Text className='sketchbook-preview-date' >
                  {dayjs(sketchbook.date_created).format('ll')}
                </Text>
              </Flex>

              {/* SKETCHBOOK STATS  */}
              <Center color='#ffaa00cc'>
                <Center mx='1.5vh'>
                  <BsEye size='2vh'/>        
                  <Box className='sketchbook-preview-stats'>
                    {getNum(sketchbook.views)}
                  </Box>
                </Center>
                <Divider orientation='vertical' opacity='40%' />
                <Center mx='1.5vh'>
                  <RiUserHeartLine size='2vh'/>        
                  <Box className='sketchbook-preview-stats'>
                    {getNum(sketchbook.admirers)}
                  </Box>
                </Center>
              </Center>

              {/* FOLLOW USER */}
              <Center className='profile-button' onClick={(e) => onClick(e)}>
                {following ? <BsHeartFill size='2.2vh'/> : <BsHeart size='2.2vh'/>}
              </Center>
              
              <Button 
                colorScheme='blackAlpha' 
                variant='outline' 
                my={4}
                size='md'
                letterSpacing='0.3vh'
                fontWeight='light'
                color='#d89000' 
                backgroundColor='#00000033' 
                _hover={{ color: '#ffa800' }}
                _active={{ color: '#d89000', background: '#00000088'}}
                onClick={(e) => {view(e)}}
              >
                VIEW
              </Button>

              <Box className='sketchbook-preview-last-modified' mx='2vh'>
                Last modified {dayjs(sketchbook.last_updated).fromNow()}
              </Box>

            </Flex>          
          </SlideFade>

          {/* SKETCHBOOK COVER  */}
          <Image 
            cursor='pointer'
            boxSize='100%'
            objectFit='cover'
            alt={sketchbook.title}
            src={sketchbook.cover}
          />
          
        </Box>
      </AspectRatio>

      <SlideFade in={!isOpen} offsetY='-40vh'>
        <Flex className='sketchbook-preview-collapsed'>
          {/* SKETCHBOOK TITLE  */}
          <Text className='sketchbook-preview-title' isTruncated>
            {sketchbook.title}
          </Text>

          <Center color='#ffaa00cc'>
            <Center mx='1.5vh'>
              <BsEye size='2vh'/>        
              <Box className='sketchbook-preview-stats'>
                  {getNum(sketchbook.views)}
              </Box>
            </Center>
            <Divider orientation='vertical' opacity='40%' />
            <Center mx='1.5vh'>
              <RiUserHeartLine size='2vh'/>        
              <Box className='sketchbook-preview-stats'>
                {getNum(sketchbook.admirers)}
              </Box>
            </Center>
          </Center>
        </Flex>              
      </SlideFade>
    </Flex>
  );
};

export default SketchbookPreview;
