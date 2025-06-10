import {createContext} from 'react';

import {Tables} from '@crackedmetrics/types';

export type TenantContextType = Tables<'tenants'> | null;

export const TenantContext = createContext<TenantContextType>(null);
