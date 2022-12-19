import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthFetch } from '../fetch/fetch';
import NavBar from './NavBar';

import { 
  Box,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import BoardCard from './BoardCard';


const Boards = () => {
    let navigate = useNavigate();
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        // declare the async data fetching function
        const fetchBoards = async () => {
            const data = await getAuthFetch(`http://localhost:8080/boards`);
            console.log('data: ', data);

            setBoards(data.boards);
        }

        // call the function
        fetchBoards()
        // make sure to catch any error
        .catch(console.error);;
    }, [])

    return (
        <VStack bgColor='#0E0F15' minW={'100%'} alignItems={'start'}>
            <NavBar />
            <Flex 
                direction={'column'}
                alignItems={'flex-start'}
                minW={'100%'}
                p={4}
            >
                <Box fontSize='36px' letterSpacing={2} color='gray.600'>My Mood Boards</Box>
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
                            <BoardCard id={board.id} board={board}></BoardCard>)}
                        </SimpleGrid>
                    </VStack>
                    <Box w={'20%'}>Hi</Box>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default Boards;
