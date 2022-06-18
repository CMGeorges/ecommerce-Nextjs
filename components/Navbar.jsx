import React from 'react'
import Link  from 'next/link'
import {AiOutlineShopping} from 'react-icons/ai'
//components
import {Cart} from './'
import { useStateContext } from '../context/StateContext'




const Navbar = () => {
  const {showCart,setShowCart,totalQuantity}= useStateContext();


  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">Tech Store</Link>
      </p>

      <button type="button" className="cart-icon" onClick={()=> setShowCart(true)}>
        <AiOutlineShopping />
       {(totalQuantity  > 0)&& (<span className="cart-item-qty">{totalQuantity}</span>)} 
      </button>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar