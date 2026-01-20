import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findProjectById, projects } from '../data/projects';
import { getImageUrlsForTitle } from '../utils/projectImages';
import { renderRichTextHtml } from '../utils/sanitizeRichText';

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const projectId = String(id);
  const project = String(projectId) ? findProjectById(projectId) : undefined;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [isGalleryOverlayOpen, setIsGalleryOverlayOpen] = useState(false);
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);

  const ordered = useMemo(() => [...projects].sort((a, b) => a.id - b.id), []);
  const index = useMemo(() => ordered.findIndex(p => p.id === projectId), [ordered, projectId]);

  const prev = index > 0 ? ordered[index - 1] : undefined;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  const imageUrls = useMemo(() => {
    if (!project) return [];
    return getImageUrlsForTitle(project.title);
  }, [project]);
  const hasImages = imageUrls.length > 0;

  // Reset gallery index when changing projects
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [projectId]);

  // Keep in sync with native fullscreen state (if supported)
  useEffect(() => {
    const onFsChange = () => {
      setIsGalleryFullscreen(document.fullscreenElement === galleryRef.current);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // If we're using overlay fallback, prevent background scrolling
  useEffect(() => {
    if (!isGalleryOverlayOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isGalleryOverlayOpen]);

  const isGalleryOpen = isGalleryOverlayOpen || isGalleryFullscreen;

  const exitGalleryFullscreen = async () => {
    if (isGalleryOverlayOpen) setIsGalleryOverlayOpen(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  };

  const enterGalleryFullscreen = async () => {
    const el = galleryRef.current;
    if (!el) return;
    // Prefer native fullscreen for best UX
    if (typeof el.requestFullscreen === 'function') {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // fall through to overlay
      }
    }
    setIsGalleryOverlayOpen(true);
  };

  const toggleGalleryFullscreen = async () => {
    if (isGalleryOpen) {
      await exitGalleryFullscreen();
    } else {
      await enterGalleryFullscreen();
    }
  };

  // Escape: exit gallery fullscreen if open, otherwise return to grid
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGalleryOpen) {
          exitGalleryFullscreen();
          return;
        }
        navigate('/');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGalleryOpen, navigate]);

  if (!project) {
    return (
      <div className="container project-detail">
        <div className="project-detail-top">
          <button className="ui-button" onClick={() => navigate('/')}>Back</button>
        </div>
        <div className="project-detail-center">
          <h1>Project not found</h1>
          <p>That project id doesn’t exist.</p>
        </div>
      </div>
    );
  }

  const showGalleryPrev = () => setCurrentImageIndex(i => Math.max(0, i - 1));
  const showGalleryNext = () => setCurrentImageIndex(i => Math.min(imageUrls.length - 1, i + 1));

  // Gallery navigation with keyboard when gallery is open (fullscreen/overlay)
  useEffect(() => {
    if (!isGalleryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showGalleryPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showGalleryNext();
      }
    };
    window.addEventListener('keydown', onKeyDown, { passive: false } as any);
    return () => window.removeEventListener('keydown', onKeyDown as any);
  }, [isGalleryOpen, imageUrls.length]);

  return (
    <div className="container project-detail">
      <div className="project-detail-top">
        <button className="ui-button" onClick={() => navigate('/')}>Back to Projects</button>
      </div>

      <div className="project-detail-layout">
        {/* Row 1 / Col 1: Previous */}
        <aside className="project-detail-side left project-detail-prev">
          {prev ? (
            <Link className="project-detail-nav" to={`/projects/${prev.id}`}>
              <div className="project-detail-navLabel">Previous</div>
              <div className="project-detail-navTitle">{prev.title}</div>
            </Link>
          ) : (
            <div className="project-detail-nav disabled">
              <div className="project-detail-navLabel">Previous</div>
              <div className="project-detail-navTitle">—</div>
            </div>
          )}
        </aside>

        {/* Row 2 / Col 1: Description (height matches gallery) */}
        <aside className="project-detail-side left project-detail-description">
          {project.description ? (
            <div className="project-detail-panel">
              <div className="project-detail-panelLabel">Description</div>
              <div
                className="project-detail-panelBody"
                dangerouslySetInnerHTML={{ __html: renderRichTextHtml(project.description) }}
              />
            </div>
          ) : (
            <div className="project-detail-panel">
              <div className="project-detail-panelLabel">Description</div>
              <div className="project-detail-panelBody">—</div>
            </div>
          )}
        </aside>

        {/* Row 1 / Col 2: Title + meta */}
        <main className="project-detail-center project-detail-head">
          {hasImages ? (
            <>
              <h1 className="project-detail-title">{project.title}</h1>
            </>
          ) : (
            <>
              {/* No images: center becomes the writing/content area */}
              <h1 className="project-detail-title">{project.title}</h1>
            </>
          )}
        </main>

        {/* Row 1 / Col 3: Next */}
        <aside className="project-detail-side right project-detail-next">
          {next ? (
            <Link className="project-detail-nav" to={`/projects/${next.id}`}>
              <div className="project-detail-navLabel">Next</div>
              <div className="project-detail-navTitle">{next.title}</div>
            </Link>
          ) : (
            <div className="project-detail-nav disabled">
              <div className="project-detail-navLabel">Next</div>
              <div className="project-detail-navTitle">—</div>
            </div>
          )}
        </aside>

        {/* Row 2 / Col 2: Gallery OR writing (height matches side panels) */}
        <section className="project-detail-center project-detail-content">
          {hasImages ? (
            <div
              ref={galleryRef}
              className={`project-detail-gallery${isGalleryOverlayOpen ? ' is-overlay' : ''}`}
              aria-label="Project gallery (double-click to toggle fullscreen)"
            >
              {isGalleryOpen ? (
                <button
                  className="ui-button project-detail-galleryClose"
                  onClick={() => exitGalleryFullscreen()}
                  type="button"
                >
                  Close
                </button>
              ) : null}

              <button
                className="nav-button prev-button"
                onClick={showGalleryPrev}
                disabled={currentImageIndex === 0}
                aria-label="Previous image"
                onDoubleClick={(e) => e.stopPropagation()}
              >
                ←
              </button>

              <div className="project-detail-galleryFrame" onDoubleClick={toggleGalleryFullscreen}>
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={`${project.title} image ${currentImageIndex + 1}`}
                  className="project-detail-galleryImage"
                  loading="lazy"
                />
              </div>

              <button
                className="nav-button next-button"
                onClick={showGalleryNext}
                disabled={currentImageIndex >= imageUrls.length - 1}
                aria-label="Next image"
                onDoubleClick={(e) => e.stopPropagation()}
              >
                →
              </button>
            </div>
          ) : (
            <div className="project-detail-body">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderRichTextHtml(
                    '<p><em>Project write‑up coming soon.</em></p><p>This area will eventually support full HTML or Markdown content.</p>'
                  ),
                }}
              />
            </div>
          )}
        </section>

        {/* Row 2 / Col 3: Credits (height matches gallery) */}
        <aside className="project-detail-side right project-detail-credits">
          <div className="project-detail-panel">
            <div className="project-detail-panelLabel">Credits</div>
            <div className="project-detail-panelBody">
              <div className="project-detail-creditsRow">
                <span className="project-detail-creditsKey">Year:</span>
                <span className="project-detail-creditsValue">{project.publicationYear}</span>
              </div>
              <div className="project-detail-creditsRow">
                <span className="project-detail-creditsKey">Author:</span>
                <span className="project-detail-creditsValue">{project.author}</span>
              </div>
              <div className="project-detail-creditsRow">
                <span className="project-detail-creditsKey">ID:</span>
                <span className="project-detail-creditsValue">{project.id}</span>
              </div>
              <div className="project-detail-creditsRow">
                <span className="project-detail-creditsKey">ISBN:</span>
                <span className="project-detail-creditsValue">{String(project.isbn)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

