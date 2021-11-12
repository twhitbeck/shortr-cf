import generateRandomSlug from "./generate-random-slug";

const handler: ExportedHandler<{ URLS: KVNamespace }> = {
  async fetch(request, { URLS }, ctx) {
    if (request.method !== "POST") {
      return new Response(null, { status: 405 });
    }

    const body = await request.text();

    if (!body) {
      return new Response(null, { status: 400 });
    }

    try {
      new URL(body);
    } catch (error) {
      return new Response(null, { status: 400 });
    }

    const existingSlug = await URLS.get(body);

    if (existingSlug) {
      return new Response(existingSlug);
    }

    const slug = generateRandomSlug();

    await URLS.put(body, slug);

    return new Response(slug);
  },
};

export default handler;
