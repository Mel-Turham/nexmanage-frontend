import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

export const PhoneInput = ({
  className,
  ...props
}: React.ComponentProps<'input'>) => {
  return (
    <Input
      data-slot='phone-input'
      className={cn(
        '-ms-px rounded-s-none shadow-none focus-visible:z-10',
        className
      )}
      {...props}
    />
  );
};
