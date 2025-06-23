'use client';

import NextManageIcon from '@/icons/logo';
import AuthLayout from '@/layouts/auth-layout';
import {
  createEntrepriseSchema,
  CreateEntrepriseSchema,
} from '@/schemas/create-entreprise-schemas/create-entreprise.schemas';
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
import { useApiMutation } from '@/hooks/apis/use-api';

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

  const form = useForm<CreateEntrepriseSchema>({
    resolver: zodResolver(createEntrepriseSchema),
    defaultValues: {
      nom: '',
      domaine: '',
      email: '',
      adresse: '',
      nbre_employers: 0,
    },
  });

  const createEntrepriseMutation = useApiMutation<
    unknown,
    CreateEntrepriseSchema
  >('POST', '/entreprises', {
    onSuccess: (data) => {
      toast.success('Organisation créée avec succès');
      console.log("Données de l'organisation:", data);
      router.push('/admin');
    },
    onError: (error) => {
      toast.error(
        error.message || "Erreur lors de la création de l'organisation"
      );
      console.error("Erreur de création d'organisation:", error);
    },
  });
  const onSubmit = async (data: CreateEntrepriseSchema) => {
    try {
      console.log('Données du formulaire:', data);
      await createEntrepriseMutation.mutateAsync(data);
      form.reset(); // Réinitialiser le formulaire après la soumission
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <AuthLayout
      url='/auth/register'
      text="Vous n'avez pas de compte?"
      textLink='Creer votre compte'
    >
      <NextManageIcon />
      <div className='flex flex-col items-center mx-auto gap-4 w-full lg:justify-center max-w-[500px]'>
        <div className='z-10'>
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
            className='space-y-3 relative z-20 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='nom'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=' '
                        aria-label="Nom de l'organisation"
                        className='peer pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                      />
                    </FormControl>
                    <FormLabel className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0  peer-focus:text-xs peer-focus:text-[#344EA2] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#344EA2] bg-background px-1'>
                      Nom de l&apos;organisation
                    </FormLabel>
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
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=' '
                        aria-label="Domaine d'activité"
                        className='peer pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                      />
                    </FormControl>
                    <FormLabel className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0  peer-focus:text-xs peer-focus:text-[#344EA2] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#344EA2] bg-background px-1'>
                      Votre domaine d&apos;activité
                    </FormLabel>
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
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        placeholder=' '
                        aria-label='Adresse email'
                        className='peer pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                      />
                    </FormControl>
                    <FormLabel className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#344EA2] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#344EA2] bg-background px-1'>
                      Votre email
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='adresse'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=' '
                        aria-label='Adresse'
                        className='peer pt-6 pb-2 px-3 border focus:border-[#344EA2] transition-all duration-200'
                      />
                    </FormControl>
                    <FormLabel className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#344EA2] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#344EA2] bg-background px-1'>
                      Votre adresse complète
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nbre_employers'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-foreground mb-3 block'>
                    Nombre d&apos;employés
                  </FormLabel>
                  <FormControl>
                    <div className='grid grid-cols-4 gap-2'>
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
        px-1.5 py-0.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2 transform hover:scale-105
        ${
          isSelected
            ? 'bg-[#344EA2] text-white border-[#344EA2] shadow-md scale-105'
            : 'bg-background text-muted-foreground border-border hover:border-[#344EA2]/50 hover:text-foreground'
        }
      `}
    >
      {label}
    </button>
  );
};
