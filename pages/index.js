import React from 'react'
import { loadCatalog } from '../server/catalog'
import { HeroBanner, Footer, Product, FooterBanner } from '../components'

const Home = ({ products, bannerData, demo }) => {






  return (
    <>
      {demo && <p role="status">Catalogue de démonstration — paiements désactivés. Configurez Sanity et Stripe pour vendre.</p>}
      {bannerData?.length > 0 && <HeroBanner heroBanner={bannerData[0]} />}
      <div className="products-heading">
        <h2>Best Selling</h2>
        <p>Speakers of many variations</p>
      </div>
      {/* products */}
      <div className="products-container">
        {products?.map((product) => <Product key={product._id} product={product} />)}

      </div>

      {/* Footer */}
      {bannerData?.length > 0 && <FooterBanner footerBanner={bannerData[0]} />}
    </>
  )
}

export const getServerSideProps = async () => {
  const { products, bannerData, demo } = await loadCatalog();
  return { props: {products, bannerData, demo} };
};
export default Home;
