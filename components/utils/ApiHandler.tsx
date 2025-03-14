export type DbResponse = {
  status: string,
  msg: string,
};

export async function getData(endpoint: string) {
  const base = 'http://localhost:25545/';
  const url = base + endpoint;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error(`${res.status} returned from ${url}`);
  }

  return await res.json();
}

export async function postData(endpoint: string, body: FormData | Object | string) {
  const base = 'http://localhost:25545/';
  const url = base + endpoint;

  const res = await fetch(url, {
    method: 'POST',
    body: (body instanceof FormData) ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`${res.status} returned from ${url}`);
  }

  return await res.json();
}

export async function deleteData(endpoint: string) {
  const base = 'http://localhost:25545/';
  const url = base + endpoint;

  const res = await fetch(url, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`${res.status} returned from ${url}`);
  }

  return await res.json();
}