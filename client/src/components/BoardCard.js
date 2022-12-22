import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthFetch } from '../fetch/fetch';

import { 
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { BsFiles, BsX, BsLayoutWtf } from 'react-icons/bs';
import { VscTrash } from 'react-icons/vsc';


const BoardCard = ({ board, deleteBoard }) => {
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = useState(0);
    const [firstCard, setFirstCard] = useState('');
    const [style, setStyle] = useState({display: 'none'});

    useEffect(() => {
        // declare the async data fetching function
        const fetchCards = async () => {
          const data = await getAuthFetch(`http://localhost:8080/board/${board.id}/cards`);
          if (data.cards.length > 0) {
            setFirstCard(data.cards[0].url)
          }
          setSize(data.cards.length);
        }
    
        // call the function
        fetchCards()
          // make sure to catch any error
          .catch(console.error);;
    }, [])

    const handleMouseOver = () => {
        setStyle({display: 'block'});
    };

    const handleMouseOut = () => {
        setStyle({display: 'none'});
    };

    const goToBoard = () => {
        navigate(`/board/${board.id}`);
    };

    const onDelete = async () => {
        onClose();
        await deleteBoard(board.id);
    };

    return (
        <Flex direction={'column'}>
            <Box
                w={'200px'}
                h={'200px'}
                bg={'gray.700'} // eventually replace with image
                rounded={2}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseOut}
                onMouseMove={handleMouseOver}
            >
                {(size > 0 && firstCard) ?
                <Image
                    src={firstCard}
                    alt={board.title}
                    w={'200px'}
                    h={'200px'}
                    position={'absolute'}
                    objectFit={'cover'}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseOut}
                    onMouseMove={handleMouseOver}
                /> : 
                <Box position={'absolute'} color={'gray.600'} mx={'75px'} my={'30px'}>
                    <BsLayoutWtf size={'50px'}/>
                </Box>
                }
                <Box
                    style={style}
                    as={'button'}
                    color={'black'}
                    position={'absolute'}
                    w={'36px'}
                    ml={'164px'}
                    zIndex={6}
                    _hover={{ color: 'red.800' }}
                    _active={{ color: 'red.900' }}
                    onClick={onOpen}
                >
                    <BsX size={36}/>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose} >
                    <ModalOverlay />
                    <ModalContent
                        rounded={'4px'}
                        bgColor={'gray.700'}
                    >
                        <ModalCloseButton />
                        <ModalHeader>
                            <Box color={'gray.500'} fontSize={'lg'} fontWeight={'thin'} letterSpacing={'1px'}>
                                Are you sure you want to delete {board.title}?
                            </Box>
                        </ModalHeader>
                        <ModalFooter>
                            <Box
                                color={'gray.800'}
                            >
                                <Button 
                                    leftIcon={<VscTrash />}
                                    variant='outline'
                                    borderColor={'gray.800'}
                                    bgColor={'red.800'}
                                    _hover={{ bgColor: 'red.900' }}
                                    _active={{ color: 'gray.900', bgColor: 'red.900' }}
                                    onClick={onDelete}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Box style={style} position={'absolute'} bg={'#00000080'} w={'200px'} p={'10px'} minH={'200px'} zIndex={5}>
                </Box>
                <Button
                    style={style}
                    color={'yellow.500'}
                    borderColor={'yellow.500'}
                    bgColor={'yellow.900'}
                    w={'100px'}
                    mx={'50px'}
                    mt={'40px'}
                    variant={'outline'}
                    position={'absolute'}
                    alignSelf={'center'}
                    zIndex={6}
                    _hover={{ bgColor: 'gray.800' }}
                    _active={{ bgColor: 'gray.900' }}
                    onClick={goToBoard}
                >
                    View
                </Button>
            </Box>
            
            <Flex
                position={'absolute'}
                bg={'#00000080'}
                w={'200px'}
                p={'10px'}
                minH={'80px'}
                mt={'120px'}
                justifyContent={'space-between'}
                zIndex={2}
            >
                <Box color={'gray.400'} overflow={'hidden'}>
                    {board.title}
                </Box>
                <Flex color={'gray.500'} spacing={2}>
                    <Box mr={'6px'}>
                        {size}
                    </Box>
                    <BsFiles size={18}/>
                </Flex>
            </Flex>
        </Flex>
        
    );
};

export default BoardCard;
