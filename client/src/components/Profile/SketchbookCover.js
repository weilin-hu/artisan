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


const SketchbookCover = ({ sketchbook }) => {
  const [following, setFollowing] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  
  const onClick = (e) => {
    e.preventDefault();
    setFollowing(!following);
  }
  
  return (
    <Center
      display='flex'
      flexDirection='column'
      maxH='90vh' 
      h='100%' 
      w='100%'
    >
      {/* SKETCHBOOK COVER  */}
      <Image 
        h='100%' 
        w='100%'
        verticalAlign='center'
        objectFit='contain'
        
        cursor='pointer'
        alt={sketchbook.title}
        src={sketchbook.cover}
      />
      <Box
        height='10vh'
        my='-10vh'
        bg='whiteAlpha.600'
        w='100%'
        zIndex={10}
      >
        blah
      </Box>
    </Center>
  );
};

export default SketchbookCover;
