'use client';

import FlashCard from '@/components/FlashCard';
import useDrag from '@/hooks/useDrag';
import { clamp, cn } from '@/lib/utils';
import { flashCardsContext } from '@/providers/FlashCardsProvider';
import { useContext, useEffect, useState } from 'react';

export default function Home() {
  const [index, setIndex] = useState(0);
  const { flashCards, setFlashCards, updateFlashCards, updateFlashCard } =
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
        completed_at: new Date().toISOString(),
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
        setIndex((index) => Math.max(index - 1, 0));
      }

      // Swipe right
      else {
        updateFlashCard(actualFlashCard.id, {
          last_review: new Date().toJSON(),
        });

        setIndex((index) => index + 1);
      }
    }
  }, [isDragging]);

  useEffect(() => {
    if (index < flashCards.length) return;

    setIndex(0);
    updateFlashCards();
  }, [index, flashCards]);

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-12 overflow-hidden text-center text-4xl font-bold'>
      {flashCards.length > 0 ? (
        <>
          <div
            className='absolute top-0 z-10 h-72 w-full bg-gradient-to-b from-purple-500'
            style={{ opacity: `${isDragging ? -diffY / 15 : 0}%` }}
          />
          {actualFlashCard && (
            <FlashCard
              key={`flash-card-${actualFlashCard.id}`}
              cardData={actualFlashCard}
              willDelete={isDragging && willDelete}
              willSwipe={isDragging && willSwipe}
              className={cn({
                'blur-[2px]': isDragging && (willDelete || willSwipe),
              })}
              style={{
                transform: `translate(${isDragging ? endPosition.x - startPosition.x : 0}px,${isDragging ? endPosition.y - startPosition.y : 0}px)`,
              }}
            />
          )}
          <p className='text-neutral-700'>
            {index + 1}/{flashCards.length}
          </p>
        </>
      ) : (
        <p>Nenhum Flash Card Novo</p>
      )}
    </div>
  );
}
