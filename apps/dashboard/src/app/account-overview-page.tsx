import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function AccountOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Tables<'tenants'>[] | null>(null);
  const [tenantName, setTenantName] = useState('');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const {
      data: {session},
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(sessionError);
      setIsLoading(false);
      return;
    }
    const userId = session?.user.id;
    if (!userId) {
      console.error('User not found');
      setIsLoading(false);
      return;
    }
    const {data: newTenant, error: tenantError} = await supabase
      .from('tenants')
      .insert({name: tenantName, owner_id: userId})
      .select('id')
      .single();
    if (tenantError) {
      console.error(tenantError);
      setIsLoading(false);
      return;
    }
    if (!newTenant) {
      console.error('Tenant not found');
      setIsLoading(false);
      return;
    }
    const {error: membershipError} = await supabase.from('memberships').insert({
      tenant_id: newTenant.id,
      user_id: userId,
      role: 'admin',
    });
    if (membershipError) {
      console.error(membershipError);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  return (
    <section className="flex flex-col gap-y-6">
      <h1>Account Overview</h1>
      <hr />
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Organizations</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Organization</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
              <label htmlFor="tenant-name">Organization Name</label>
              <Input
                id="tenant-name"
                name="tenant-name"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading && <p>Loading...</p>}
      {organizations?.length === 0 ? (
        <p>No organizations found</p>
      ) : (
        <ul>
          {organizations?.map((organization) => (
            <li key={organization.id}>
              <NavLink to={`/${organization.id}`}>{organization.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
