import {Eye, LayoutDashboard, Plus, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';
import {Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Label} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function AccountOverviewPage() {
  const [organizations, setOrganizations] = useState<Tables<'tenants'>[] | null>(null);

  async function deleteOrganization(id: string) {
    const {error} = await supabase.from('tenants').delete().eq('id', id);
    if (error) {
      console.error(error);
      return;
    }
    setOrganizations((prev) => prev?.filter((org) => org.id !== id) ?? null);
  }

  useEffect(() => {
    (async () => {
      const {
        data: {session},
      } = await supabase.auth.getSession();
      if (!session?.user.id) return;

      const {data, error} = await supabase
        .from('memberships')
        .select('tenant:tenants(id, name, owner_id, created_at)')
        .eq('user_id', session.user.id);

      if (error) {
        console.error(error);
        return;
      }

      const tenants = data.map((m) => m.tenant);
      setOrganizations(tenants);
    })();
  }, []);

  return (
    <section className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black flex items-center gap-x-2 underline">
          <LayoutDashboard className="size-8" />
          Account Overview
        </h1>
        <Button asChild>
          <NavLink to="/account/create-organization" viewTransition>
            <Plus className="size-4" />
            New
          </NavLink>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations?.length === 0 ? (
          <p>No organizations found</p>
        ) : (
          organizations?.map((organization) => (
            <Card className="flex flex-col shadow-none">
              <CardHeader>
                <CardTitle>{organization.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex justify-between">
                  <Label>Created on</Label>
                  <span>{new Date(organization.created_at ?? '').toLocaleDateString()}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm" onClick={() => deleteOrganization(organization.id)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <NavLink key={organization.id} to={`/${organization.id}`} viewTransition>
                    <Eye className="size-4" />
                    View
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
