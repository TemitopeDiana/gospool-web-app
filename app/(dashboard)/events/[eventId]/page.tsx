import { getBuses } from '@/actions/getBuses';
import { getChurches } from '@/actions/getChurches';
import Breadcrumb from '@/components/bread-crumbs';
import EventProfile from '@/components/event-profile';
import { routes } from '@/lib/routes';

interface PageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: PageProps) {
  const { eventId } = await params;

  const [churchesRes, busesRes] = await Promise.all([
    getChurches({ page: 1, limit: 100 }),
    getBuses({ page: 1, limit: 100 }),
  ]);

  const churches = churchesRes.success ? churchesRes.data : [];
  const buses = busesRes.success ? busesRes.data : [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Events', href: routes.events() },
          { label: 'View Event' },
        ]}
      />
      <EventProfile churches={churches} buses={buses} />
    </div>
  );
}
