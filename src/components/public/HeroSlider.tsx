"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BannerSlide = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
};

export function HeroSlider({ slides }: { slides: BannerSlide[] }) {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const titleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const descTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const typeText = useCallback((text: string, speed: number, onTick: (v: string) => void, onDone?: () => void) => {
    let i = 0;
    onTick("");
    return setInterval(() => {
      i += 1;
      onTick(text.slice(0, i));
      if (i >= text.length) {
        if (onDone) onDone();
      }
    }, speed);
  }, []);

  const showSlide = useCallback(
    (idx: number) => {
      if (!slides.length) return;
      let next = idx;
      if (next >= slides.length) next = 0;
      if (next < 0) next = slides.length - 1;
      setIndex(next);
      const s = slides[next];
      if (titleTimer.current) clearInterval(titleTimer.current);
      if (descTimer.current) clearInterval(descTimer.current);
      setTitle("");
      setDesc("");
      titleTimer.current = typeText(s.title, 60, setTitle, () => {
        if (titleTimer.current) clearInterval(titleTimer.current);
        descTimer.current = typeText(s.subtitle || "", 35, setDesc, () => {
          if (descTimer.current) clearInterval(descTimer.current);
        });
      });
    },
    [slides, typeText]
  );

  useEffect(() => {
    showSlide(0);
    const auto = setInterval(() => setIndex((i) => (i + 1) % Math.max(slides.length, 1)), 6000);
    return () => {
      clearInterval(auto);
      if (titleTimer.current) clearInterval(titleTimer.current);
      if (descTimer.current) clearInterval(descTimer.current);
    };
  }, [slides, showSlide]);

  useEffect(() => {
    if (!slides[index]) return;
    const s = slides[index];
    if (titleTimer.current) clearInterval(titleTimer.current);
    if (descTimer.current) clearInterval(descTimer.current);
    titleTimer.current = typeText(s.title, 60, setTitle, () => {
      if (titleTimer.current) clearInterval(titleTimer.current);
      descTimer.current = typeText(s.subtitle || "", 35, setDesc, () => {
        if (descTimer.current) clearInterval(descTimer.current);
      });
    });
  }, [index, slides, typeText]);

  if (!slides.length) return null;

  return (
    <div className="slider">
      <button type="button" className="slider-btn btn-prev" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} aria-label="Previous">
        ❮
      </button>
      <button type="button" className="slider-btn btn-next" onClick={() => setIndex((i) => (i + 1) % slides.length)} aria-label="Next">
        ❯
      </button>
      <div className="slides" style={{ transform: `translateX(${-index * 100}%)` }}>
        {slides.map((s, i) => (
          <div className="slide" key={s.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.imageUrl} alt={s.title} loading={i === 0 ? "eager" : "lazy"} />
            <div className="text-box">
              <h1>{i === index ? title : ""}</h1>
              <p>{i === index ? desc : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
