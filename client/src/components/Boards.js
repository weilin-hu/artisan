import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthFetch } from '../fetch/fetch';
import NavBar from './NavBar';

import { 
  Box,
} from '@chakra-ui/react';


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
        <Box className='background' bgColor='#0E0F15'>
            <NavBar />
            {boards && boards.map((board) => <Box id={board.id}>{board.id}</Box>)}
        </Box>
    );
};

export default Boards;
