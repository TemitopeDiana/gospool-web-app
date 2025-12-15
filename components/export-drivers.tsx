'use client';

import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Driver } from '@/types/driver.type';
import { DATE_FORMAT_DMY } from '@/lib/constants';

const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const escapeCsvCell = (v: unknown) => {
  const s = v == null ? '' : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const getDriversDataForExport = (drivers: Driver[], status: string) => {
  const driverStatus = status;
  return drivers.map((d) => {
    const date =
      driverStatus === 'pending'
        ? ' '
        : d.driverVerifiedAt
          ? dayjs(d.driverVerifiedAt).format(DATE_FORMAT_DMY)
          : '';
    const name = `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim();
    const church = d.churchName ?? '';
    const branch = d.branchName ?? '';
    const department = d.departmentName ?? d.department?.name ?? '';
    const status = d.driverVerificationStatus ?? d.statusDisplay ?? '';

    return [date, name, church, branch, department, status];
  });
};

export const buildDriversCsv = (drivers: Driver[], status: string) => {
  if (!drivers || drivers.length === 0) return '';

  const firstHeader = status === 'pending' ? 'Date requested' : 'Date joined';
  const headers = [
    firstHeader,
    'Name',
    'Church Name',
    'Branch Name',
    'Department',
    'Status',
  ];

  const rows = getDriversDataForExport(drivers, status);

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.map(escapeCsvCell).join(',')),
  ].join('\r\n');

  return '\uFEFF' + csvContent;
};

export const exportDriversCsv = (drivers: Driver[], status: string) => {
  const csv = buildDriversCsv(drivers, status);
  if (!csv) return;

  const filename = `drivers-${dayjs().format('YYYYMMDD-HHmm')}.csv`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(filename, blob);
};

export const exportDriversPdf = (drivers: Driver[], status: string) => {
  if (!drivers || drivers.length === 0) {
    return;
  }

  const doc = new jsPDF({ unit: 'pt' });

  const firstCol = status === 'pending' ? 'Date requested' : 'Date joined';
  const cols = [
    firstCol,
    'Name',
    'Church Name',
    'Branch Name',
    'Department',
    'Status',
  ];

  const body = getDriversDataForExport(drivers, status);

  autoTable(doc, {
    head: [cols],
    body,
    styles: { fontSize: 11 },
    margin: { left: 20, right: 20, top: 30 },
  });

  doc.save(`drivers-${dayjs().format('YYYYMMDD-HHmm')}.pdf`);
};
