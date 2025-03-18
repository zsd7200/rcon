export type DbResponse = {
  status: string,
  msg: string,
};

export async function getData(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });

  if (!res.ok) {
    console.error(`${res.status} returned from ${url}`);
    throw new Error(JSON.stringify(await res.json()));
  }

  return await res.json();
}

export async function postData(url: string, body: FormData | object | string) {
  const res = await fetch(url, {
    method: 'POST',
    body: (body instanceof FormData) ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`${res.status} returned from ${url}`);
    throw new Error(JSON.stringify(await res.json()));
  }

  return await res.json();
}

export async function deleteData(url: string) {
  const res = await fetch(url, {
    method: 'DELETE',
  });

  if (!res.ok) {
    console.error(`${res.status} returned from ${url}`);
    throw new Error(JSON.stringify(await res.json()));
  }

  return await res.json();
}