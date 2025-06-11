import {useState} from 'react';

import supabase from '../../utils/supabase';

export function OrganizationCreate() {
  const [tenantName, setTenantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <section>
      <h1>Create Tenant Page</h1>
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="tenant-name">Tenant Name</label>
          <input
            type="text"
            id="tenant-name"
            name="tenant-name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
          />
        </fieldset>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Tenant'}
        </button>
      </form>
    </section>
  );
}
