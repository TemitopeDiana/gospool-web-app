import { notFound } from 'next/navigation';

import { getBus } from '@/actions/getBus';
import Breadcrumb from '@/components/bread-crumbs';
import BusProfile from '@/components/busProfile';
import { routes } from '@/lib/routes';

interface PageProps {
  params: {
    busId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { busId } = await params;

  const res = await getBus(busId);

  if (!res.success || !res.data) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: 'Bus', href: routes.bus() }, { label: 'View bus' }]}
      />
      <BusProfile bus={res.data} />
    </div>
  );
}
