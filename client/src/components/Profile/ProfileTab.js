import {
  Tab,
  Text,
} from '@chakra-ui/react';

import {
  BsLayoutWtf,
  BsViewList,
} from 'react-icons/bs';

import {
  VscSplitHorizontal
} from 'react-icons/vsc';

const ProfileTab = ({ label }) => {
  return (
    <Tab 
      letterSpacing='0.5vh'
      color='#ffaa0080'
      borderColor='#7c5300'
      _active={{ color: '#ffa800', background: '#ffaa0040' }}
      _selected={{ color: '#ffa800', background: '#ffaa0020', borderColor: '#ffa800' }}
    >
      {label === 'EXPO' ? <BsLayoutWtf size='2vh'/> : <></>}
      {label === 'SKETCHBOOKS' ? <VscSplitHorizontal size='2vh'/> : <></>}
      {label === 'ACTIVITY' ? <BsViewList size='2vh'/> : <></>}
      <Text ml='1vh'>
        {label}
      </Text>
    </Tab>
  );
};

export default ProfileTab;
