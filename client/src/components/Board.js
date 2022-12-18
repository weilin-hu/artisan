import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postImageFetch, postAuthFetch, getFetch } from '../fetch/fetch';

import { BsArrowBarLeft, BsClipboard, BsChevronDown, BsExclamation, BsEyeSlash, BsEye, BsX, BsCheck } from 'react-icons/bs';

import { 
  Box,
  Button,
  Input,
  Flex,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';

const types = ['color', 'style', 'object'];
const dateStyle = {
  color: 'black',
  letterSpacing: 2,
  opacity: '60%',
}

const inputStyle = {
  color: 'black',
  letterSpacing: 2,
  opacity: '80%',
}

const Board = () => {
  let { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // declare the async data fetching function
    const fetchCards = async () => {
      const data = await getFetch(`http://localhost:8080/board/${id}/cards`);
      console.log('data: ', data);

      setCards(data.cards);
    }

    // call the function
    fetchCards()
      // make sure to catch any error
      .catch(console.error);;
  }, [])


  // add card
  const onAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Update the formData object
    formData.append('file', file);  
    const resp = await postImageFetch('http://localhost:8080/upload', formData);
    const url = resp.location;
    
    const data = {
      type: type,
      url: url,
      desc: desc,
    }
    const resp2 = await postAuthFetch(`http://localhost:8080/board/${id}/add`, data);
    setCards(cards => [...cards, resp2.card]);
    onClose();
    setDesc('');
  };

  return (
    <Box className='background'>
      <Flex className='drawer'>
        <Box>
          {/* create card mapping */}
          {cards.map(card =>(
            <Box key={card.num}>{card.num}</Box>
          ))}

          <Button colorScheme='blackAlpha' variant='outline' color='#FFA800' backgroundColor='#00000033' _hover={{ backgroundColor: '#ffaa001c' }} onClick={onOpen}>Add Card</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Card</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik>
                  <Form>
                    <Select style={dateStyle} flex={5} icon={<BsChevronDown/>} variant='flushed' focusBorderColor='#823C40' size='lg' mt={4} placeholder='Type' onChange={(e) => setType(e.target.value)}>
                      {types.map((type, idx) => <option key={idx}>{type}</option>)}
                    </Select>
                    <Input style={inputStyle} type='file' accept='image/*' variant='flushed' focusBorderColor='#823C40' size='lg'
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Textarea
                      value={desc}
                      style={inputStyle}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder='Description'
                      size='sm'
                    />
                    <Button colorScheme='blackAlpha' variant='outline' letterSpacing={1.5} mr={3} onClick={onClose}>Close</Button>
                    <Button colorScheme='blackAlpha' variant='outline' letterSpacing={1.5} color='#FFA800' backgroundColor='#00000033' _hover={{ backgroundColor: '#ffaa001c' }} onClick={onAdd}>Add</Button>
                
                  </Form>
                </Formik>
                
              </ModalBody>
              
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </Box>
  );
};

export default Board;
