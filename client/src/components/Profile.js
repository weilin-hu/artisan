import { useState } from 'react';

import './Profile.css';

import BlockModal from './Profile/BlockModal';
import ReportModal from './Profile/ReportModal';
import Details from './Profile/Details';
import IconTooltip from './Profile/IconTooltip';
  
import {
  BsEnvelope,
  BsHeart,
  BsHeartHalf,
  BsHeartFill,
  BsThreeDots,
  BsLayoutWtf,
  BsViewList,
} from 'react-icons/bs';

import {
  VscSplitHorizontal
} from 'react-icons/vsc';

import {
  Box,
  Center,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Tabs,
  Tab,
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
        <Center
                className='profile-banner'
                onClick={(e) => hover(e)}
            >
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
                    lonalonalonalonalonalonalonalonalonalonalonalonalonalonalonalonalonalona
                </Text>
            </Center>
        
        {/* COVER PHOTO */}
        <Image 
            src='https://pbs.twimg.com/media/E760wo8VEAAqmyG.jpg' 
                alt='Dead Dreams'
                width='100%'
                height='33vh'
                zIndex={-1}
                objectFit='cover'
        />

        <Flex className='profile-bar' bg='blackAlpha.700' position='absolute'>
          {/* PROFILE STATS */}
          <Flex>
            <IconTooltip label='Views' stat='1,053'/>
            <IconTooltip label='Reputation' stat='50.3K'/>
            <IconTooltip label='Artifacts' stat='143'/>
            <IconTooltip label='Admirers' stat='53'/>
            <IconTooltip label='Admiring' stat='265'/>
          </Flex>

          <Center >
            {/* FOLLOW USER */}
            <Center 
              className='profile-button' 
              onMouseOver={(e) => onHover(e)} 
              onMouseLeave={(e) => onLeave(e)} 
              onClick={(e) => onClick(e)}
            >
              {hovering ? 
                <BsHeartHalf size='2.2vh'/> 
                : 
                following ? 
                  <BsHeartFill size='2.2vh'/> 
                  : 
                  <BsHeart size='2.2vh'/>
              }
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
          <Box 
            position='absolute'
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
              <TabList mb='1vh'>
                <Tab 
                  letterSpacing='0.5vh'
                  color='#ffaa0080'
                  borderColor='#7c5300'
                  _active={{ color: '#ffa800', background: '#ffaa0040' }}
                  _selected={{ color: '#ffa800', background: '#ffaa0020', borderColor: '#ffa800' }}
                >
                  <BsLayoutWtf size='2vh'/>
                  <Text ml='1vh'>
                    EXPO
                  </Text>
                </Tab>
                <Tab
                  letterSpacing='0.5vh'
                  color='#ffaa0080'
                  borderColor='#7c5300'
                  _active={{ color: '#ffa800', background: '#ffaa0040' }}
                  _selected={{ color: '#ffa800', background: '#ffaa0020', borderColor: '#ffa800' }}
                >
                  <VscSplitHorizontal size='2vh'/>
                  <Text ml='1vh'>
                    SKETCHBOOKS
                  </Text>
                </Tab>
                <Tab 
                  letterSpacing='0.5vh'
                  color='#ffaa0080'
                  borderColor='#7c5300'
                  _active={{ color: '#ffa800', background: '#ffaa0040' }}
                  _selected={{ color: '#ffa800', background: '#ffaa0020', borderColor: '#ffa800' }}
                >
                  <BsViewList size='2vh'/>
                  <Text ml='1vh'>
                    ACTIVITY
                  </Text>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p>one!</p>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Box 
            position='absolute'
            minH='67vh'
            width='35%' 
            right={0}
            top='33vh'
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
