/// <reference types="@cloudflare/workers-types" />

import generateRandomSlug from "./utils/generate-random-slug";

export const onRequestPost: PagesFunction<{ URLS: KVNamespace }> = async ({
  request,
  env: { URLS },
}) => {
  const url = await request.text();

  try {
    new URL(url);
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  const slug = await (async () => {
    const existingSlug = await URLS.get(url);

    if (existingSlug) {
      return existingSlug;
    }

    const newSlug = generateRandomSlug();

    await Promise.all([URLS.put(url, newSlug), URLS.put(newSlug, url)]);

    return newSlug;
  })();

  return new Response(slug);
};

const handler: ExportedHandler<{ URLS: KVNamespace }> = {
  async fetch(request, { URLS }, ctx) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === "/create") {
      const headers = {
        "access-control-allow-origin": "https://shortr-cf.pages.dev",
      };

      if (request.method !== "POST") {
        return new Response(null, { status: 405, headers });
      }

      const body = await request.text();

      if (!body) {
        return new Response(null, { status: 400, headers });
      }

      try {
        new URL(body);
      } catch (error) {
        return new Response(null, { status: 400, headers });
      }

      const existingSlug = await URLS.get(body);

      if (existingSlug) {
        return new Response(existingSlug, { headers });
      }

      const slug = generateRandomSlug();

      await Promise.all([URLS.put(body, slug), URLS.put(slug, body)]);

      return new Response(slug, { headers });
    }

    const slugMatch = /^\/([^/]+)$/.exec(requestUrl.pathname);

    if (!slugMatch) {
      return new Response(null, { status: 404 });
    }

    const [, slug] = slugMatch;

    const url = await URLS.get(slug);

    if (!url) {
      return new Response(null, { status: 404 });
    }

    return new Response(null, {
      status: 302,
      headers: {
        location: url,
      },
    });
  },
};

export default handler;
