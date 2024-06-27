'use client';

import FlashCard from '@/components/FlashCard';
import useDrag from '@/hooks/useDrag';
import { clamp } from '@/lib/utils';
import { flashCardsContext } from '@/providers/FlashCardsProvider';
import { useContext, useEffect, useState } from 'react';

export default function Home() {
  const [index, setIndex] = useState(0);
  const { flashCards, setFlashCards, updateFlashCard } =
    useContext(flashCardsContext);
  const { startPosition, endPosition, isDragging } = useDrag();

  const actualFlashCard = flashCards[index];

  useEffect(() => {
    if (isDragging) return;

    const diff = endPosition.x - startPosition.x;
    const diffY = endPosition.y - startPosition.y;

    if (diff === 0 || diffY === 0) return;

    if (diffY < -400) {
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

    if (Math.abs(diff) > 150) {
      setIndex((index) =>
        clamp(
          (index - Math.sign(diff) + flashCards.length) % flashCards.length,
          0,
          flashCards.length - 1,
        ),
      );
    }
  }, [isDragging]);

  return (
    <main className='flex h-full flex-col items-center justify-center gap-12 overflow-hidden text-4xl font-bold'>
      {flashCards.length > 0 ? (
        <>
          <p>
            {index + 1}/{flashCards.length}
          </p>
          {actualFlashCard && (
            <FlashCard
              key={`flash-card-${actualFlashCard.id}`}
              cardData={actualFlashCard}
              style={{
                transform: `translate(${isDragging ? endPosition.x - startPosition.x : 0}px,${isDragging ? endPosition.y - startPosition.y : 0}px)`,
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
