'use server';

import { headers } from 'next/headers';

export async function getUrl() {
  const headerList = await headers();
  const hostArr = (headerList.get('x-forwarded-host') || headerList.get('host'))?.split(':');
  const host = (hostArr && hostArr.length > 1) ? hostArr[0] : 'localhost';
  const port = (hostArr && hostArr.length > 1) ? hostArr[1] : '25545';
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const url = `${protocol}://${host}:${port}`
  return url;
}