import generateRandomSlug from "./generate-random-slug";

const handler: ExportedHandler = {
  fetch(request, env, ctx) {
    const slug = generateRandomSlug();

    return new Response(slug);
  },
};

export default handler;
