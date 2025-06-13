import {CheckCircle, Eye, Plus, Trash2, XCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router';

import type {Tables} from '@crackedmetrics/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@crackedmetrics/ui';

import supabase from '../utils/supabase';

export function OrganizationMembersPage() {
  const {organizationId} = useParams();
  const [members, setMembers] = useState<Tables<'memberships'>[]>([]);

  useEffect(() => {
    if (!organizationId) {
      return;
    }
    (async () => {
      const {data, error} = await supabase.from('memberships').select('*').eq('tenant_id', organizationId);
      if (error) {
        console.error(error);
        return;
      }
      setMembers(data);
    })();
  }, [organizationId]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black underline">Members</h1>
        <Button asChild>
          <NavLink to={`/${organizationId}/create-member`}>
            <Plus className="size-4" />
            Create Member
          </NavLink>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!members || !members.length ? (
          <div>No members found</div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="flex flex-col shadow-none">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{member.user_id}</CardTitle>
                <CardDescription>
                  <Badge
                    variant={member.role === 'admin' ? 'default' : 'secondary'}
                    className="uppercase text-xs"
                  >
                    {member.role === 'admin' ? (
                      <CheckCircle className="size-3" />
                    ) : (
                      <XCircle className="size-3" />
                    )}
                    {member.role}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex justify-between">
                  <span>Joined on:</span> {new Date(member.joined_at ?? '').toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Remove
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <NavLink to={`/${organizationId}/${member.id}`}>
                    <Eye className="size-4" />
                    View
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
