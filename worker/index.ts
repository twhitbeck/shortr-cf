import generateRandomSlug from "./generate-random-slug";

const handler: ExportedHandler<{ URLS: KVNamespace }> = {
  fetch(request, { URLS }, ctx) {
    const slug = generateRandomSlug();

    return new Response(slug);
  },
};

export default handler;
