'use client';

import useToggle from '@/hooks/useToggle';
import { Tables } from '../../database.types';

type FlashCardProps = {
  cardData: Tables<'flash_cards'>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FlashCard({
  cardData,
  style,
  ...props
}: FlashCardProps) {
  const [isShowingResponse, toggleIsShowingResponse] = useToggle();

  return (
    <div
      {...props}
      className='relative aspect-[63/88] h-2/3'
      onClick={toggleIsShowingResponse}
      style={style}
    >
      <div
        className='absolute inset-0 border border-neutral-700 bg-neutral-800 text-2xl transition'
        style={{
          ...style,
          transform: isShowingResponse ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        <div
          className='absolute inset-0 flex items-center justify-center p-6 text-center transition [backface-visibility:hidden]'
          style={{
            transform: isShowingResponse ? 'rotateX(0deg)' : 'rotateX(180deg)',
          }}
        >
          <div className='scale-y-[-1]'>{cardData.response}</div>
        </div>
        <div
          className='absolute inset-0 flex items-center justify-center p-6 text-center transition [backface-visibility:hidden]'
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
