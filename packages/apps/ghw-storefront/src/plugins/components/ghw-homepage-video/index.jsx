import React, { useState } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./styles.css";

const VideoPlayer = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleClick = () => {
    setShowVideo(true);
  };

  return (
    <div id="video" className="video-cnr">
      {showVideo ? (
        <iframe
          width="1400px" style={{ cursor: "pointer" }}
          allow="autoplay"
          height="700px"
          src="https://player.vimeo.com/video/565846541?h=e24f18e914?autoplay=1&modestbranding=1&showinfo=0"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <img
          className="thumb"
          src="/file/general/nature-img.png"
          alt=""
          id="video-image" style={{ cursor: "pointer" }}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

const GHWHomepageVideo = (props) => {
  return (
    
    <Styled id="GHWHomepageVideo" css={css}>
      <section className="prod-slider-sec">
        <div className="container-fixed">
          {/* <iframe
            id="add"
            width="1400px"
            allow="autoplay"
            height="500px"
            src="https://player.vimeo.com/video/565846541?h=e24f18e914?autoplay=1&modestbranding=1&showinfo=0"
            frameBorder="0"
            allowFullScreen=""
          ></iframe>   */}
          <VideoPlayer />
        </div>
      </section>
    </Styled>
  );
};

export default GHWHomepageVideo;
