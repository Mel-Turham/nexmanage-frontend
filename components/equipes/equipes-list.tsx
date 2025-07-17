'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Users,
  Eye,
  Ban,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole, Users as UsersType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApiMutation, useApiQuery } from '@/hooks/apis/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate, getRoleBadgeVariant } from '@/helpers';
import { toast } from 'sonner';

const TableSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// Composant Skeleton pour les cartes mobile
const CardsSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <Skeleton className="h-6 w-20" />
            </div>

            <Skeleton className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorDisplay = ({ onRetry }: { onRetry: () => void }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>Erreur lors du chargement des équipes</span>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="py-12 text-center">
        <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-medium">Aucune équipe</h3>
        <p className="text-muted-foreground">
          Il n'y a pas encore d'utilisateurs dans cette organisation.
        </p>
      </div>
    </CardContent>
  </Card>
);

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return <Shield className="h-4 w-4" />;
    case 'EMPLOYE':
      return <Users className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const EquipesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const actifOrg = useAuthStore((state) => state.organisationActive);

  const { data, isLoading, error, refetch } = useApiQuery<UsersType>(
    ['users', actifOrg?.id || ''],
    `/org/${actifOrg?.id}/users`,
    {
      enabled: !!actifOrg?.id,
      retry: 3,
      retryDelay: 1000,
    },
  );

  const users = useMemo(() => {
    if (!data?.success || !Array.isArray(data.users)) {
      return [];
    }
    return data.users;
  }, [data]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const term = searchTerm.toLowerCase().trim();
    return users.filter((user) => {
      const nom = user.nom?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const phone = user.phone?.toLowerCase() || '';
      const role = user.role?.toLowerCase() || '';

      return (
        nom.includes(term) || email.includes(term) || phone.includes(term) || role.includes(term)
      );
    });
  }, [users, searchTerm]);

  const handleDetails = (userId: string) => {
    try {
      console.log('Détails pour:', userId);
      // Logique pour afficher les détails
    } catch (error) {
      console.error("Erreur lors de l'affichage des détails:", error);
    }
  };
  const { mutateAsync } = useApiMutation<
    { success: boolean; message: string; statusCode: number },
    { userIdToDisable: string }
  >('POST', `/org/${actifOrg?.id}/disable-user`, {
    onSuccess: (data) => {
      const { message, statusCode, success } = data;

      // Gestion centralisée des notifications basée sur le statut
      switch (statusCode) {
        case 200:
          if (success) {
            toast.success(message, {
              duration: 4000,
              position: 'top-right', // Position cohérente
            });
          }
          break;
        case 400:
          toast.error(message, {
            duration: 5000, // Durée plus longue pour les erreurs
            position: 'top-right',
          });
          break;
        case 401:
          toast.warning(message, {
            // Utiliser warning au lieu de message pour l'auth
            duration: 5000,
            position: 'top-right',
          });
          break;
        case 403:
          toast.error("Vous n'avez pas les permissions nécessaires", {
            duration: 5000,
            position: 'top-right',
          });
          break;
        case 404:
          toast.error('Utilisateur non trouvé', {
            duration: 4000,
            position: 'top-right',
          });
          break;
        case 500:
          toast.error('Erreur serveur, veuillez réessayer plus tard', {
            duration: 6000,
            position: 'top-right',
          });
          break;
        default:
          if (!success) {
            toast.error(message || "Une erreur inattendue s'est produite", {
              duration: 4000,
              position: 'top-right',
            });
          }
      }

      // Rafraîchir les données uniquement en cas de succès
      if (success && statusCode === 200) {
        refetch();
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la désactivation de l'utilisateur:", error);

      toast.error(error.message || "Une erreur inattendue s'est produite", {
        duration: 6000,
      });
    },
  });

  const handleBlock = async (userId: string) => {
    if (!userId || !actifOrg?.id) {
      toast.error("Informations manquantes pour effectuer l'action", {
        duration: 4000,
      });
      return;
    }
    const blockLoadingId = toast.loading('Désactivation en cours...');

    try {
      const result = await mutateAsync({ userIdToDisable: userId });
      console.log('Désactivation effectuée:', result);
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error);
    } finally {
      toast.dismiss(blockLoadingId);
    }
  };

  if (!actifOrg && !isLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Veuillez sélectionner une organisation pour voir les équipes.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return <ErrorDisplay onRetry={refetch} />;
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Rechercher par nom, email, téléphone ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {/* Indicateur de chargement dans la barre de recherche */}
        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        )}
      </div>

      {/* Affichage conditionnel basé sur l'état */}
      {isLoading ? (
        <>
          {/* Version desktop - Skeleton */}
          <div className="hidden md:block">
            <TableSkeleton />
          </div>
          {/* Version mobile - Skeleton */}
          <div className="md:hidden">
            <CardsSkeleton />
          </div>
        </>
      ) : filteredUsers.length === 0 ? (
        searchTerm ? (
          <Card>
            <CardContent className="pt-6">
              <div className="py-8 text-center">
                <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">Aucun résultat</h3>
                <p className="text-muted-foreground">
                  Aucun utilisateur ne correspond à votre recherche "{searchTerm}".
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState />
        )
      ) : (
        <>
          {/* Version desktop - Tableau */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {filteredUsers.length} Équipe{filteredUsers.length === 1 ? '' : 's'}
                  {searchTerm && (
                    <span className="text-muted-foreground text-sm font-normal">
                      sur {users.length} au total
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            {user.nom || 'Non renseigné'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-4 w-4" />
                            <span className="max-w-[200px] truncate" title={user.email}>
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            {user.phone || 'Non renseigné'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getRoleBadgeVariant(user.role as UserRole)}
                            className="flex w-fit items-center gap-1"
                          >
                            {getRoleIcon(user.role as UserRole)}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-muted-foreground h-4 w-4" />
                            {formatDate(user?.joinedAt?.toString() || 'NA')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDetails(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBlock(user.id)}
                                className="text-destructive"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Bloquer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Version mobile - Cards */}
          <div className="space-y-3 md:hidden">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">{user.nom || 'Non renseigné'}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="truncate text-sm" title={user.email}>
                            {user.email}
                          </span>
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(String(user?.joinedAt) || 'NA')}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={getRoleBadgeVariant(user.role as UserRole)}
                        className="flex w-fit items-center gap-1"
                      >
                        {getRoleIcon(user.role as UserRole)}
                        {user.role}
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDetails(user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleBlock(user.id)}
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Bloquer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EquipesList;
