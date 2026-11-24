import { useEffect, useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();

      if (event.key === 'Tab') {
        const elements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [tabindex="0"]',
        );
        const first = elements?.[0];
        const last = elements?.[elements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) onClose();
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-title"
      onClick={handleBackdropClick}
    >
      <div className={css.modal} ref={modalRef}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : '/no-image.svg'
          }
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content} tabIndex={0} aria-label="Movie details">
          <h2 id="movie-title">{movie.title}</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || 'Unknown'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
