import { routes } from '@/lib/routes';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect(routes.churches());
}
