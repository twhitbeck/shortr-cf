/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction<{ URLS: KVNamespace }, "slug"> = async ({
  params: { slug },
  env: { URLS },
}) => {
  const url = await URLS.get(slug as string);

  if (!url) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: url,
    },
  });
};
