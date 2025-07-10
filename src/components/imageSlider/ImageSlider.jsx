import React, { useRef } from "react";
import Slider from "react-slick";
import { Carousel } from "../../data/Carousel";
import styles from "./ImageSlider.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = () => {
  const imageData = Carousel;
  const sliderRef = useRef(null);

  // Settings for React Slick
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite looping
    speed: 500, // Transition speed in ms
    slidesToShow: 5, // Show 5 images at a time
    slidesToScroll: 1, // Scroll 1 image at a time
    centerMode: true, // Crucial for center image focus
    centerPadding: "0px", // No extra padding around the center image
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3500, // Autoplay speed in ms
    swipeToSlide: true, // Allow swiping to any slide
    focusOnSelect: true, // Clicks on non-center slides move them to center
    arrows: true, // Show next/prev arrows
    responsive: [
      // Responsive settings for different screen sizes
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // On very small screens, show just one
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
    // Customization for slide classes (important for your effects)
    customPaging: function (i) {
      return <div className={styles.dot}></div>;
    },
    appendDots: (dots) => (
      <div className={styles.dotsContainer}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    prevArrow: <CustomArrow type="prev" />,
    nextArrow: <CustomArrow type="next" />,
  };

  // Custom Arrow Components (optional, but good for custom styling)
  function CustomArrow(props) {
    const { className, style, onClick, type } = props;
    return (
      <button
        className={`${className} ${styles.navButton} ${
          type === "prev" ? styles.prev : styles.next
        }`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        {type === "prev" ? "&#10094;" : "&#10095;"}
      </button>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings} ref={sliderRef}>
        {imageData.map((item, index) => (
          <div key={item.id} className={styles.imageSlideWrapper}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} />
              <div className={styles.imageOverlay}>
                <h3 className={styles.imageTitle}>{item.title}</h3>
                <p className={styles.imageDescription}>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
