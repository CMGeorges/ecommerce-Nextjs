import  sanityCLient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectID = process.env.SANITY_PROJECT_ID;
export const client = sanityCLient({
    projectId: 'nnzie5gk',
    dataset: 'production',
    token: process.env.SANITY_TOKEN,
    apiVersion: 'v1',
    useCdn: true
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);