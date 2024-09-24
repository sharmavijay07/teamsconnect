import React, { useState } from 'react';

const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Handler to toggle zoom state
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      {/* Image Thumbnail */}
      <img
        src={src}
        alt={alt}
        className="w-48 cursor-pointer transition-transform duration-300"
        onClick={handleZoomToggle}
      />

      {/* Zoomed Image with blurred background */}
      {isZoomed && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleZoomToggle}
        >
          <img
            src={src}
            alt={alt}
            className="w-auto max-w-full h-auto max-h-full scale-150 transition-transform duration-300"
          />
          
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
