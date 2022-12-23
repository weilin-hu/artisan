import { useEffect, useState, Form, Formik } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthFetch, deleteAuthFetch, postAuthFetch, postImageFetch } from '../fetch/fetch';
import NavBar from './NavBar';
import Card from './Card';

import { 
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Image,
  Input,
  ModalHeader,
  ModalFooter,
  HStack,
  Select,
  SimpleGrid,
  Textarea,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { BsPlusSquare, BsChevronDown, BsUpload } from 'react-icons/bs';

const types = ['color', 'style', 'object'];
  
const inputStyle = {
    color: 'black',
    letterSpacing: 2,
    opacity: '80%',
}

const Board = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [cards, setCards] = useState([]);
    const [board, setBoard] = useState(null);
    const [numCards, setNumCards] = useState(0);

    const [file, setFile] = useState(null);
    const [type, setType] = useState('color');
    const [desc, setDesc] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [inspo, setInspo] = useState(null);

    useEffect(() => {
        const fetchCardsAndBoard = async () => {
            const data1 = await getAuthFetch(`http://localhost:8080/board/${id}/cards`);
            setCards(data1.cards);

            const data2 = await getAuthFetch(`http://localhost:8080/board/${id}`);
            setBoard(data2.board);
        }

        fetchCardsAndBoard()
        .catch(console.error);
    }, [id, numCards])

    // add card
    const onAdd = async (e) => {
        e.preventDefault();

        if (!file) {
            setErrMsg('You must include an image.');
            return;
        }

        if ((type === 'style' || type === 'object') && desc.length === 0) {
            setErrMsg('You must include a description for this type of card.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);  
        // upload image
        const resp = await postImageFetch('http://localhost:8080/upload', formData);
        const url = resp.location;
        
        // add card
        const resp2 = await postAuthFetch(`http://localhost:8080/board/${id}/add`, { type, url, desc });
        console.log(resp2.palette);
        if (resp2.success) {
            let num = numCards;
            num++;
            setNumCards(num);
            setCards(cards => [...cards, resp2.card]);
        }
        handleClose();
    };

    // generate inspo
    const onGenerate = async (e) => {
        e.preventDefault();
        console.log("generate!");
        const resp = await postAuthFetch(`http://localhost:8080/board/${id}/generate`);
        console.log(resp);
        if (resp.success) {
            console.log(resp);
            console.log(resp.url);
            console.log(prompt);
            
            setInspo(resp.url);
        }
    }

    const deleteCard = async (boardId, cardNum) => {
        const data = await deleteAuthFetch(`http://localhost:8080/board/${boardId}/card/${cardNum}`);
        if (data.success) {
            let num = numCards;
            num--;
            setNumCards(num);
        }
    };

    const handleClose = () => {
        onClose();
        setDesc('');
        setFile(null);
        setErrMsg('');
    }

    return (
        <VStack bgColor='#0E0F15' minW={'100%'} minH={'100vh'} alignItems={'start'}>
            <NavBar />
            <Flex 
                direction={'column'}
                alignItems={'flex-start'}
                minW={'100%'}
                p={4}
            >
                <Flex
                    minW={'100%'}
                    justify={'space-between'}
                >
                    <Box fontSize='36px' letterSpacing={2} color='gray.600'>{board ? board.title : ''}</Box>
                    <Box color={'yellow.500'} fontWeight={'light'}>
                        <Button
                            bg={'gray.700'}
                            px={'8px'}
                            rounded={'2px'}
                            leftIcon={<BsPlusSquare size={24}/>}
                            _hover={{ bg: 'yellow.800' }}
                            _active={{ bg: 'yellow.900' }}
                            onClick={onOpen}
                        > 
                            Add Card
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent rounded={'4px'} bgColor={'gray.700'}>
                            <ModalHeader>
                                <Box color={'gray.500'} fontSize={'lg'} fontWeight={'thin'} letterSpacing={'1px'}>
                                    Add Card
                                </Box>
                            </ModalHeader>
                            <ModalCloseButton onClick={handleClose}/>
                            <Divider borderColor={'gray.800'}/>
                            <ModalBody>
                                <VStack>
                                    <Flex 
                                        justify={'space-between'}
                                        minW={'100%'}
                                        alignItems={'center'}
                                        color={'gray.500'}
                                    >
                                        <Box fontSize={'lg'}> Type: </Box>
                                        <Select 
                                            icon={<BsChevronDown/>}
                                            variant='flushed'
                                            letterSpacing={'1px'}
                                            color={'gray.500'}
                                            borderColor={'gray.700'}
                                            focusBorderColor='gray.400'
                                            size='md'
                                            px={'20px'}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            {types.map((type, idx) => 
                                                <option style={{ background: '#171923', color: '#B7791F' }} key={idx}>
                                                    {type}
                                                </option>
                                            )}
                                        </Select>
                                        <Input
                                            id={'file-input'}
                                            display={'none'}
                                            type='file'
                                            accept='image/*'
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <label htmlFor='file-input'>
                                            <Box
                                                cursor={'pointer'}
                                                color={'gray.500'}
                                                background={file ? 'yellow.900' : ''}
                                                border={'1px'}
                                                borderColor={'gray.500'}
                                                rounded={'4px'}
                                                p={'5px'}
                                                _hover={{ background: 'gray.800' }}
                                                _active={{ background: 'gray.900' }}
                                            >
                                                <BsUpload size={'20px'}/>
                                            </Box>
                                        </label>
                                    </Flex>
                                    <Textarea
                                        value={desc}
                                        color={'gray.500'}
                                        letterSpacing={'1px'}
                                        borderColor={'gray.600'}
                                        focusBorderColor={'gray.400'}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder='Description'
                                        size='sm'
                                    />
                                    <Box color={'red.700'} letterSpacing={'1px'}>
                                        {errMsg}
                                    </Box>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant='outline'
                                    letterSpacing={1.5}
                                    borderColor={'gray.800'}
                                    bgColor={'yellow.700'}
                                    _hover={{ bgColor: 'yellow.800' }}
                                    _active={{ color: 'gray.900', bgColor: 'yellow.900' }}
                                    onClick={onAdd}
                                >
                                    Create
                                </Button>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Box>
                    
                </Flex>
                <Divider my={4} borderColor={'teal.800'} />
                <Flex 
                    direction={'row'}
                    justify='space-between'
                    minW={'100%'}
                >
                    <VStack 
                        bgColor='gray.800'
                        p={6}
                        alignItems='start'
                        rounded={10}
                    >
                        <SimpleGrid 
                            columns={4}
                            spacing={6}
                            justify='space-between'
                        >
                          {cards && cards.map((card) => 
                            <Card key={card.num} card={card} board={board} deleteCard={deleteCard}></Card>)
                          }
                            <Box
                                w={'200px'}
                                h={'200px'}
                                bg={'gray.900'}
                                cursor={'pointer'}
                                color={'gray.700'}
                                _hover={{ color: 'gray.600', bg: '#11121a' }}
                                _active={{ color: 'gray.700', bg: '#0c0c12' }}
                                onClick={onOpen}
                            >
                                <Box ml={'75px'} mt={'75px'}>
                                    <BsPlusSquare size={'50px'}/>
                                </Box>
                            </Box>
                        </SimpleGrid>
                    </VStack>
                    <Flex 
                        rounded={'2px'}
                        w={'25%'}
                        direction={'column'}
                        alignContent={'center'}
                        alignItems={'center'}
                    >
                        <Button
                            variant='outline'
                            letterSpacing={1.5}
                            borderColor={'gray.800'}
                            bgColor={'yellow.700'}
                            _hover={{ bgColor: 'yellow.800' }}
                            _active={{ color: 'gray.900', bgColor: 'yellow.900' }}
                            onClick={onGenerate}
                        >
                            Generate Inspo
                        </Button>
                        <Box>
                            {inspo && 
                            <Image alt='ha' src={inspo}/>
                            }
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default Board;
