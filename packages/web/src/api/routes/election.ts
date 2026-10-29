import { base } from '../__core/app';
import { electionData } from '../data/elections';

export const election = {
  list: base.handler(() => electionData),
};