'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import SvgIcon from './svg-icon';
import ShowView from './show-view';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav
      className={`flex items-center text-sm mb-5 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            <ShowView when={isLast || !item.href}>
              <span className="text-primary-500 font-medium">{item.label}</span>
            </ShowView>

            <ShowView when={!isLast}>
              <Link
                href={item.href as string}
                className="hover:underline text-gray-500 font-medium"
              >
                {item.label}
              </Link>
            </ShowView>

            <ShowView when={!isLast}>
              <SvgIcon name="arrow-right" className="mx-1  w-4 h-4" />
            </ShowView>
          </Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
