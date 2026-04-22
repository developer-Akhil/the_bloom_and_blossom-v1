import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  containerClassName,
  fallbackSrc = 'https://picsum.photos/seed/bloom/800/800',
  ...props 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden bg-gray-50", containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-bloom-pink/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-bloom-rose/20 border-t-bloom-rose animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={error ? fallbackSrc : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        referrerPolicy="no-referrer"
        loading="lazy"
        {...props}
      />
    </div>
  );
}
