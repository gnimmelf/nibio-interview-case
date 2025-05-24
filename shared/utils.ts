export const getValidUrl = (host: string, port: number | string) => {
  const cleanHost = host.replace(/\/+$/, ''); // Remove trailing slashes
  const url = new URL(`${cleanHost}:${port}`);
  return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
};