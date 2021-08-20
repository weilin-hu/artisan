import { useState } from 'react';

import '../Profile.css';

import {
  AspectRatio,
  Box,
  Image,
} from '@chakra-ui/react';

import dayjs from 'dayjs';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);


const PagePreview = ({ num, page, selected, setSelected }) => {
  const onClick = (e) => {
    e.preventDefault();
    setSelected(num);
  };
  
  return (
      <Box onClick={(e) => onClick(e)}>
      {selected == num ?   
        <AspectRatio 
          w='10vh' 
          h='10vh' 
          ratio={1}
          mr='0.5vh'

          borderColor='#ffa800'
          borderWidth='0.4vh'

          opacity='100%'
          _hover={{opacity: '90%'}}
        >
          <Image 
            cursor='pointer'
            objectFit='cover'
            alt={page.title}
            src={page.sketch}
          />
        </AspectRatio>    
      :
        <AspectRatio 
          w='10vh' 
          h='10vh' 
          mr='0.5vh'
          opacity='60%'
          _hover={{opacity: '90%'}}
          ratio={1} 
        >
          <Image 
            cursor='pointer'
            objectFit='cover'
            alt={page.title}
            src={page.sketch}
          />
        </AspectRatio>
      }
    </Box>
  );
};

export default PagePreview;
