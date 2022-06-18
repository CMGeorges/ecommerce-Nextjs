import React from 'react'
import { client } from '../lib/client'
import { HeroBanner, Footer, Product, FooterBanner } from '../components'

const Home = ({ products, bannerData }) => {






  return (
    <>
      <HeroBanner heroBanner={bannerData?.length && bannerData[0]} />
      <div className="products-heading">
        <h2>Best Selling</h2>
        <p>Speakers of many variations</p>
      </div>
      {/* products */}
      <div className="products-container">
        {products?.map((product) => <Product key={product._id} product={product} />)}

      </div>

      {/* Footer */}
      <FooterBanner  footerBanner={bannerData && bannerData[0]} />
    </>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const queryBanner = '*[_type == "banner"]';
  const bannerData = await client.fetch(queryBanner);

  return {
    props: {
      products,
      bannerData
    }
  }
}
export default Home