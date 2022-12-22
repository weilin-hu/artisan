import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthFetch, deleteAuthFetch, postAuthFetch } from '../fetch/fetch';
import NavBar from './NavBar';

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
  Input,
  ModalHeader,
  ModalFooter,
  HStack,
  SimpleGrid,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import BoardCard from './BoardCard';
import { BsPlusSquare } from 'react-icons/bs';

const Boards = () => {
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [numDelete, setNumDelete] = useState(0);

    useEffect(() => {
        // declare the async data fetching function
        const fetchBoards = async () => {
            const data = await getAuthFetch(`http://localhost:8080/boards`);
            setBoards(data.boards);
        }

        // call the function
        fetchBoards()
        // make sure to catch any error
        .catch(console.error);;
    }, [numDelete])

    const onCreate = async (e) => {
        e.preventDefault();
        onClose();
        const resp = await postAuthFetch('http://localhost:8080/createBoard', { title: title });
        if (resp.success) {
            navigate(`/board/${resp.board.id}`);
        }
    };

    const deleteBoard = async (boardId) => {
        const data = await deleteAuthFetch(`http://localhost:8080/board/${boardId}`);
        if (data.success) {
            let num = numDelete;
            num++;
            setNumDelete(num);
        }
    };

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
                    <Box fontSize='36px' letterSpacing={2} color='gray.600'>My Mood Boards</Box>
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
                            New
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent rounded={'4px'} bgColor={'gray.700'}>
                            <ModalHeader>
                                <Box color={'gray.500'} fontSize={'lg'} fontWeight={'thin'} letterSpacing={'1px'}>
                                    Create Mood Board
                                </Box>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Input 
                                    color={'gray.500'}
                                    bgColor={'gray.800'}
                                    p={2}
                                    variant='flushed'
                                    borderColor={'gray.600'}
                                    size='lg'
                                    fontWeight={'thin'} 
                                    letterSpacing={'1px'}
                                    placeholder='Title'
                                    focusBorderColor={'gray.400'} 
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant='outline'
                                    letterSpacing={1.5}
                                    borderColor={'gray.800'}
                                    bgColor={'yellow.700'}
                                    _hover={{ bgColor: 'yellow.800' }}
                                    _active={{ color: 'gray.900', bgColor: 'yellow.900' }}
                                    onClick={onCreate}
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
                          {boards && boards.map((board) => 
                            <BoardCard key={board.id} board={board} deleteBoard={deleteBoard}></BoardCard>)}
                        </SimpleGrid>
                    </VStack>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default Boards;
