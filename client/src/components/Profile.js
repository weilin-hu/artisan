import { useState } from 'react';
import { getNum } from './functions/helper'

import './Profile.css';

import IconTooltip from './Profile/IconTooltip';
import BlockModal from './Profile/BlockModal';
import ReportModal from './Profile/ReportModal';
import Details from './Profile/Details';
import ProfileTab from './Profile/ProfileTab';
import ExpoPanel from './Profile/ExpoPanel';
import SketchbookPanel from './Profile/SketchbookPanel';
import ActivityPanel from './Profile/ActivityPanel';
  
import {
  BsEnvelope,
  BsHeart,
  BsHeartFill,
  BsThreeDots,
} from 'react-icons/bs';

import {
  Box,
  Center,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';


const Profile = () => {
    const [following, setFollowing] = useState(false);
    const [hovering, setHovering] = useState(false);

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
    
    const hover = (e) => {
        e.preventDefault();
        console.log('hover');
    };

    return (
      <Box>
        {/* PROFILE BANNER */}
        <Center className='profile-banner' onClick={(e) => hover(e)}>
          <Image
              src='https://i.redd.it/armojo64gc031.jpg'
              boxSize='10vh'
              objectFit='cover'
              borderRadius='.5vh'
          />
          <Text 
              ml='2vh' 
              fontSize='2vh' 
              maxWidth='36vh' 
              isTruncated
          >
              lona
          </Text>
        </Center>
        
        {/* COVER PHOTO */}
        <Image 
            src='https://pbs.twimg.com/media/EzOzJfkVUAQ1jKz.jpg' 
            alt='Dead Dreams'
            width='100%'
            height='33vh'
            zIndex={-1}
            objectFit='cover'
        />

        <Flex className='profile-bar' bg='blackAlpha.700' position='absolute'>
          {/* PROFILE STATS */}
          <Flex>
            <IconTooltip label='Views' stat={getNum(2363232)}/>
            <IconTooltip label='Reputation' stat={getNum(85475473)}/>
            <IconTooltip label='Artifacts' stat={getNum(143)}/>
            <IconTooltip label='Admirers' stat={getNum(51290)}/>
            <IconTooltip label='Admiring' stat={getNum(1424)}/>
          </Flex>

          <Center >
            {/* FOLLOW USER */}
            <Center 
              className='profile-button' 
              onMouseOver={(e) => onHover(e)} 
              onMouseLeave={(e) => onLeave(e)} 
              onClick={(e) => onClick(e)}
            >
              {following ? <BsHeartFill size='2.2vh'/> : <BsHeart size='2.2vh'/>}
            </Center>

            {/* MESSAGE USER */}
            <Center className='profile-button'>
                <BsEnvelope size='2.2vh'/>
            </Center>

            {/* MORE OPTIONS */}
            <Menu autoSelect={false}>
              <MenuButton 
                m='0.75vh'
                as={IconButton} 
                aria-label='More Options' 
                icon={<BsThreeDots color='#ffa800' size='2.2vh'/>}
                variant='ghost'
                _hover={{ backgroundColor: '#ffaa0040' }}
                _active={{ backgroundColor: '#ffaa0020' }}
              />
              <MenuList
                backgroundColor='blackAlpha.800'
                border='none'
              > 
                <BlockModal/>
                <ReportModal/>
              </MenuList>
            </Menu>
          </Center>
        </Flex>

        <Flex>
          {/* LEFT TAB PANEL  */}
          <Box 
            minH='67vh'
            width='65%'
            backgroundColor='#242424'
          >
            <Tabs 
              size='lg'
              lazyBehavior='keepMounted'
              isFitted 
              isLazy
            >
              {/* TAB LIST  */}
              <TabList mb='1vh'>
                <ProfileTab label='EXPO'/>
                <ProfileTab label='SKETCHBOOKS'/>
                <ProfileTab label='ACTIVITY'/>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <ExpoPanel />
                </TabPanel>
                <TabPanel>
                  <SketchbookPanel />
                </TabPanel>
                <ActivityPanel />
              </TabPanels>
              
            </Tabs>
          </Box>

          {/* RIGHT DETAILS PANEL  */}
          <Box 
            minH='67vh'
            width='35%'
            p={2} 
            backgroundColor='#141414'
          >
            <Details />
          </Box>
        </Flex>
      </Box>
    );
};

export default Profile;
