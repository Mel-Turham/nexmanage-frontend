'use client';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit3 } from 'lucide-react';
import { ProfileEditDialog } from '@/components/profile/profile-edit-dialog';
import { Phone } from 'lucide-react';
import { getInitials } from '@/helpers';
import { useState } from 'react';
import { useApiQuery } from '@/hooks/apis/use-api';
import { ProfileSkeleton } from './profile-skeleton';

export function ProfileDisplay() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data } = useApiQuery(['testme'], '/user/me');
  console.log('current user', data);
  const user = useAuthStore((state) => state.user);
  if (!user) return <ProfileSkeleton />;
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=120&width=120" alt={user?.nom ?? 'NA'} />
                <AvatarFallback className="text-lg">
                  {getInitials(user?.nom ?? 'NA')}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user?.nom ?? 'NA'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={() => setIsEditDialogOpen(true)} className="w-full" variant="outline">
              <Edit3 className="mr-2 h-4 w-4" />
              Modifier le profil
            </Button>
          </CardContent>
        </Card>

        {/* Informations détaillées */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{user?.phone || 'Pas de numéro de téléphone'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <ProfileEditDialog user={user} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      )}
    </>
  );
}
