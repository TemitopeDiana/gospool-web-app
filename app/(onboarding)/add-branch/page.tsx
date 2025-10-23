import AddBranch from './add-branch';

export type Branch = {
  name: string;
  location?: string;
};

const branches: Branch[] = [
  {
    name: 'CCI Ikeja',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },
  {
    name: 'CCI Lekki',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },
  {
    name: 'CCI Yaba',
    location:
      'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos',
  },
];

const maxChars = 30;
const loc =
  'Balmoral Convention Center, 30 Mobolaji Bank Anthony Way, Maryland, Ikeja 101233 Lagos';

export default function Page() {
  return <AddBranch branches={branches} maxChars={maxChars} loc={loc} />;
}
