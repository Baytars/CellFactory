// ========================================
//  useNarrative.js — 打字机效果 Hook
// ========================================

import { useState, useEffect, useCallback, useRef } from 'react';

export function useNarrative(queue, index) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef(null);

  const currentEntry = queue && index < queue.length ? queue[index] : null;
  const fullText = currentEntry ? `${currentEntry.speaker ? '' : ''}${currentEntry.text}` : '';
  const isComplete = index >= (queue?.length || 0);

  useEffect(() => {
    if (!fullText) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let charIdx = 0;

    intervalRef.current = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx >= fullText.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText, index]);

  const skipTyping = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedText(fullText);
    setIsTyping(false);
  }, [fullText]);

  return { displayedText, isTyping, isComplete, currentEntry, skipTyping };
}
