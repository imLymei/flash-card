'use client';

import { ICON_SIZE } from '@/config';
import { IoIosAddCircle } from 'react-icons/io';

export default function Navbar() {
  return (
    <nav className='absolute bottom-0 flex w-screen justify-center p-6'>
      <button>
        <IoIosAddCircle size={ICON_SIZE.EXTRA_LARGE} />
      </button>
    </nav>
  );
}
