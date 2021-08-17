import { useState } from 'react';
import './Profile.css';

import {
    Box,
    Flex,
    Image,
} from '@chakra-ui/react';


const Artifact = ({ artifact }) => {

    return (
        <Flex>
          <Image 
            cursor='pointer'
            boxSize='200px'
            objectFit='cover'
            alt={artifact.title}
            src={artifact.url}
          />
        </Flex>
    );
};

export default Artifact;
