import {useEffect, useState} from 'react';
import {NavLink} from 'react-router';

import {Tables} from '@crackedmetrics/types';
import {
  Button,
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Organization</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[1000px]! h-[700px]! flex flex-col gap-y-6">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                This is your organization within Cracked Metrics. For example, you can use the name of your
                company or department.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid grid-rows-[1fr_auto] gap-y-6 h-full grow-1">
              <fieldset className="grid grid-cols-[1fr_2fr] gap-x-2 items-center self-start">
                <Label htmlFor="tenant-name">Organization Name</Label>
                <Input
                  id="tenant-name"
                  name="tenant-name"
                  value={tenantName}
                  placeholder="My Organization"
                  onChange={(e) => setTenantName(e.target.value)}
                />
              </fieldset>
              <hr />
              <div className="flex flex-row justify-between">
                <DialogClose asChild>
                  <Button variant="outline" className="w-1/4 self-end">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-1/4 self-end">
                  Create Organization
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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
