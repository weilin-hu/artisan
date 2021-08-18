import { useState } from 'react';
import './Profile.css';

import {
  AspectRatio,
  Flex,
  Image,
} from '@chakra-ui/react';


const Artifact = ({ artifact }) => {

    return (
        <Flex>
          <AspectRatio w={'100%'} ratio={1}>
            <Image 
              cursor='pointer'
              objectFit='cover'
              alt={artifact.title}
              src={artifact.url}
            />
          </AspectRatio>
        </Flex>
    );
};

export default Artifact;
