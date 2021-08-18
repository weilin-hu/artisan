import {
  RiHandHeartLine,
  RiUserHeartLine,
} from 'react-icons/ri';

import {
  BsEye,
} from 'react-icons/bs';

import {
  VscFlame,
  VscBriefcase,
} from 'react-icons/vsc';

import {
  Box,
  Center,
  Tooltip,
} from '@chakra-ui/react';

const IconTooltip = ({label, stat}) => {

  return (
    <Tooltip 
      label={label}
      placement='bottom'
      letterSpacing='.2vh'
      backgroundColor='#ffaa0040'
      color='#ffa800'
      fontWeight='normal'
    >
      <Center m='2vh'>
        {label === 'Views' ? <BsEye size='3vh'/> : <></>}
        {label === 'Reputation' ? <VscFlame size='3vh'/> : <></>}
        {label === 'Artifacts' ? <VscBriefcase size='3vh'/> : <></>}
        {label === 'Admirers' ? <RiUserHeartLine size='3vh'/> : <></>}
        {label === 'Admiring' ? <RiHandHeartLine size='3vh'/> : <></>}            
        <Box 
          ml='1.5vh'
          letterSpacing='.15vh'
          fontSize='2vh'
        >
          {stat}
        </Box>
      </Center>
    </Tooltip>
  );
};

export default IconTooltip;
