'use client';

import useToggle from '@/hooks/useToggle';
import { Tables } from '../../database.types';
import { cn } from '@/lib/utils';

type FlashCardProps = {
  cardData: Tables<'flash_cards'>;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FlashCard({
  cardData,
  className,
  style,
  ...props
}: FlashCardProps) {
  const [isShowingResponse, toggleIsShowingResponse] = useToggle();

  return (
    <div
      {...props}
      className={cn('relative aspect-[63/88] h-2/3', className)}
      onClick={toggleIsShowingResponse}
      style={style}
    >
      <div
        className='absolute inset-0 border border-neutral-700 bg-neutral-800 text-2xl transition duration-300'
        style={{
          transform: isShowingResponse ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        <div
          className='absolute inset-0 flex items-center justify-center p-6 text-center transition duration-300 [backface-visibility:hidden]'
          style={{
            transform: isShowingResponse ? 'rotateX(0deg)' : 'rotateX(180deg)',
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
