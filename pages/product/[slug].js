import React, { useState } from 'react'
import { urlFor } from '../../lib/client'
import { loadCatalog } from '../../server/catalog'
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';



const ProductDetails = ({ product, products }) => {
    const { image, details, price, name } = product;
    const [index, setIndex] = useState(0);
    const {incQty,decQty,qty,onAdd,setShowCart} = useStateContext();
    //function
    const handleBuyNow = () => {
        onAdd(product, qty);
            setShowCart(true);
        }
        
    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <img src={urlFor(image && image[index])} alt={name} className="product-detail-image" />

                    </div>
                    <div className="small-images-container">
                        {image && image?.map((item, i) => (
                            <img key={i} src={urlFor(item)} alt={name} className={i === index ? 'small-image selected-image' : 'small-image'} onMouseEnter={() => setIndex(i)} />
                        ))}
                    </div>
                </div>
                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>(20)</p>

                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num" >
                                {qty}
                            </span>
                            <span className="plus" onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button type="button" className="add-to-cart" onClick={ () => onAdd(product,qty)}>
                            Add to Cart
                        </button>
                        <button type="button" className="buy-now" onClick={handleBuyNow}>
                            Buy Now
                        </button>
                    </div>
                </div>

            </div>
            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container">
                        {products && products?.map((item) => (
                            <Product key={item?._id} product={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ params }) => {
    const { products } = await loadCatalog();
    const product = products.find(item => item.slug?.current === params.slug);
    if (!product) return {notFound: true};
    return {props: {products, product}};
};
export default ProductDetails;
