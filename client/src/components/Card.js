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
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { BsFiles, BsX, BsLayoutWtf } from 'react-icons/bs';
import { VscTrash } from 'react-icons/vsc';

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

const Card = ({ card, deleteCard }) => {
    let navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [style, setStyle] = useState({display: 'none'});
    const [palette, setPalette] = useState([]);

    useEffect(() => {
        const fetchPalette = async () => {
            if (card.type === 'color') {
                const data = await getAuthFetch(`http://localhost:8080/board/${card.board_id}/card/${card.num}/palette`);

                const rgbPalette = data.palette;
                if (data.success) {
                    let palette = [];
                    for (let i = 0; i < rgbPalette.length; i++) {
                        const hex = '#' + componentToHex(rgbPalette[i].r) + componentToHex(rgbPalette[i].g) + componentToHex(rgbPalette[i].b);
                        palette.push(hex);
                    }
                    setPalette(palette);
                }
            }
        }
    
        fetchPalette()
          .catch(console.error);;
    }, [])

    const handleMouseOver = () => {
        setStyle({display: 'block'});
    };

    const handleMouseOut = () => {
        setStyle({display: 'none'});
    };

    const goToDetails = () => {

    };

    const onDelete = async () => {
        onClose();
        await deleteCard(card.board_id, card.num);
    };

    return (
        <Flex direction={'column'}>
            <Box
                w={'200px'}
                h={'200px'}
                bg={'gray.700'}
                rounded={2}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseOut}
                onMouseMove={handleMouseOver}
            >
                <Flex 
                    style={style} 
                    w={'200px'}
                    h={'200px'}
                    p={'10px'}
                    bg={'#000000b0'}
                    position={'absolute'}
                    justifyContent={'space-between'} 
                    alignContent={'center'}
                    direction={'column'} 
                    zIndex={6}
                >
                    <Box 
                        color={'gray.500'}
                        letterSpacing={'1px'}
                        textAlign={'center'}
                    >
                        {card.type}
                    </Box>
                    <Tooltip label={card.desc_text}>
                        <Text
                            color={'yellow.700'}
                            noOfLines={4}
                            letterSpacing={'1px'}
                            fontSize={'xs'}
                            textAlign={'center'}
                        >
                            {card.desc_text}
                        </Text>
                    </Tooltip>
                    <Flex 
                        ml={'-10px'}
                        mb={'5px'}
                        w={'200px'} 
                        maxW={'200px'}
                        position={'absolute'}
                        bottom={0}
                        alignSelf={'end'}
                        justifyContent={'space-evenly'}
                    >
                        {palette.map((hex) => 
                        <Box key={`${card.num}.${hex}`} bg={hex} w={'20px'} h={'20px'}></Box>)}
                    </Flex>
                </Flex>
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
                {card &&
                <Image
                    zIndex={0}
                    src={card.url}
                    alt={card.num}
                    w={'200px'}
                    h={'200px'}
                    position={'absolute'}
                    objectFit={'contain'}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseOut}
                    onMouseMove={handleMouseOver}
                />}               
                <Modal isOpen={isOpen} onClose={onClose} >
                    <ModalOverlay />
                    <ModalContent
                        rounded={'4px'}
                        bgColor={'gray.700'}
                    >
                        <ModalCloseButton />
                        <ModalHeader>
                            <Box color={'gray.500'} fontSize={'lg'} fontWeight={'thin'} letterSpacing={'1px'}>
                                Are you sure you want to delete this card?
                            </Box>
                        </ModalHeader>
                        <ModalFooter>
                            <Box color={'gray.800'}>
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
            </Box>
        </Flex>
        
    );
};

export default Card;
