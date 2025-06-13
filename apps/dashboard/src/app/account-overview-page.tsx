import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function AccountOverviewPage() {
  const [organizations, setOrganizations] = useState<Tables<'tenants'>[] | null>(null);
  const [tenantName, setTenantName] = useState('');

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {
      data: {session},
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(sessionError);
      return;
    }
    const userId = session?.user.id;
    if (!userId) {
      console.error('User not found');
      return;
    }
    const {data: newTenant, error: tenantError} = await supabase
      .from('tenants')
      .insert({name: tenantName, owner_id: userId})
      .select('id')
      .single();
    if (tenantError) {
      console.error(tenantError);
      return;
    }
    if (!newTenant) {
      console.error('Tenant not found');
      return;
    }
    const {error: membershipError} = await supabase.from('memberships').insert({
      tenant_id: newTenant.id,
      user_id: userId,
      role: 'admin',
    });
    if (membershipError) {
      console.error(membershipError);
      return;
    }
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1>Account Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Organizations</h2>
        <Button asChild>
          <NavLink to="/account/create-organization">Create Organization</NavLink>
        </Button>
      </div>
      <div className="flex gap-4 ">
        {organizations?.length === 0 ? (
          <p>No organizations found</p>
        ) : (
          organizations?.map((organization) => (
            <Card className="flex flex-col w-sm shadow-none">
              <CardHeader>
                <CardTitle>{organization.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span>Created:</span> {new Date(organization.created_at ?? '').toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="secondary" asChild>
                  <NavLink key={organization.id} to={`/${organization.id}`}>
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
