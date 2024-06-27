'use client';

import FlashCard from '@/components/FlashCard';
import useDrag from '@/hooks/useDrag';
import { supabase } from '@/lib/supabase/client';
import { clamp, cn } from '@/lib/utils';
import { flashCardsContext } from '@/providers/FlashCardsProvider';
import { useContext, useEffect, useState } from 'react';

export default function Home() {
  const [index, setIndex] = useState(0);
  const { flashCards, setFlashCards, updateFlashCard } =
    useContext(flashCardsContext);
  const { startPosition, endPosition, isDragging } = useDrag();

  const actualFlashCard = flashCards[index];

  const diff = endPosition.x - startPosition.x;
  const willSwipe = Math.abs(diff) > 120;
  const diffY = endPosition.y - startPosition.y;
  const willDelete = diffY < -250;

  useEffect(() => {
    if (isDragging) return;

    if (diff === 0 || diffY === 0) return;

    // Swipe top
    if (willDelete) {
      updateFlashCard(actualFlashCard.id, {
        completed_at: new Date().toJSON(),
      }).then((flashCard) => {
        if (!flashCard) return;

        setFlashCards((flashCards) =>
          flashCards.filter(
            (filterFlashCard) => filterFlashCard.id !== flashCard.id,
          ),
        );
        setIndex((index) =>
          clamp((index + 1) % flashCards.length, 0, flashCards.length - 1),
        );
      });
    }

    // Swipe X
    if (willSwipe) {
      // Swipe left
      if (diff > 0) {
        setIndex((index) =>
          clamp(
            (index - 1 + flashCards.length) % flashCards.length,
            0,
            flashCards.length - 1,
          ),
        );
      }

      // Swipe right
      if (diff < 0) {
        updateFlashCard(actualFlashCard.id, {
          last_review: new Date().toJSON(),
        });

        setIndex((index) =>
          clamp(
            (index + 1 + flashCards.length) % flashCards.length,
            0,
            flashCards.length - 1,
          ),
        );
      }
    }
  }, [isDragging]);

  return (
    <main className='flex h-full flex-col items-center justify-center gap-12 overflow-hidden text-center text-4xl font-bold'>
      {flashCards.length > 0 ? (
        <>
          <div
            className='absolute top-0 z-10 h-72 w-full bg-gradient-to-b from-green-500'
            style={{ opacity: `${isDragging ? -diffY / 10 : 0}%` }}
          />
          <p>
            {index + 1}/{flashCards.length}
          </p>
          {actualFlashCard && (
            <FlashCard
              key={`flash-card-${actualFlashCard.id}`}
              cardData={actualFlashCard}
              className={cn({
                'blur-[2px]': isDragging && (willDelete || willSwipe),
              })}
              style={{
                transform: `translate(${isDragging ? endPosition.x - startPosition.x : 0}px,${isDragging ? endPosition.y - startPosition.y : 0}px) scale(${isDragging && willDelete ? 110 : isDragging && willSwipe ? 90 : 100}%)`,
              }}
            />
          )}
        </>
      ) : (
        <p>Nenhum Flash Card Novo</p>
      )}
    </main>
  );
}
