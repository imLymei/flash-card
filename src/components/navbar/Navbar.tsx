'use client';

import { ICON_SIZE } from '@/config';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { flashCardsContext } from '@/providers/FlashCardsProvider';
import { useContext, useRef, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';

export default function Navbar() {
  const [isAddingCard, setIsAddingCard] = useState(false);

  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  const isCodeInputRef = useRef<HTMLInputElement>(null);

  const { setFlashCards } = useContext(flashCardsContext);

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (
            !questionInputRef.current ||
            !responseInputRef.current ||
            !isCodeInputRef.current
          )
            return;

          supabase
            .from('flash_cards')
            .insert({
              question: questionInputRef.current.value.trim(),
              response: responseInputRef.current.value.trim(),
              is_code: isCodeInputRef.current.checked,
            })
            .select()
            .then((response) => {
              if (!response.data) return;
              setFlashCards((flashCards) => [...flashCards, response.data[0]]);

              questionInputRef.current!.value = '';
              responseInputRef.current!.value = '';
              isCodeInputRef.current!.value = '';
            });
        }}
        className={cn(
          'pointer-events-auto absolute inset-0 z-20 flex flex-col gap-12 bg-neutral-900 p-12 text-2xl transition duration-200 ease-in-out',
          { 'translate-y-full': !isAddingCard },
        )}
      >
        <p className='text-center text-4xl font-bold'>Add Flash Card</p>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex flex-1 flex-col'>
            <label>Question</label>
            <textarea
              ref={questionInputRef}
              required
              placeholder='What is a Array?'
              className='flex-1 border border-neutral-700 bg-neutral-950 p-2 focus:outline-purple-500'
            />
          </div>

          <div className='flex flex-1 flex-col'>
            <label>Response</label>
            <textarea
              ref={responseInputRef}
              required
              placeholder='Is a data structure that holds a group of values in a sequence'
              className='flex-1 border border-neutral-700 bg-neutral-950 p-2 focus:outline-purple-500'
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              ref={isCodeInputRef}
              id='isCodeInput'
              type='checkbox'
              className='size-6 accent-purple-500'
            />
            <label htmlFor='isCodeInput'>Is Code</label>
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => setIsAddingCard(false)}
            className='flex-1 border border-neutral-700 p-2'
          >
            Cancel
          </button>
          <button className='flex-1 bg-neutral-700 p-2'>Add</button>
        </div>
      </form>

      <nav className='pointer-events-auto absolute bottom-0 flex w-screen justify-center p-6'>
        <button onClick={() => setIsAddingCard(true)}>
          <IoIosAddCircle size={ICON_SIZE.EXTRA_LARGE} />
        </button>
      </nav>
    </div>
  );
}
