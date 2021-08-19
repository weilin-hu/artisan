import '../Profile.css';

import SketchbookPreview from './SketchbookPreview';

import {
  Box,
  SimpleGrid,
} from '@chakra-ui/react';

const sketchbooks = [
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'My Sketchbook that has a really long title yea',
    cover: 'https://pbs.twimg.com/media/E4nm9WjVgAAglhR.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 1053,
    views: 7434,
    pages: ['60cbbaeef13fbbd632f28057'],
  },
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'Sketchbook',
    cover: 'https://pbs.twimg.com/media/E760wo8VEAAqmyG.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 34,
    views: 532,
    pages: ['60cbbaeef13fbbd632f28057'],
  },,
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'WLOP',
    cover: 'https://pbs.twimg.com/media/E3B-JtFVgAEGfZL.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 5,
    views: 23,
    pages: ['60cbbaeef13fbbd632f28057'],
  },,
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'Aeolian Sketches',
    cover: 'https://pbs.twimg.com/media/Evceo7IVcAIKhdh.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 237453,
    views: 347854,
    pages: ['60cbbaeef13fbbd632f28057'],
  },,
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'Landscaping',
    cover: 'https://pbs.twimg.com/media/EzOzJfkVUAQ1jKz.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 6436,
    views: 6437343,
    pages: ['60cbbaeef13fbbd632f28057'],
  },
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'Lighting Sketchbook',
    cover: 'https://pbs.twimg.com/media/D4483wQWAAIeCT1.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 734,
    views: 734734,
    pages: ['60cbbaeef13fbbd632f28057'],
  },
  {
    _id: '60cbba66f13fbbd632f28056',
    owner: '60df64dc6a25fc267873bbdc',
    title: 'Random Sketchbook',
    cover: 'https://pbs.twimg.com/media/D8RDZ7wUEAEqBo6.jpg',
    date_created: 946706400000,
    last_updated: 946706400000,
    who_can_view: 'private',
    admirers: 743,
    views: 74373,
    pages: ['60cbbaeef13fbbd632f28057'],
  },
];

const SketchbookPanel = ({ }) => {
    return (
      <Box backgroundColor='blackAlpha.600' p='2vh' m='1vh'>
        <SimpleGrid
          columns={3}
          spacing='2vh'
        >
          {sketchbooks.map((sketchbook, idx) => 
          <SketchbookPreview key={idx} sketchbook={sketchbook} />
          )}
        </SimpleGrid>
      </Box>
    );
};

export default SketchbookPanel;
