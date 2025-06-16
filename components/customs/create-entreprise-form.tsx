'use client';

import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import { createEntrepriseSchema } from '@/schemas/create-entreprise-schemas/create-entreprise.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { toast } from 'sonner';

const CreateEntrepriseForm = () => {
  const router = useRouter();
  const numberEmployees = [
    { value: 7, label: '1-7' },
    { value: 15, label: '8-15' },
    { value: 30, label: '16-30' },
    { value: 50, label: '31-50' },
    { value: 100, label: '51-100' },
    { value: 250, label: '101-250' },
    { value: 300, label: '250+' },
  ];
  const form = useForm<createEntrepriseSchema>({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      name: '',
      domaine: '',
      email: '',
      address: '',
      nombreEmployes: 0,
    },
  });

  const onSubmit = async (data: createEntrepriseSchema) => {
    // simulation avec la promesse
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(
      `Organisation créee avec success\n${JSON.stringify(data, null, 2)}`,
      { duration: 3000 }
    );
    form.reset();

    router.push('/dashboard');
  };

  return (
    <AuthLayout className='lg:justify-normal'>
      <NextManageIcon />
      <div className='flex flex-col items-center mx-auto gap-4 w-full lg:justify-center  max-w-[500px]'>
        <div className='relative z-10'>
          <h1 className='text-2xl font-semibold text-center text-[#344EA2]'>
            Créez votre organisation
          </h1>
          <p className='text-base tracking-tighter font-medium text-center mt-2 text-muted-foreground'>
            <span className='text-muted-foreground'>
              Créez facilement et gérez efficacement votre organisation
            </span>
            <br />
            <span className='text-muted-foreground'>avec NextManage</span>
          </p>
        </div>
        <Form {...form}>
          <form
            className='space-y-4 relative z-20 w-full mt-2'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='group relative'>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        Nom de l&apos;organisation
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        aria-label="Nom de l'organisation"
                        className=''
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='domaine'
              render={({ field }) => (
                <FormItem>
                  <div className='relative group '>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        Votre domaine d&apos;activité
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} aria-label="Domaine d'activité" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='relative group '>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background w-full inline-flex px-2'>
                        Votre email
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        aria-label='Adresse email'
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <div className='relative group '>
                    <FormLabel className='origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 py-1.5 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium '>
                      <span className='bg-background inline-flex px-2'>
                        Votre adresse complète
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} aria-label='Adresse' />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nombreEmployes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-foreground mb-3 block'>
                    Nombre d&apos;employés
                  </FormLabel>
                  <FormControl>
                    <div className=' grid grid-cols-4 gap-2'>
                      {numberEmployees.map((item) => (
                        <BadgeEmploye
                          key={item.value}
                          label={item.label}
                          value={item.value}
                          isSelected={field.value === item.value}
                          onClick={() => field.onChange(item.value)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type='submit'
              className='custom-button-gradient py-2 w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
            >
              Créer le compte
            </button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default CreateEntrepriseForm;

// Composant Badge pour le nombre d'employés
interface BadgeEmployeProps {
  label: string;
  value: number;
  isSelected: boolean;
  onClick: () => void;
}

const BadgeEmploye = ({ label, isSelected, onClick }: BadgeEmployeProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`
        px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2
        ${
          isSelected
            ? 'bg-[#344EA2] text-white border-[#344EA2] shadow-md'
            : 'bg-background text-muted-foreground border-border hover:border-[#344EA2]/50 hover:text-foreground'
        }
      `}
    >
      {label}
    </button>
  );
};
