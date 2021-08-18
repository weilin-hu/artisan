import { useDisclosure } from '@chakra-ui/react'

import {
  BsExclamationOctagon,
} from 'react-icons/bs';

import {
  VscCircleSlash,
} from 'react-icons/vsc';

import {
    Button,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalBody,
    ModalFooter,
  } from '@chakra-ui/react';

const BlockModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSizeClick = (e) => {
      e.preventDefault();
      console.log('click');
      onOpen();
  }

  return (
  <MenuItem 
    icon={<VscCircleSlash size='2.2vh'/>} 
    fontSize='1.5vh'
    letterSpacing='0.2vh'
    mb='.2vh'
    _hover={{backgroundColor: '#ffaa0040'}}
    onClick={(e) => handleSizeClick(e)}
  >
    Block
    <Modal 
      size='sm' 
      autoFocus={false}
      onClose={onClose} 
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent backgroundColor='blackAlpha.700'>
        <ModalBody color='whiteAlpha.800' letterSpacing='1.5px'>
          Are you sure you want to block this user?

          This user will no longer be able to see your posts.
        </ModalBody>
        <ModalFooter>
          <Button 
            m={2}
            size='sm'
            variant='outline' 
            colorScheme='blackAlpha'
            color='#ffa800'
            letterSpacing='1.5px'
            onClick={onClose}
            _hover={{backgroundColor: '#ffaa0040'}}
          >
            Block
          </Button>
          <Button 
            m={2}
            size='sm'
            variant='outline' 
            colorScheme='blackAlpha'
            color='#ffa800'
            letterSpacing='1.5px'
            onClick={onClose}
            _hover={{backgroundColor: '#ffaa0040'}}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </MenuItem>
  );
};

export default BlockModal;
