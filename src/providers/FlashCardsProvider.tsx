'use client';

import { supabase } from '@/lib/supabase/client';
import { createContext, useEffect, useState } from 'react';
import { Tables, TablesInsert, TablesUpdate } from '../../database.types';

type FlashCardsProviderProps = { children: React.ReactNode };

export const flashCardsContext = createContext<{
  flashCards: Tables<'flash_cards'>[];
  setFlashCards: React.Dispatch<React.SetStateAction<Tables<'flash_cards'>[]>>;
  addFlashCard: (
    flashCard: TablesInsert<'flash_cards'>,
  ) => Promise<Tables<'flash_cards'> | undefined>;
  updateFlashCard: (
    id: number,
    flashCard: TablesUpdate<'flash_cards'>,
  ) => Promise<Tables<'flash_cards'> | undefined>;
  deleteFlashCard: (id: number) => Promise<Tables<'flash_cards'> | undefined>;
  updateFlashCards: () => void;
}>({
  flashCards: [],
  async addFlashCard() {
    return undefined;
  },
  async updateFlashCard() {
    return undefined;
  },
  async deleteFlashCard() {
    return undefined;
  },
  setFlashCards() {},
  updateFlashCards() {},
});

export default function FlashCardsProvider({
  children,
}: FlashCardsProviderProps) {
  const [flashCards, setFlashCards] = useState<Tables<'flash_cards'>[]>([]);

  async function addFlashCard(flashCard: TablesInsert<'flash_cards'>) {
    const { data } = await supabase
      .from('flash_cards')
      .insert(flashCard)
      .select();

    if (!data) return undefined;

    return data[0];
  }

  async function updateFlashCard(
    id: number,
    flashCard: TablesUpdate<'flash_cards'>,
  ) {
    const { data } = await supabase
      .from('flash_cards')
      .update(flashCard)
      .eq('id', id)
      .select();

    if (!data) return undefined;

    return data[0];
  }

  async function deleteFlashCard(id: number) {
    const { data } = await supabase
      .from('flash_cards')
      .delete()
      .eq('id', id)
      .select();

    if (!data) return undefined;

    return data[0];
  }

  function updateFlashCards() {
    supabase
      .from('flash_cards')
      .select()
      .is('completed_at', null)
      .order('last_review', { nullsFirst: true, ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setFlashCards(data);
      });
  }

  useEffect(() => {
    updateFlashCards();
  }, []);

  return (
    <flashCardsContext.Provider
      value={{
        flashCards,
        setFlashCards,
        addFlashCard,
        updateFlashCard,
        deleteFlashCard,
        updateFlashCards,
      }}
    >
      {children}
    </flashCardsContext.Provider>
  );
}
