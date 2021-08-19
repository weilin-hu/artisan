import { useState } from 'react';

import '../Profile.css';

import {
  RiUserHeartLine,
} from 'react-icons/ri';

import {
  BsEye,
  BsHeart,
  BsHeartHalf,
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
  Text,
} from '@chakra-ui/react';

const SketchbookPreview = ({ sketchbook }) => {
  const [hovering, setHovering] = useState(false);
  const [following, setFollowing] = useState(false);

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

  const view = (e) => {
    e.preventDefault();
    console.log('view');
  };
  {console.log(new Date(sketchbook.last_updated))}
  
  return (
    <Flex bg='black' direction='column' p='1vh' onMouseOver={(e) => onHover(e)} onMouseLeave={(e) => onLeave(e)} >

      {/* SKETCHBOOK COVER  */}
      <AspectRatio w={'100%'} ratio={4/5}>
        <Box>
        {hovering ? 
        <Flex className='sketchbook-preview'>
          {/* SKETCHBOOK TITLE  */}
          <Text className='sketchbook-preview-title' isTruncated>
            {sketchbook.title}
          </Text>

          <Box className='sketchbook-preview-last-modified' mx='2vh'>
            Created {new Date(sketchbook.date_created).getFullYear()}
          </Box>

          {/* SKETCHBOOK STATS  */}
          <Center color='#ffaa00cc'>
            <Center mx='1.5vh'>
              <BsEye size='2vh'/>        
              <Box ml='1.5vh' letterSpacing='.15vh' fontSize='1.5vh'>
                {sketchbook.views}
              </Box>
            </Center>
            <Divider orientation='vertical' opacity='40%' />
            <Center mx='1.5vh'>
              <RiUserHeartLine size='2vh'/>        
              <Box ml='1.5vh' letterSpacing='.15vh' fontSize='1.5vh'>
                {sketchbook.admirers}
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
            color='#FFA800' 
            backgroundColor='#00000033' 
            _hover={{ backgroundColor: '#ffaa0040' }}
            onClick={(e) => {view(e)}}
          >
            VIEW
          </Button>

          <Box className='sketchbook-preview-last-modified' mx='2vh'>
            Last modified {new Date(sketchbook.last_updated).getMonth()} {new Date(sketchbook.last_updated).getFullYear()}
          </Box>

        </Flex>
        :
        <></>}
        <Image 
          cursor='pointer'
          boxSize='100%'
          objectFit='cover'
          alt={sketchbook.title}
          src={sketchbook.cover}
        />
          
        </Box>
      </AspectRatio>

      {!hovering ?
      <Flex className='sketchbook-preview-collapsed'>
        {/* SKETCHBOOK TITLE  */}
        <Text className='sketchbook-preview-title' isTruncated>
          {sketchbook.title}
        </Text>

        <Center color='#ffaa00cc'>
          <Center mx='1.5vh'>
            <BsEye size='2vh'/>        
            <Box ml='1.5vh' letterSpacing='.15vh' fontSize='1.5vh'>
              {sketchbook.views}
            </Box>
          </Center>
          <Divider orientation='vertical' opacity='40%' />
          <Center mx='1.5vh'>
            <RiUserHeartLine size='2vh'/>        
            <Box ml='1.5vh' letterSpacing='.15vh' fontSize='1.5vh'>
              {sketchbook.admirers}
            </Box>
          </Center>
        </Center>
      </Flex>
      :
      <></>
      }
    </Flex>
  );
};

export default SketchbookPreview;
