'use client';

import useToggle from '@/hooks/useToggle';
import { Tables } from '../../database.types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';

type FlashCardProps = {
  cardData: Tables<'flash_cards'>;
  willDelete: boolean;
  willSwipe: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FlashCard({
  cardData,
  willDelete,
  willSwipe,
  className,
  style,
  ...props
}: FlashCardProps) {
  const [isShowingResponse, toggleIsShowingResponse] = useToggle();

  return (
    <div
      {...props}
      className={cn('relative aspect-[63/88] w-2/3', className)}
      onClick={() => {
        toggleIsShowingResponse();

        supabase
          .from('flash_cards')
          .update({ last_review: new Date().toISOString() })
          .eq('id', cardData.id)
          .then((r) => console.log(r));
      }}
      style={style}
    >
      <div
        className='absolute inset-0 border border-neutral-700 bg-neutral-800 text-2xl transition duration-300'
        style={{
          transform: `rotateX(${isShowingResponse ? '180' : '0'}deg)  scale(${willDelete ? 120 : willSwipe ? 80 : 100}%)`,
        }}
      >
        <div
          className='absolute inset-0 flex items-center justify-center p-6 text-center transition duration-300 [backface-visibility:hidden]'
          style={{
            transform: `rotateX(${isShowingResponse ? '0' : '180'}deg)`,
          }}
        >
          <div className='scale-y-[-1]'>{cardData.response}</div>
        </div>
        <div
          className='absolute inset-0 flex items-center justify-center p-6 text-center transition duration-300 [backface-visibility:hidden]'
          style={{
            transform: isShowingResponse ? 'rotateX(180deg)' : 'rotateX(0deg)',
          }}
        >
          {cardData.question}
        </div>
      </div>
    </div>
  );
}
