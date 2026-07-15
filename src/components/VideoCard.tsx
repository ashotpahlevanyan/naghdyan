import { useState } from 'react';

interface Props {
  embedSrc: string;
  thumb: string;
  tagEn?: string;
  tagRu?: string;
  tagHy?: string;
  titleEn: string;
  titleRu: string;
  titleHy: string;
  descEn?: string;
  descRu?: string;
  descHy?: string;
}

/**
 * Click-to-play video card. Nothing loads from YouTube/Vimeo until the visitor
 * clicks — keeps the page fast and privacy-friendly. Text stays bilingual via
 * the same `data-lang-*` spans the rest of the site uses.
 */
export default function VideoCard({
  embedSrc,
  thumb,
  tagEn,
  tagRu,
  tagHy,
  titleEn,
  titleRu,
  titleHy,
  descEn,
  descRu,
  descHy,
}: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video-card reveal in">
      <div
        className="video-frame"
        role="button"
        tabIndex={0}
        aria-label="Play video"
        onClick={() => setPlaying(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setPlaying(true);
          }
        }}
      >
        {playing ? (
          <iframe
            src={embedSrc}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={titleEn}
          />
        ) : (
          <>
            {thumb && (
              <img
                src={thumb}
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="play-btn" />
          </>
        )}
      </div>
      <div className="v-body">
        {(tagEn || tagRu || tagHy) && (
          <div className="v-tag">
            <span data-lang-en>{tagEn}</span>
            <span data-lang-ru>{tagRu}</span>
            <span data-lang-hy>{tagHy}</span>
          </div>
        )}
        <h4>
          <span data-lang-en>{titleEn}</span>
          <span data-lang-ru>{titleRu}</span>
          <span data-lang-hy>{titleHy}</span>
        </h4>
        {(descEn || descRu || descHy) && (
          <p>
            <span data-lang-en>{descEn}</span>
            <span data-lang-ru>{descRu}</span>
            <span data-lang-hy>{descHy}</span>
          </p>
        )}
      </div>
    </div>
  );
}
