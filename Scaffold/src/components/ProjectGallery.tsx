import React, { useEffect, useState, useRef } from 'react';

interface ProjectGalleryProps {
  projectId: string; // folder name slug
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projectId,
  currentIndex,
  onIndexChange,
  onClose,
}) => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [isTurning, setIsTurning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSinglePage, setIsSinglePage] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const galleryRef = useRef<HTMLDivElement>(null);

  // Load images (folder-based)
  useEffect(() => {
    const allImages = import.meta.glob(
      '/src/assets/projects/**/*.{jpg,png,webp}',
      { eager: true, as: 'url' }
    );

    const filteredPaths = Object.entries(allImages)
      .filter(([path]) => path.includes(`/${projectId}/`))
      .map(([, url]) => url as string)
      .sort((a, b) => {
        const numA = parseInt(a.match(/\((\d+)\)/)?.[1] || '0');
        const numB = parseInt(b.match(/\((\d+)\)/)?.[1] || '0');
        return numA - numB;
      });

    setImagePaths(filteredPaths);
  }, [projectId]);

  // Handle responsive single-page mode
  useEffect(() => {
    const onResize = () => setIsSinglePage(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSinglePage && isTurning) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, imagePaths.length, isTurning, isSinglePage]);

  const handleNext = () => {
    const step = isSinglePage ? 1 : 2;
    const maxIndex = isSinglePage ? imagePaths.length - 1 : imagePaths.length - 2;
    if (!isSinglePage && (isTurning || currentIndex >= maxIndex)) return;
    if (isSinglePage && currentIndex >= maxIndex) return;
    if (isSinglePage) {
      onIndexChange(Math.min(currentIndex + step, imagePaths.length - 1));
      return;
    }
    setDirection('forward');
    setIsTurning(true);
    setTimeout(() => {
      onIndexChange(currentIndex + step);
      setIsTurning(false);
    }, 600);
  };

  const handlePrevious = () => {
    const step = isSinglePage ? 1 : 2;
    if (!isSinglePage && (isTurning || currentIndex === 0)) return;
    if (isSinglePage && currentIndex === 0) return;
    if (isSinglePage) {
      onIndexChange(Math.max(0, currentIndex - step));
      return;
    }
    setDirection('backward');
    setIsTurning(true);
    setTimeout(() => {
      onIndexChange(Math.max(0, currentIndex - step));
      setIsTurning(false);
    }, 600);
  };

  if (imagePaths.length === 0) {
    return <div>No images found for "{projectId}".</div>;
  }

  return (
    <div className="book-gallery" ref={galleryRef}>
      <div className="spread-container-wrapper">
        <button
          className="nav-button prev-button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ←
        </button>

        <div
          className={`spread-container ${
            !isSinglePage && isTurning
              ? direction === 'forward'
                ? 'turning'
                : 'turning-previous'
              : ''
          }`}
        >
          <img
            src={imagePaths[currentIndex]}
            className="gallery-page left-page"
            alt={`${projectId} - Page ${currentIndex + 1}`}
          />
          {!isSinglePage && currentIndex + 1 < imagePaths.length && (
            <img
              src={imagePaths[currentIndex + 1]}
              className="gallery-page right-page"
              alt={`${projectId} - Page ${currentIndex + 2}`}
            />
          )}
        </div>

        <button
          className="nav-button next-button"
          onClick={handleNext}
          disabled={
            isSinglePage
              ? currentIndex >= imagePaths.length - 1
              : currentIndex >= imagePaths.length - 2
          }
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ProjectGallery;
