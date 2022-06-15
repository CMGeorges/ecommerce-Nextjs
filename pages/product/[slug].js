import React from 'react'
import {client, urlFor} from '../../lib/client'
import {AiOutlineMinus,AiOutlinePlus, AiFillStar,AiOutlineStar} from 'react-icons/ai';
import { Product } from '../../components';



const ProductDetails = ({product,products}) => {
const {image,details,price,name}    = product;


  return (
    <div>
        <div className="product-detail-container">
            {/* <div> */}
                <div className="image-container">
                    <img src={urlFor(image && image[0])} alt={name} />
                    {/* <div className="small-images-container">
                        {image && image?.map((image,index) => {
                            return <img key={index} src={urlFor(image)} alt={name} />
                                
                        })}
                    </div> */}
                </div>
                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar/>
                        </div>
                        <p>(20)</p>

                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick="">
                                <AiOutlineMinus />
                            </span>
                            <span className="num" onClick="">
                                0
                            </span>
                            <span className="plus" onClick="">
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button type="button"  className="add-to-cart" onClick="">
                            Add to Cart
                        </button>
                        <button type="button"  className="buy-now" onClick="">
                            Buy Now
                        </button>
                    </div>
                </div>
            {/* </div> */}
        </div>
        <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
            <div className="marquee">
                <div className="maylike-products-container">
                    {products?.map((product,index) => (
                        <Product key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export const getStaticProps = async ({params:{slug}}) => {
    const query = `*[_type == "product" && slug.current == "${slug}"][0]`;
   
    const productQuery = `*[_type == "product"]`;
    const product = await client.fetch(query);
    const products = await client.fetch(productQuery);
  
    return {
      props: {
        products,
        product
      }
    }
  }

  export const getStaticPaths = async () => {
      const query = `*[_type == "product"]{
          slug {
                current
          }
      }`;
      const products = await client.fetch(query);
        const paths = products.map(product => ({
            params: {
                slug: product.slug.current
            }
        }))
        return {
            paths,
            fallback: 'blocking'
        }
    }
  


export default ProductDetails