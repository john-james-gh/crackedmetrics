import {Plus} from 'lucide-react';
import {useState} from 'react';
import {useNavigate} from 'react-router';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function AccountCreateOrganizationPage() {
  const [tenantName, setTenantName] = useState('');
  const navigate = useNavigate();
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
    navigate(`/${newTenant.id}`);
  }

  return (
    <div className="flex justify-center">
      <Card className="flex flex-col w-xl shadow-none">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>Organizations are used to group projects and users.</CardDescription>
        </CardHeader>
        <hr />
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-rows-[1fr_auto] gap-y-6 h-full">
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
            <div className="w-full flex justify-end">
              <Button type="submit">
                <Plus className="w-4 h-4" />
                Create Organization
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
