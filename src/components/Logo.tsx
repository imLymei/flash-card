import { cn } from '@/lib/utils';

export default function Logo({ size }: { size: 'small' | 'medium' | 'large' }) {
  return (
    <div
      className={cn('font-bold', {
        'text-4xl': size === 'large',
        'text-2xl': size === 'medium',
      })}
    >
      N
    </div>
  );
}
