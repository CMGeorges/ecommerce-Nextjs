import imageUrlBuilder from '@sanity/image-url';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const builder = projectId ? imageUrlBuilder({projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}) : null;
export const urlFor = (source) => {
  if (source?.url || !builder || !source) {
    const url = source?.url || '/products/demo.svg';
    return {url: () => url, toString: () => url};
  }
  return builder.image(source);
};
