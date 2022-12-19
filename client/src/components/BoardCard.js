import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFetch } from '../fetch/fetch';
import NavBar from './NavBar';

import { 
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  SimpleGrid,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { BsFiles, BsX } from 'react-icons/bs';
import { VscTrash } from 'react-icons/vsc';


const BoardCard = ({ board }) => {
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = useState(0);
    const [style, setStyle] = useState({display: 'none'});

    useEffect(() => {
        // declare the async data fetching function
        const fetchCards = async () => {
          const data = await getFetch(`http://localhost:8080/board/${board.id}/cards`);    
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

    const deleteBoard = () => {
        onClose();
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
                <Box
                    style={style}
                    as={'button'}
                    color={'yellow.700'}
                    position={'absolute'}
                    w={'24px'}
                    ml={'176px'}
                    zIndex={5}
                    _hover={{ color: 'red.800' }}
                    _active={{ color: 'red.900' }}
                    onClick={onOpen}
                >
                    <BsX size={24}/>
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
                                    onClick={deleteBoard}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Box style={style} position={'absolute'} bg={'#00000080'} w={'200px'} p={'10px'} minH={'200px'}>
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
            >
                <Box color={'gray.400'} overflow={'hidden'}>
                    {board.title}
                </Box>
                <Flex spacing={2}>
                    <Box color={'gray.700'} mr={'6px'}>
                        {size}
                    </Box>
                    <BsFiles color={'#2D3748'} size={18}/>
                </Flex>
            </Flex>
        </Flex>
        
    );
};

export default BoardCard;
