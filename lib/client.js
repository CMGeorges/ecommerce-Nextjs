import  sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
    dataset: 'production',
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    apiVersion: 'v1',
    useCdn: true,
    ignoreBrowserTokenWarning: true
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);