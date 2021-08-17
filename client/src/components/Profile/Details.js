import { useState } from 'react';

import FeaturedGallery from '../FeaturedGallery';

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
      <Accordion allowMultiple width='100%'>
        <AccordionItem color='#FFA800'>
          <AccordionButton>
            <AccordionIcon/>
              <Box 
                  flex='1'
                  letterSpacing={2}
                  fontSize={20}
                  fontFamily='Georgia'
              >
                  Bio
              </Box>
            <AccordionIcon/>
          </AccordionButton>
          <AccordionPanel 
              py={4} 
              letterSpacing={2}
              fontFamily='Georgia'
          >
              This is my bio. 🤣
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem color='#FFA800'>
          <AccordionButton>
            <AccordionIcon/>
              <Box 
                flex='1'
                letterSpacing={2}
                fontSize={20}
                fontFamily='Georgia'
              >
                Featured Gallery
              </Box>
            <AccordionIcon/>
          </AccordionButton>
          <AccordionPanel py={4}>
            <FeaturedGallery />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
};

export default Details;
