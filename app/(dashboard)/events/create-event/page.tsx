import { getBuses } from '@/actions/getBuses';
import { getChurches } from '@/actions/getChurches';
import CreateEvent from '@/components/create-event';

export default async function CreateEventPage() {
  const [churchesRes, busesRes] = await Promise.all([
    getChurches({ page: 1, limit: 100 }),
    getBuses({ page: 1, limit: 100 }),
  ]);

  const churches = churchesRes.success ? churchesRes.data : [];
  const buses = busesRes.success ? busesRes.data : [];

  return <CreateEvent churches={churches} buses={buses} />;
}
