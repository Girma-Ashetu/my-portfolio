// A failed inbox request must not hide successfully loaded projects (or vice versa).
export async function loadStudioSections(request) {
  const readList = async path => {
    const data = await request(path);
    if (!Array.isArray(data)) throw new Error('The server returned an invalid list. Retry after checking the API connection.');
    return data;
  };
  const results = await Promise.allSettled([
    readList('/api/projects'),
    readList('/api/admin/messages'),
  ]);
  return Object.fromEntries(['projects', 'messages'].map((key, index) => [key,
    results[index].status === 'fulfilled'
      ? { data: results[index].value, error: null }
      : { data: null, error: results[index].reason?.message || 'This section could not be loaded.' },
  ]));
}
