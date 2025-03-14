import { redirect } from 'next/navigation';

export default async function Server() {
  return redirect('/');
}