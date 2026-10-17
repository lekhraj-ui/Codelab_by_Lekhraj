import React, { useState, useEffect } from 'react';

export interface TypingAnimationProps {
  texts: string[];
  speed?: number; // ms per typed char
  deleteSpeed?: number; // ms per deleted char
  pauseTime?: number; // ms to pause after typing full string
  className?: string;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 1800,
  className = '',
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentFullText = texts[textIndex % texts.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, speed);
      } else {
        // Paused before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <span
        className="inline-block w-[2px] h-[1em] ml-1 bg-current animate-[blink-caret_0.75s_step-end_infinite] align-middle"
        style={{ verticalAlign: 'middle' }}
        aria-hidden="true"
      />
    </span>
  );
};

export default TypingAnimation;
