import React from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { X } from "lucide-react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

export interface ImageGalleryProps {
  images: string[];
  onClose?: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onClose,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Close gallery"
          className="absolute top-4 right-4 z-[9999] p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors focus:outline-none shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
        <LightGallery
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {images.map((src, index) => (
            <a
              key={`${src}-${index}`}
              href={src}
              className="group block relative aspect-square overflow-hidden rounded-xl bg-slate-800 border border-slate-700/50 shadow-md transition-all duration-300 hover:scale-[1.03] hover:border-slate-500"
            >
              <img
                alt={`Gallery image ${index + 1}`}
                src={src}
                className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            </a>
          ))}
        </LightGallery>
      </div>
    </div>
  );
};

export default ImageGallery;
