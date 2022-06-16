import React,{useState,useEffect,useContext, createContext} from 'react';
import {toast} from 'react-hot-toast';

const Context = createContext();


export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let foundIndex;
//functions
    const onAdd = (product,quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id);
        
        setTotalPrice((prevTotalPrice)=>prevTotalPrice + product.price * quantity);
        setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities + quantity);
    
        if(checkProductInCart){
            const updatedCartItems = cartItems?.map((cartProduct) => {
                if(cartProduct._id === product._id){
                    return {...cartProduct, quantity: cartProduct.quantity + quantity}
                }
                return cartProduct;
            })

            setCartItems(updatedCartItems);
        }else{
            product.quantity = quantity;
            setCartItems([...cartItems, {...product}]);
        }
        toast.success(`${qty} ${product.name} added to cart.`);
            setQty(1);
    }
    const toggleCartItemQuantity =(id,value)=>{
       
            foundProduct = cartItems.find((item) => item._id === id);
            foundIndex = cartItems.findIndex((item) => item._id === id);

            

            if(value === 'inc'){
                foundProduct.quantity += 1;
                const updatedCartItems = cartItems.find((item) => {
                    if(item._id === id){
                        return {...item, quantity: foundProduct.quantity}
                    }
                });
                setCartItems([...cartItems.slice(0,foundIndex),updatedCartItems,...cartItems.slice(foundIndex+1)]);
                // setCartItems([...updatedCartItems, ...cartItems.slice(0,foundIndex), ...cartItems.slice(foundIndex+1)]);
                setTotalPrice((prevTotalPrice)=>prevTotalPrice + foundProduct.price);
                setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities + 1);
            }else if(value === 'dec'){
                foundProduct.quantity -= 1;
                const updatedCartItems = cartItems.find((item) => {
                    if(item._id === id){
                        return {...item, quantity: foundProduct.quantity}
                    }})
                if(foundProduct.quantity > 1)
                    setCartItems([...cartItems.slice(0,foundIndex),updatedCartItems,...cartItems.slice(foundIndex+1)]);
                setTotalPrice((prevTotalPrice)=>prevTotalPrice - foundProduct.price);
                setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities - 1);
            }
    }
    const onRemove = (product) => {
        const foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== foundProduct._id);
        setCartItems([...newCartItems]);
        setTotalPrice((prevTotalPrice)=>prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities - foundProduct.quantity);
        toast.error(`${foundProduct.name} removed from cart.`);

    }
    
    const incQty=()=>{
        setQty((prev)=>prev+1);
    }
    const decQty=()=>{
        setQty((prev)=>{
            if(prev - 1 < 1) return 1;
            return prev-1;
        });
    }
    

    return(
        <Context.Provider value={{
            showCart,
            setShowCart,
            cartItems,
            setCartItems,
            totalPrice,
            setTotalPrice,
            totalQuantity,
            setTotalQuantity,
            qty,
            setQty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);