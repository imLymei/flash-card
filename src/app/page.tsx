import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: flashCards } = await supabase.from('flash_cards').select();

  console.log(flashCards);

  return (
    <main>
      {flashCards?.map((flashCard) => (
        <div key={`flash-card-${flashCard.id}`}>{flashCard.question}</div>
      ))}
    </main>
  );
}
