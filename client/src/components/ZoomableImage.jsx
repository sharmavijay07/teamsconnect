import React, { useState, useEffect, useRef } from 'react';

const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullZoom, setIsFullZoom] = useState(false);
  const [scale, setScale] = useState(1); // Scale for zooming
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position for dragging
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const imgRef = useRef(null);

  // Handler to toggle zoom state
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    setScale(1); // Reset scale on zoom toggle
    setPosition({ x: 0, y: 0 }); // Reset position
  };

  // Handler for full zoom on double click
  const handleFullZoomToggle = () => {
    setIsFullZoom(!isFullZoom);
  };

  // Zoom on scroll
  const handleScroll = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    setScale((prevScale) => {
      let newScale = prevScale + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed);
      if (newScale < 1) newScale = 1; // Prevent scaling below original size
      return newScale;
    });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (dragging) {
      const x = e.clientX - startPos.x;
      const y = e.clientY - startPos.y;
      setPosition({ x, y });
    }
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      {/* Image Thumbnail */}
      <img
        src={src}
        alt={alt}
        className=" w-48 border-3 border-blue-300/60  rounded cursor-pointer transition-transform duration-500 "
        onClick={handleZoomToggle}
      />

      {/* Zoomed Image */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-slate-500 bg-opacity-60 flex items-center justify-center z-50"
          onClick={handleZoomToggle} // Close on click
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              cursor: dragging ? 'grabbing' : 'grab',
            }}
            className={`w-auto border-3 border-blue-400 rounded transition-transform duration-500 ${
              isFullZoom ? 'w-full h-full' : 'max-w-full max-h-full'
            }`}
            onDoubleClick={handleFullZoomToggle} // Toggle full zoom on double click
            onWheel={handleScroll} // Handle zoom on scroll
            onMouseDown={handleMouseDown} // Handle drag start
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
