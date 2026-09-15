import { getBuses } from '@/actions/getBuses';
import { getChurches } from '@/actions/getChurches';
import Breadcrumb from '@/components/bread-crumbs';
import CreateEvent from '@/components/create-event';
import { routes } from '@/lib/routes';

export default async function CreateEventPage() {
  const [churchesRes, busesRes] = await Promise.all([
    getChurches({ page: 1, limit: 100 }),
    getBuses({ page: 1, limit: 100 }),
  ]);

  const churches = churchesRes.success ? churchesRes.data : [];
  const buses = busesRes.success ? busesRes.data : [];

  return (
    <>
      <Breadcrumb
        items={[
          {
            label: 'Events',
            href: routes.events(),
          },
          { label: 'Create Event' },
        ]}
      />
      <CreateEvent churches={churches} buses={buses} />;
    </>
  );
}
