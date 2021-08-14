import { useState } from 'react';

import { 
  RiEmpathizeLine, 
  RiHandHeartLine, 
  RiHandHeartFill,
  RiUserHeartLine,
  RiUserHeartFill,
} from 'react-icons/ri';

import { 
  BsEnvelope,
  BsHeart,
  BsHeartHalf,
  BsHeartFill,
  BsThreeDots,
  BsEye,
} from 'react-icons/bs';

import {
  VscFlame,
  VscBriefcase,
} from 'react-icons/vsc';

import { 
  Box,
  Button,
  GridItem,
  Image,
  Wrap,
  WrapItem,
  Grid,
} from '@chakra-ui/react';

const srcs = [
  'https://www.iamag.co/wp-content/uploads/2020/02/coverwlopsept.jpg',
  'https://cdnb.artstation.com/p/assets/images/images/036/508/665/20210408003552/smaller_square/wlop-19se.jpg?1617860152',
  'https://cdna.artstation.com/p/assets/images/images/024/367/548/20200220001241/smaller_square/wl-op-21se.jpg?1582179161',
  'https://pbs.twimg.com/media/E7opelGVgAMZ9ws.jpg',
  'https://pbs.twimg.com/media/E4nm9WjVgAAglhR.jpg',
  'https://i.pinimg.com/originals/a3/0d/29/a30d29edd35275e2a00dd35a7decdfba.jpg',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6f131d22-7974-4793-9db3-2160376b5c72/ddjvs91-14943a2c-f288-468e-a63d-b78679ff50bf.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZmMTMxZDIyLTc5NzQtNDc5My05ZGIzLTIxNjAzNzZiNWM3MlwvZGRqdnM5MS0xNDk0M2EyYy1mMjg4LTQ2OGUtYTYzZC1iNzg2NzlmZjUwYmYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.toR9pFwhFkSpSiuNSDCOwfSNDOmsAhZHlWLycQH6fbE',
  'https://i.redd.it/armojo64gc031.jpg',
  'https://i.pinimg.com/originals/38/9b/c8/389bc8e13719ec9e5bf5ae7e90d1e21e.jpg',
  'https://i.ytimg.com/vi/RTOu5b-gjTg/maxresdefault.jpg',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6f131d22-7974-4793-9db3-2160376b5c72/ddtwqf5-4c734a7e-97b5-4895-8d94-113e821b805f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZmMTMxZDIyLTc5NzQtNDc5My05ZGIzLTIxNjAzNzZiNWM3MlwvZGR0d3FmNS00YzczNGE3ZS05N2I1LTQ4OTUtOGQ5NC0xMTNlODIxYjgwNWYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.DCrzT81UuQxBbEOR_ukFTqHm0-8CZN_Co7WxukEujmo',
  'https://i.pinimg.com/originals/bd/88/4e/bd884e781382a7216585d5bc4ac643a3.png',
  'http://pm1.narvii.com/6015/1b0dbd31f38667b5b365c865f4de8bbcb75af445_00.jpg',
  'https://w0.peakpx.com/wallpaper/448/708/HD-wallpaper-butterfly-dance-wlop-art-fantasy-luminos-girl-butterfly-dancer.jpg',
  'https://img-9gag-fun.9cache.com/photo/ayem9Db_460s.jpg',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6f131d22-7974-4793-9db3-2160376b5c72/da92lk2-ff6a6d9e-0c05-4c74-8516-33aeb9589ef8.jpg/v1/fill/w_600,h_856,q_75,strp/ruler_by_wlop_da92lk2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU2IiwicGF0aCI6IlwvZlwvNmYxMzFkMjItNzk3NC00NzkzLTlkYjMtMjE2MDM3NmI1YzcyXC9kYTkybGsyLWZmNmE2ZDllLTBjMDUtNGM3NC04NTE2LTMzYWViOTU4OWVmOC5qcGciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Ir_Qy1OobQmibCLHd10vVSrvQGXk8_7kll0mtiJfKF4',
  'https://images.squarespace-cdn.com/content/v1/54fc8146e4b02a22841f4df7/1526988065676-F48AOE9X8HF74WIMG3PH/Wlop21.jpg',
  'https://pbs.twimg.com/media/E5QxM1xVIAMlcSd?format=jpg&name=4096x4096',
  'https://cdnb.artstation.com/p/assets/images/images/015/882/009/smaller_square/wl-op-21s.jpg?1550027192',
  'https://i.pinimg.com/originals/2e/11/b8/2e11b88cd626828888bb73f6ddaaf855.jpg',
  'https://wallpaperforu.com/wp-content/uploads/2020/11/vector-wallpaper-20112621505724-scaled.jpg',
  'https://c4.wallpaperflare.com/wallpaper/920/203/696/triumph-armor-art-wlop-wallpaper-preview.jpg',
  'https://ipfs.io/ipfs/QmdpscVYhV9evTThijq1fzyaaEBEipwxV3tRtMKYwZ4CET/nft.png',
  'https://i.ytimg.com/vi/1yp-RaYu2cs/maxresdefault.jpg',
  'https://i.redd.it/zesx9vn531f61.jpg',
  'https://pbs.twimg.com/media/E22WFOAVkAQfSVg.jpg',
  'https://cdna.artstation.com/p/assets/images/images/025/184/538/20200322235300/smaller_square/wl-op-36se.jpg?1584939181',
  'https://cdn.donmai.us/sample/fe/88/sample-fe8848f49b931088d79528f15eba677c.jpg',
  'https://f8n-ipfs-production.imgix.net/QmZfMLuS3S62NfTpvx1ywefUH2kwgRNpo7LDjWgDcWp2wA/nft.png?h=640&q=80',
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/6f131d22-7974-4793-9db3-2160376b5c72/dc8ykdg-8dcfe782-f577-4bfc-a20c-35858b3310a1.jpg',
  'https://data.whicdn.com/images/343238787/original.jpg',
  'https://p.favim.com/orig/2018/11/16/digital-art-wlop-deviantart-Favim.com-6550349.jpg',
  'https://img-9gag-fun.9cache.com/photo/a43mvqv_460s.jpg',
  'https://f8n-ipfs-production.imgix.net/QmSoeFqBTEYwNyJxcU4hoFfuesmZPkjsFZLL5vg8RrmiK1/nft.png?q=80&h=640',
  'https://wallpapercrafter.com/desktop/130021-anime-2D-artwork-digital-art-WLOP-city.jpg',
];

