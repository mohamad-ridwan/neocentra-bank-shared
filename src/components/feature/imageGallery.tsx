import React, { useRef, useCallback } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// import "lightgallery/css/lightgallery.css";
// import "lightgallery/css/lg-zoom.css";
// import "lightgallery/css/lg-thumbnail.css";

export interface ImageGalleryProps {
  images: string[];
  onClose?: () => void;
  initialIndex?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onClose,
  initialIndex = 0,
}) => {
  const lightGalleryRef = useRef<any>(null);

  const onInit = useCallback(
    (detail: any) => {
      if (detail && detail.instance) {
        lightGalleryRef.current = detail.instance;
        // Immediately open full-screen lightbox focus view at initialIndex
        setTimeout(() => {
          detail.instance.openGallery(initialIndex);
        }, 0);
      }
    },
    [initialIndex],
  );

  const handleAfterClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  if (!images || images.length === 0) return null;

  return (
    <LightGallery
      onInit={onInit}
      onAfterClose={handleAfterClose}
      speed={500}
      plugins={[lgThumbnail, lgZoom]}
      elementClassNames="hidden"
    >
      {images.map((src, index) => (
        <a key={`${src}-${index}`} href={src}>
          <img alt={`Gallery image ${index + 1}`} src={src} />
        </a>
      ))}
    </LightGallery>
  );
};

export default ImageGallery;
