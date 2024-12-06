import React, { useState, useEffect, useContext } from 'react'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Checkbox from '@mui/material/Checkbox'
import emptyCart2 from '../assets/utilities/emptyCart.png'
import useAxios from '../utils/axiosInstance'
import { UserContext } from '../contexts/UserContext'

import img1 from '../assets/images/item6-1.png'
<<<<<<< HEAD
import img2 from '../assets/images/item3-1.png'
import img3 from '../assets/images/item4-1.png'
import { useNavigate } from 'react-router-dom';

import img4 from '../assets/images/item5-1.png'
=======

>>>>>>> 242d37c6310644a2f006471e6a55c95b6e859d70
const Cart = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const { user } = useContext(UserContext)
  const axios = useAxios()

  // Initializing state for cart items
  const [cartItems, setCartItems] = useState([])

  // Dummy cart items data
  const CartItems = [
    {
      prodName: 'Y2K T-SHIRT',
      prodPrice: 10,
      prodQuantity: 1,
      prodImage: img1,
      prodSize: 'XL',
      prodColor: 'Black',
      availableSizes: ['S', 'M', 'L', 'XL'],
      availableColors: ['Black', 'White', 'Red']
    }
  ]

  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/cart/get-cart`)
        setCartItems(response.data.cart.items)
        console.log(response.data.cart.items)
      } catch (err) {
        console.error(err)
      }
    }

    if (user) {
      fetchCartItems()
    } else {
      setCartItems([])
    }
  }, [axios, apiUrl, user])


  // Updating the state with CartItems
  useEffect(() => {
    setCartItems(CartItems)
  }, [])

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const updatedCartItems = [...cartItems]
    updatedCartItems[index].prodQuantity = value
    setCartItems(updatedCartItems)
  }

  // Handle size change
  const handleSizeChange = (index, value) => {
    const updatedCartItems = [...cartItems]
    updatedCartItems[index].prodSize = value
    setCartItems(updatedCartItems)
  }

  // Handle color change
  const handleColorChange = (index, value) => {
    const updatedCartItems = [...cartItems]
    updatedCartItems[index].prodColor = value
    setCartItems(updatedCartItems)
  }

  // Calculate total price of cart
  const calculateTotalPrice = () => {
    return cartItems?.reduce(
      (total, item) => total + item.prodPrice * item.prodQuantity,
      0
    )
  }

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    navigate('/cart/checkout'); // Navigate to the room management page
  };

  return (
    <div className='p-10 border w-full h-full'>
      <h1 className='text-[30px] font-semibold mb-5'>
        SHOPPING CART <ShoppingCartOutlinedIcon />
      </h1>

      {/* Conditional rendering based on cartItems length */}
      {!cartItems ? (
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className='md:text-[30px] text-[20px] font-semibold'>Your cart is empty</h1>
          <img src={emptyCart2} alt='Empty Cart' className='w-1/2' />
        </div>
      ) : (
        <div className='flex gap-2'>
          <table className='border w-2/3'>
            <thead>
              <tr className='border'>
                <td className='p-3'>
                  <Checkbox defaultChecked color='default' /> Products
                </td>
                <td>Variations</td>
                <td>Quantity</td>
                <td>Total Price</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {cartItems?.map((item, index) => (
                <tr key={index} className='border'>
                  <td className='p-3 flex gap-1'>
                    <div className='h-[140px] flex justify-center items-center'>
                      <Checkbox defaultChecked color='default' />
                    </div>
                    <div className='w-[140px] h-[140px] border'>
                      <img
                        src={item.prodImage}
                        alt={item.prodName}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div className='ml-3'>
                      <p className='text-[18px] font-bold'>{item.prodName}</p>
                    </div>
                  </td>
                  <td>
                    {/* Size Selector */}
                    <select
                      value={item.prodSize}
                      onChange={e => handleSizeChange(index, e.target.value)}
                      className='p-2 border rounded'
                    >
                      {item.availableSizes?.map((size, i) => (
                        <option key={i} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <br />
                    {/* Color Selector */}
                    <select
                      value={item.prodColor}
                      onChange={e => handleColorChange(index, e.target.value)}
                      className='p-2 border rounded mt-2'
                    >
                      {item.availableColors?.map((color, i) => (
                        <option key={i} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>${item.prodPrice}</td>
                  <td>
                    {/* Quantity Picker */}
                    <input
                      type='number'
                      value={item.prodQuantity}
                      min='1'
                      className='w-[50px] p-2 border rounded'
                      onChange={e =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <button className='text-red-500'>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ORDER DETAILS */}
          <div className='border p-5 w-1/3 flex flex-col h-fit'>
            <h2 className='font-semibold text-[25px]'>Order Details</h2>

            <div className='border-b pb-3 w-full h-fit'>
              <div>
                <p className='flex justify-between items-center'>
                  <span>Total Products Value:</span>{' '}
                  <span>${calculateTotalPrice()}</span>
                </p>
              </div>
              <div>
                <p className='flex justify-between items-center'>
                  <span>Discount:</span>{' '}
                  <span className='text-red-500'>-2$</span>
                </p>
              </div>
              <div>
                <p className='flex justify-between items-center'>
                  <span>Shipping:</span> <span>2$</span>
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='flex justify-between items-center text-[25px]'>
                <span>
                  <strong>Total:</strong>
                </span>{' '}
                <span>
                  <strong>${calculateTotalPrice() - 2 + 2}</strong>
                </span>
              </p>
            </div>

            <button className='p-3 mt-2 rounded-sm hover:bg-white hover:text-black border-2 text-[15px] transition-all duration-200 font-semibold border-black bg-black text-white' onClick={handleCheckoutClick}>
              CHECK OUT ({cartItems.length})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
