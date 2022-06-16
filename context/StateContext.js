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

    }
    const toggleCartItemQuantity =(id,value)=>{
       
            foundProduct = cartItems.find((item) => item._id === id);
            foundIndex = cartItems.findIndex((item) => item._id === id);

            const updatedCartItems = cartItems.filter((item) => item._id !== id);

            if(value === 'inc'){
                setCartItems([...updatedCartItems,{...foundProduct, quantity: foundProduct.quantity + 1}]);
                setTotalPrice((prevTotalPrice)=>prevTotalPrice + foundProduct.price);
                setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities + 1);
            }else if(value === 'dec'){
                if(foundProduct.quantity > 1)
                    setCartItems([...updatedCartItems,{...foundProduct, quantity: foundProduct.quantity - 1}]);
                setTotalPrice((prevTotalPrice)=>prevTotalPrice - foundProduct.price);
                setTotalQuantity((prevTotalQuantities)=>prevTotalQuantities - 1);
            }
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
            toggleCartItemQuantity
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);