function Test() {
  const [following, setFollowing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const onHover = (e) => {
    e.preventDefault();
    setHovering(true);
  };

  const onLeave = (e) => {
    e.preventDefault();
    setHovering(false);
  };

  const onClick = (e) => {
    e.preventDefault();
    setFollowing(!following);
  }

  const getWidth = (e, idx) => {
    e.preventDefault();
    console.log(idx);
    var myImg = document.querySelector(`#pic${idx}`);
    console.log(myImg);
    var realWidth = myImg.naturalWidth;
    console.log(realWidth);
    var realHeight = myImg.naturalHeight;
    console.log(realHeight);
    // alert("Original width=" + realWidth + ", " + "Original height=" + realHeight);
  };
  

  return (
    <Box className='App' >
        <Box color='#FFA800' display='flex' m={4}>
          <BsEye size={24}/>
          <VscFlame size={24}/>
          <VscBriefcase size={24}/>
          <RiUserHeartLine size={20}/>
          <RiUserHeartLine size={20}/>
          <RiEmpathizeLine size={24}/>
          <RiHandHeartFill size={24}/>
          <RiHandHeartLine size={24}/>
          <BsEnvelope size={24}/>
          <Box as='button' color='#FFA800' onMouseOver={(e) => onHover(e)} onMouseLeave={(e) => onLeave(e)} onClick={(e) => onClick(e)}>
            {hovering ? <BsHeartHalf size={24}/> : following ? <BsHeartFill size={24}/> : <BsHeart size={24}/>}
          </Box>
          <BsThreeDots size={24}/>
        </Box>
        <Box display='flex' flexWrap='wrap' justify='center' justifyContent='space-between'>
        {srcs.map((src, idx) => 
        <Box key={idx} margin={1} onClick={(e) => getWidth(e, idx)}>
          <Image id={`pic${idx}`} 
            zIndex={-1}
            height='200px'
            objectFit='cover'
            src={src}
            alt='wlop 1'
          />
          <Box background='black' opacity='50%' height={50} mt={-50}>
            This is an image
          </Box>
        </Box>
        )}
        </Box>
    </Box>
  );
}

export default Test;
