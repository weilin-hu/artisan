import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react'
import Artifact from './Artifact';
import './Profile.css';
  
import { 
  BsEnvelope,
  BsHeart,
  BsHeartHalf,
  BsHeartFill,
  BsThreeDots,
  BsEye,
  BsExclamationOctagon,
} from 'react-icons/bs';

import {
  VscFlame,
  VscBriefcase,
  VscCircleSlash,
} from 'react-icons/vsc';

import { 
  Box,
  SimpleGrid,
} from '@chakra-ui/react';

const artifacts = [
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/51y6z0gadhe41.jpg',
    title:'Cage',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60df64dc6a25fc267873bbdc',
  }, 
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/01467kbw4hq31.jpg',
    title:'Jewel',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  }, 
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/lz3pmn5t7ut21.jpg',
    title: 'Painting Prison',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/ptpfmjqo0g321.jpg',
    title: 'Black from Ghostblade',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/hvkaft9z3db71.jpg',
    title: 'Monarch',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/armojo64gc031.jpg',
    title: 'Aeolian with Lion Pup',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/35sn3ysgjon51.png',
    title: 'Mechanic Piano',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://i.redd.it/7qrbiunv7p461.jpg',
    title: 'Shine Aeolian',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  },
  {
    _id:'60cbbc94f13fbbd632f28059',
    url: 'https://pbs.twimg.com/media/E760wo8VEAAqmyG.jpg',
    title: 'Black Swan',
    admirers:[],
    note:'',
    date: '946706400000',
    tags:[],
    artisan: '60dfa1c62709e610a06f87a2',
  }
];


const FeaturedGallery = () => {

    return (
        <Box backgroundColor='blackAlpha.600' padding={2}>
          <SimpleGrid
            width='600px'
            rows={3} 
            columns={3}
            spacing={2}
          >
            {artifacts.map((artifact, idx) => 
              <Artifact key={idx} artifact={artifact}/>
            )}
          </SimpleGrid>
        </Box>
    );
};

export default FeaturedGallery;
