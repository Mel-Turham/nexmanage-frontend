import { ProfileDisplay } from '@/components/profile/profile-display';

export default async function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">Gérez vos informations personnelles</p>
      </div>
      <ProfileDisplay />
    </div>
  );
}
