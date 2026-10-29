import { useQuery } from '@tanstack/react-query';
import { orpc } from '../lib/api';

export function useElection() {
  return useQuery(orpc.election.list.queryOptions({ staleTime: Infinity }));
}