import { useEffect } from "react";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { selfClearTimeout } from "../utils";

const DetailsOptionsMenu = ({ closeHandler , bgColor }) => {
  const [isInClosing, setIsInClosing] = useState(false);
  const [currentHight, setCurrentHight] = useState(50);
  const [containerScrollPosition, setContainerScrollPosition] = useState(0);

  useEffect(() => {
    if(!currentHight) internalCloseHandler()
  } , [currentHight])

  const internalCloseHandler = () => {
    setIsInClosing(true);
    selfClearTimeout(() => {
      closeHandler();
      setIsInClosing(false);
    }, 500);
  };


  const onScroll = ({ deltaY }) => {
    if(deltaY > 0) {
      if(currentHight >= 100) return;
      setCurrentHight(prev => prev + 10)
    }else if(deltaY < 0 && !containerScrollPosition) {
      if(currentHight > 0) setCurrentHight(prev => prev - 10)
    }
  }


  const containerScrollHandler = (e) => setContainerScrollPosition(e.target.scrollTop)

  return (
    <>
      <div onClick={internalCloseHandler} style={{ opacity : isInClosing ? 0 :  currentHight / 100  }} className="detailsOptionMenu__overlay"></div>
      <div
      onWheel={onScroll}
      style={{ height : `${currentHight}%` }}
      className={`detailsOptionMenu ${isInClosing ? "detailsOptionMenu--closing" : ""}`} >
      <div className={`detailsOptionMenu__back ${currentHight >= 80 ? "detailsOptionMenu__back--active" : ""}`}>
        <div onClick={internalCloseHandler}>
          <FiArrowLeft color="grey" />
          <p>Back</p>
        </div>
      </div>
      <div
        style={{ overflow : currentHight === 100 ? 'scroll' : "hidden" }}
        onScroll={containerScrollHandler}
         className="detailsOptionMenu__container">
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
        Maiores sed magnam et quia rerum eveniet. Laboriosam aut velit quia laboriosam. Vel ut excepturi nobis explicabo ex reprehenderit ad sed. Ad tenetur eum maiores quo molestiae veniam sint.
 
Asperiores fuga ratione atque. A ut corporis voluptates. Velit voluptas consequatur architecto aut velit iusto.
 
Voluptatibus aut aut. Rerum id voluptatem. Consequatur aut mollitia.
      </div>
    </div>
    </>
  );
};

export default DetailsOptionsMenu;
