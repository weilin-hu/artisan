import { useState } from 'react';

import FeaturedGallery from './FeaturedGallery';

import {
    Accordion,
    AccordionIcon,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
} from '@chakra-ui/react';


const Details = () => {

    return (  
        <Accordion 
          border='none'
          minW='100%' 
          h='100s%'
          defaultIndex={[0, 1, 2]} 
          allowMultiple
        >
          <AccordionItem color='#FFA800'>
            <AccordionButton
              _hover={{backgroundColor: '#ffaa0030'}}
              _expanded={{backgroundColor: '#ffaa0020'}}
            >
              <AccordionIcon/>
              <Box 
                flex='1'
                letterSpacing='0.5vh'
                fontSize='1.5vh'
              >
                BIO
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel
              letterSpacing='0.2vh'
              fontSize='1.5vh'
            >
              This is my bio. 🤣 
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem color='#FFA800'>
            <AccordionButton
              _hover={{backgroundColor: '#ffaa0030'}}
              _expanded={{backgroundColor: '#ffaa0020'}}
            >
              <AccordionIcon/>
              <Box 
                flex='1'
                letterSpacing='0.5vh'
                fontSize='1.5vh'
              >
                FEATURED GALLERY
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
              <FeaturedGallery />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem color='#FFA800'>
            <AccordionButton
              _hover={{backgroundColor: '#ffaa0030'}}
              _expanded={{backgroundColor: '#ffaa0020'}}
            >
              <AccordionIcon/>
                <Box 
                  flex='1'
                  letterSpacing='0.5vh'
                  fontSize='1.5vh'
                >
                  POPULAR ARTIFACTS
                </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
              <FeaturedGallery />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
    );
};

export default Details;
