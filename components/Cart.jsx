import React, { useRef, useState } from "react";
import { useStateContext } from "../context/StateContext";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShopping,
  AiOutlineLeft,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { urlFor } from "../lib/client";

const Cart = () => {
  const cartRef = useRef();
  const {
    cart,
    setCart,
    totalQuantity,
    setTotalQuantity,
    setShowCart,
    cartItems,
    totalPrice,toggleCartItemQuantity,
    onRemove
  } = useStateContext();

  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutKey = useRef(null);
  const handleCheckout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    const items = cartItems.map(({_id, quantity}) => ({_id, quantity}));
    const fingerprint = JSON.stringify(items);
    if (checkoutKey.current?.fingerprint !== fingerprint) {
      checkoutKey.current = {fingerprint, key: crypto.randomUUID()};
    }
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Idempotency-Key': checkoutKey.current.key},
        body: JSON.stringify(items),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout unavailable');
      window.location.assign(data.url);
    } catch (error) {
      toast.error(error.message);
      setCheckingOut(false);
    }
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantity} items)</span>
        </button>
        {cartItems?.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your cart is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                <span>Continue Shopping</span>
              </button>
            </Link>
          </div>
        )}
        <div className="product-container">
          {cartItems?.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                  <img src={urlFor(item?.image[0])} alt={item.name} className='cart-product-image'/>
                  <div className="item-desc">
                    <div className="flex top">
                      <h5>{item.name}</h5>
                      <h4>${item.price}</h4>
                    </div>
                    <div className="flex bottom">
                      <div>
                      <p className="quantity-desc">
                            <span className="minus" onClick={()=> toggleCartItemQuantity(item._id,'dec')}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num"  >
                                {item.quantity}
                            </span>
                            <span className="plus" onClick={()=> toggleCartItemQuantity(item._id,'inc')}>
                                <AiOutlinePlus />
                            </span>
                        </p>

                      </div>
                      <button type='button' className="remove-item" onClick={()=> onRemove(item)}>
                        <TiDeleteOutline />
                      </button>
                    </div>
                  </div>
              </div>
            ))}
        </div>
        {cartItems?.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>SubTotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type='button' className="btn" disabled={checkingOut} onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
