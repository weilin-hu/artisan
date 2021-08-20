import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react'

import '../Profile.css';
import PagePreview from './PagePreview';
import SketchbookCover from './SketchbookCover';
import { getNum } from '../functions/helper'

import {
  RiUserHeartLine,
} from 'react-icons/ri';

import {
  BsArrowBarLeft,
} from 'react-icons/bs';

import {
  Box,
  Center,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from '@chakra-ui/react';

import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

const pages = [
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Page 1',
    sketch: 'https://pbs.twimg.com/media/Dhl1JCQUEAA0sX1.jpg',
    admirers: 8454,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Eagle sketching',
    sketch: 'https://pbs.twimg.com/media/EbYxgJ0XkAESgrH.jpg',
    admirers: 3,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'A couple of bears',
    sketch: 'https://pbs.twimg.com/media/EDPMrx-XsAY0xvO.jpg',
    admirers: 344,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Kenyan hyenas',
    sketch: 'https://pbs.twimg.com/media/EhVkpo0XsAM0DoC.jpg',
    admirers: 7437437,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Wild Life',
    sketch: 'https://pbs.twimg.com/media/E4sSRwdWEAcZ8q1.jpg',
    admirers: 743743,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Rocky Perch',
    sketch: 'https://pbs.twimg.com/media/EE35hYfX4AAIiqm.jpg',
    admirers: 7434,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Figure Drawing',
    sketch: 'https://pbs.twimg.com/media/Db6tzSjVMAI_Yi5.jpg',
    admirers: 53,
    nsfw: true,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Page 1',
    sketch: 'https://pbs.twimg.com/media/Dhl1JCQUEAA0sX1.jpg',
    admirers: 8454,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Eagle sketching',
    sketch: 'https://pbs.twimg.com/media/EbYxgJ0XkAESgrH.jpg',
    admirers: 3,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Page 1',
    sketch: 'https://pbs.twimg.com/media/Dhl1JCQUEAA0sX1.jpg',
    admirers: 8454,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Eagle sketching',
    sketch: 'https://pbs.twimg.com/media/EbYxgJ0XkAESgrH.jpg',
    admirers: 3,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'A couple of bears',
    sketch: 'https://pbs.twimg.com/media/EDPMrx-XsAY0xvO.jpg',
    admirers: 344,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Kenyan hyenas',
    sketch: 'https://pbs.twimg.com/media/EhVkpo0XsAM0DoC.jpg',
    admirers: 7437437,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Wild Life',
    sketch: 'https://pbs.twimg.com/media/E4sSRwdWEAcZ8q1.jpg',
    admirers: 743743,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Rocky Perch',
    sketch: 'https://pbs.twimg.com/media/EE35hYfX4AAIiqm.jpg',
    admirers: 7434,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Figure Drawing',
    sketch: 'https://pbs.twimg.com/media/Db6tzSjVMAI_Yi5.jpg',
    admirers: 53,
    nsfw: true,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Page 1',
    sketch: 'https://pbs.twimg.com/media/Dhl1JCQUEAA0sX1.jpg',
    admirers: 8454,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Eagle sketching',
    sketch: 'https://pbs.twimg.com/media/EbYxgJ0XkAESgrH.jpg',
    admirers: 3,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'A couple of bears',
    sketch: 'https://pbs.twimg.com/media/EDPMrx-XsAY0xvO.jpg',
    admirers: 344,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Kenyan hyenas',
    sketch: 'https://pbs.twimg.com/media/EhVkpo0XsAM0DoC.jpg',
    admirers: 7437437,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Wild Life',
    sketch: 'https://pbs.twimg.com/media/E4sSRwdWEAcZ8q1.jpg',
    admirers: 743743,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Rocky Perch',
    sketch: 'https://pbs.twimg.com/media/EE35hYfX4AAIiqm.jpg',
    admirers: 7434,
    nsfw: false,
    date: 946706400000,
  },
  {
    sketchbook: '60cbbbd313c7f548aaeb7f2f',
    title: 'Figure Drawing',
    sketch: 'https://pbs.twimg.com/media/Db6tzSjVMAI_Yi5.jpg',
    admirers: 53,
    nsfw: true,
    date: 946706400000,
  },
];

const Sketchbook = ({ sketchbook, setSketchbook }) => {
  // const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(0);

  const back = (e) => {
    e.preventDefault();
    setSketchbook({});
  }
  
  return (
    <Box>
      {/* BACK BUTTON     */}
      <Flex
        w='20%'
        color='#d89000'
        fontSize='1.5vh'
        
        cursor='pointer'
        _hover={{color: '#ffa800'}}
        _active={{color: '#d89000'}}
        onClick={(e) => back(e)}
      >
        <BsArrowBarLeft size='2.5vh'/>
        <Box ml='0.5vw' alignSelf='center' letterSpacing='0.2vh'>
          Back to Sketchbooks
        </Box>
      </Flex>

      {/* PAGE INPUT  */}
      <Center color='#ffa800aa' letterSpacing='0.2vh' alignSelf='center'>
        <Text mr='0.5vw'>
          PAGE
        </Text>
        <NumberInput 
          maxW='10vh' 
          min={0} 
          max={pages.length}

          focusBorderColor='#ffa800'
          borderColor='whiteAlpha.500'

          defaultValue={selected} 
          value={selected}
          precision={0}
          variant='flushed'
          allowMouseWheel

          onChange={(value) => setSelected(value)}
        >
          <NumberInputField letterSpacing='0.2vh' />
          <NumberInputStepper>
            <NumberIncrementStepper border='none' _hover={{color: '#ffa800'}} _active={{backgroundColor: 'black'}}/>
            <NumberDecrementStepper border='none' _hover={{color: '#ffa800'}} _active={{backgroundColor: 'black'}}/>
          </NumberInputStepper>
        </NumberInput>
        <Text ml='0.5vw' >
          / {pages.length}
        </Text>
      </Center>

      <Flex
        mt='2vh'
        width='100%'
        justifyContent='space-evenly'
      >
        <Flex className='pages-scroll'>
          {pages.map((page, idx) =>
              <PagePreview key={idx} num={idx + 1} page={page} selected={selected} setSelected={setSelected}/>
          )}
        </Flex>
        <Flex 
          w='50vw'
          p='2vh'
          minH='90vh'
          bg='black'
        >
          <Center bg='#444444' w='100%' h='100%'>
            <SketchbookCover sketchbook={sketchbook}/>
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Sketchbook;
