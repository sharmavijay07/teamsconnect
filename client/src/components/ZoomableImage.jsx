import React, { useState } from 'react';

const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullZoom, setIsFullZoom] = useState(false);

  // Handler to toggle zoom state
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  // Handler for full zoom on double click
  const handleFullZoomToggle = () => {
    setIsFullZoom(!isFullZoom);
  };

  return (
    <>
      {/* Image Thumbnail */}
      <img
        src={src}
        alt={alt}
        className=" w-48 border-3 border-blue-300  rounded cursor-pointer transition-transform duration-500 "
        onClick={handleZoomToggle}
      />

      {/* Zoomed Image */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-slate-500 bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleZoomToggle} // Close on click
        >
          <img
            src={src}
            alt={alt}
            className={`w-auto border-3 border-blue-400 rounded transition-transform duration-500 ${isFullZoom ? 'w-full h-full' : 'max-w-full max-h-full'}`}
            onDoubleClick={handleFullZoomToggle} // Toggle full zoom on double click
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
