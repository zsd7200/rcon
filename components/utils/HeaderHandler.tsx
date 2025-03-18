'use server';

import { headers } from 'next/headers';

export async function getUrl() {
  const headerList = await headers();
  const host = (headerList.get('x-forwarded-host') || headerList.get('host'))?.split(':')[0];
  const port = '25545';
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const url = `${protocol}://${host}:${port}`
  return url;
}