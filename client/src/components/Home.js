import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postImageFetch, postAuthFetch } from '../fetch/fetch';
import NavBar from './NavBar';

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
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';

const inputStyle = {
  color: 'black',
  letterSpacing: 2,
  opacity: '60%',
}

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('https://bit.ly/dan-abramov');
  const [title, setTitle] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Update the formData object
    formData.append('file', file);
  
    const resp = await postImageFetch('http://localhost:8080/upload', formData);
    const url = resp.location;
    setUrl(url);
    // await sendMessage(url);
  };

  const onCreate = async (e) => {
    e.preventDefault();

    const resp = await postAuthFetch('http://localhost:8080/createBoard', { title: title });
    navigate(`/board/${resp.board.id}`)
  };

  return (
    <Box className='background' bgColor='#0E0F15'>
      <NavBar />
      <Flex className='drawer'>
        <Box>
          <Formik onSubmit={(e) => { console.log('onSubmit: ', e) }}>
            <Form>
              <Input style={inputStyle} type='file' accept='image/*' variant='flushed' focusBorderColor='#823C40' size='lg'
                onChange={onFileChange}
              />

              <Button
                colorScheme='blackAlpha'
                variant='outline'
                my={4}
                size={'lg'}
                letterSpacing={1.5}
                fontWeight={'medium'}
                color='#FFA800'
                backgroundColor='#00000033'
                _hover={{ backgroundColor: '#ffaa001c' }}
                onClick={upload}
              >
                Post
              </Button>

              <Image src={url} alt='pic' />
            </Form>
          </Formik>


          <Button colorScheme='blackAlpha' variant='outline' color='#FFA800' backgroundColor='#00000033' _hover={{ backgroundColor: '#ffaa001c' }} onClick={onOpen}>Create Mood Board</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Mood Board</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input style={inputStyle} variant='flushed' focusBorderColor='#823C40' size='lg' placeholder='Title'
                  onChange={(e) => setTitle(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blackAlpha' variant='outline' letterSpacing={1.5} mr={3} onClick={onClose}>Close</Button>
                <Button colorScheme='blackAlpha' variant='outline' letterSpacing={1.5} color='#FFA800' backgroundColor='#00000033' _hover={{ backgroundColor: '#ffaa001c' }} onClick={onCreate}>Create</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
