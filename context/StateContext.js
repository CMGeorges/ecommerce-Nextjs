import {useState, useEffect, useContext, createContext} from 'react';
import {toast} from 'react-hot-toast';
import {changeQuantity, totals} from '../server/cart';
const Context = createContext();
const STORAGE_KEY = 'tech-store-cart-v1';
export const StateContext = ({children}) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  const {totalPrice, totalQuantity} = totals(cartItems);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setCartItems(saved.filter(item => item && typeof item._id === 'string'
        && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99
        && Number.isFinite(item.price) && item.price > 0 && Array.isArray(item.image)));
    } catch { /* Invalid or unavailable storage: use an empty cart. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems)); } catch { /* Storage optional. */ }
    }
  }, [loaded, cartItems]);
  function onAdd(product, quantity) {
    setCartItems(items => items.some(item => item._id === product._id)
      ? changeQuantity(items, product._id, quantity)
      : [...items, {...product, quantity: Math.min(99, quantity)}]);
    toast.success(`${quantity} ${product.name} added to cart.`);
    setQty(1);
  }
  function onRemove(product) {
    setCartItems(items => items.filter(item => item._id !== product._id));
    toast.success(`${product.name} removed from cart.`);
  }
  return <Context.Provider value={{showCart, setShowCart, cartItems, setCartItems,
    totalPrice, totalQuantity, loaded, qty, setQty, onAdd, onRemove,
    toggleCartItemQuantity: (id, value) => setCartItems(items => changeQuantity(items, id, value === 'inc' ? 1 : -1)),
    incQty: () => setQty(value => Math.min(99, value + 1)),
    decQty: () => setQty(value => Math.max(1, value - 1))}}>{children}</Context.Provider>;
};
export const useStateContext = () => useContext(Context);
