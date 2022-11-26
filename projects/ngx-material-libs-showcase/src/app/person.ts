export type Gender =
  'Male'
  | 'Female'
  | 'Polygender'
  | 'Genderqueer'
  | 'Bigender'
  | 'Genderfluid'
  | 'Agender'
  | 'Non-binary';

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  idAddress: string;
  job: string;
  birthDate: Date;
}
