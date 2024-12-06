import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
  Person2Outlined,
  LogoutOutlined,
  ShoppingBagOutlined,
  EditOutlined,
  AddOutlined,
  DeleteOutlined
} from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Divider,
  Radio,
  FormControlLabel
} from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup'

import { useNavigate } from 'react-router-dom'
import { getProvinces, getDistricts, getWards } from '../utils/addressService'
import useAxios from '../utils/axiosInstance'
import { toast } from 'react-toastify'
import { UserContext } from '../contexts/UserContext'

const StyledFormControlLabel = styled(props => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    variants: [
      {
        props: { checked: true },
        style: {
          '.MuiFormControlLabel-label': {
            color: theme.palette.primary.main
          }
        }
      }
    ]
  })
)

function MyFormControlLabel (props) {
  const radioGroup = useRadioGroup()

  let checked = false

  if (radioGroup) {
    checked = radioGroup.value === props.value
  }

  return <StyledFormControlLabel checked={checked} {...props} />
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any
}

function Checkout () {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const axios = useAxios()
  const { user } = useContext(UserContext)

  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editedUser, setEditedUser] = useState({})
  const [addresses, setAddresses] = useState([])
  const [currentAddresses, setCurrentAddresses] = useState([])
  const [chosenAddress, setChosenAddress] = useState(null) // State for the selected address
  const [tempAddress, setTempAddress] = useState(null) // State for the selected address

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentAddressId, setCurrentAddressId] = useState(null)

  // Address Fields
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [street, setStreet] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [receiverPhone, setReceiverPhone] = useState(user?.phone || '')

  const [error, setError] = useState('')

  // Fetch user profile and addresses on load
  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/user/addresses`
      )
      setAddresses(response.data.data)
      setChosenAddress(response.data.data[0])
      setTempAddress(response.data.data[0])

    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred')
    }
  }, [axios])

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces()
      setProvinces(data)
    }
    fetchProvinces()
  }, [])

  const handleEditClick = () => setIsEditing(true)

  const handleCancelEdit = () => {
    setEditedUser(user)
    closeModal()
  }

  const handleAddingState = () => {
    setIsAdding(!isAdding)
  }

  const handleEdtitingState = () => {
    setIsAdding(!isAdding)
    setIsEditing(!isEditing)
    setIsEditMode(!isEditMode)
  }
  const handleAddressSave = async () => {
    try {
      if (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedWard ||
        !street ||
        !receiverName ||
        !receiverPhone
      ) {
        toast.error('Please fill in all required fields')
        return
      }

      if (isEditMode && currentAddressId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}api/user/updateAddress/${currentAddressId}`,
          {
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard,
            street,
            receiverName,
            receiverPhone
          }
        )
        toast.success('Address updated successfully')
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/addAddress`,
          {
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard,
            street,
            receiverName,
            receiverPhone
          }
        )
        toast.success('Address added successfully')
      }
      handleAddingState()
      fetchAddresses()
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred')
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  const handleDeleteAddress = async addressId => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}api/user/deleteAddress/${addressId}`
      )
      toast.success('Address deleted successfully')
      fetchAddresses()
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred')
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  const openModalForEdit = address => {
    setIsEditMode(true)
    setCurrentAddressId(address._id)
    setReceiverName(address.receiverName)
    setReceiverPhone(address.receiverPhone)
    setSelectedProvince(address.province)
    setSelectedDistrict(address.district)
    setSelectedWard(address.ward)
    setStreet(address.street)
    setIsModalOpen(true)
  }

  const openModalForNew = () => {
    setIsEditMode(false)
    setReceiverName('')
    setReceiverPhone(user?.phone || '')
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setStreet('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentAddressId(null)
    setReceiverName('')
    setReceiverPhone(user?.phone || '')
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setStreet('')
  }

  // Handle chosen address

  const handleAddressSelect = event => {
    const selectedId = event.target.value
    const address = addresses.find(addr => addr._id === selectedId)
    setTempAddress(address)
  }

  const handleSaveChanges = () => {
    if (chosenAddress) {
      setChosenAddress(tempAddress)
      toast.success('Address updated successfully!')
      setIsModalOpen(false)
    } else {
      toast.error('Please select an address.')
    }
  }

  console.log('This is chosen address: ', chosenAddress)
  console.log('This is addresses : ', addresses)

  return (
    <div class='flex justify-center items-center min-h-screen'>
      <div class='bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl'>
        <h1 class='text-2xl font-bold mb-6'>CHECK OUT</h1>
        <div class='flex flex-col md:flex-row gap-6'>
          <div class='flex-1'>
            <div class='border p-6 rounded-lg mb-6'>
              <h2 class='text-lg font-semibold mb-4'>Delivery address</h2>
              {addresses.length === 0 ? (
                <button
                  onClick={openModalForNew}
                  className='flex items-center bg-black text-white px-4 py-2 rounded hover:bg-white border border-black hover:text-black transition-all duration-300'
                >
                  <AddOutlined className='mr-2' />
                  Add New Address
                </button>
              ) : chosenAddress ? (
                <div className='border p-4 mb-2 rounded relative'>
                  <p>
                    <strong>Address:</strong> {chosenAddress.street},{' '}
                    {chosenAddress.ward},{chosenAddress.district},{' '}
                    {chosenAddress.province}
                  </p>
                  <p>
                    <strong>Receiver Name:</strong> {chosenAddress.receiverName}
                  </p>
                  <p className='w-full flex justify-between'>
                    <div>
                      <strong>Receiver Phone:</strong>{' '}
                      {chosenAddress.receiverPhone}
                    </div>
                    <a
                      className='underline cursor-pointer'
                      onClick={openModalForNew}
                    >
                      change
                    </a>
                  </p>
                </div>
              ) : null}

              {/* <div class='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label class='block text-sm font-medium mb-1'>
                    First name
                  </label>
                  <input
                    type='text'
                    class='w-full border border-1 border-gray-300 rounded-lg p-2'
                  />
                </div>
                <div>
                  <label class='block text-sm font-medium mb-1'>
                    Last name
                  </label>
                  <input
                    type='text'
                    class='w-full border border-1 border-gray-300 rounded-lg p-2'
                  />
                </div>
              </div>
              <div class='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label class='block text-sm font-medium mb-1'>
                    Email address
                  </label>
                  <input
                    type='email'
                    class='w-full border border-1 border-gray-300 rounded-lg p-2'
                    placeholder='abc@gmail.com'
                  />
                </div>
                <div>
                  <label class='block text-sm font-medium mb-1'>Phone</label>
                  <input
                    type='text'
                    class='w-full border border-1 border-gray-300 rounded-lg p-2'
                    placeholder='(xxx) xx-xxxx'
                  />
                </div>
              </div>
              <div>
                <label class='block text-sm font-medium mb-1'>Address</label>
                <input
                  type='text'
                  class='w-full border border-1 border-gray-300 rounded-lg p-2'
                />
              </div> */}
            </div>
            <div class='border p-4 rounded-lg mb-4 flex justify-between items-center'>
              <span class='text-sm font-medium'>Apply coupon</span>
              <i class='fas fa-chevron-down'></i>
            </div>
            <div class='border p-4 rounded-lg flex justify-between items-center'>
              <span class='text-sm font-medium'>Shipping options</span>
              <i class='fas fa-chevron-down'></i>
            </div>
          </div>
          <div class='w-full md:w-1/3'>
            <div class='border p-6 rounded-lg'>
              <h2 class='text-lg font-semibold mb-4'>Order Details</h2>
              <div class='flex justify-between items-center mb-4'>
                <div class='flex items-center'>
                  <img
                    src='https://placehold.co/50x50'
                    alt='Product image'
                    class='w-12 h-12 mr-4'
                  />
                  <div>
                    <p class='text-sm'>Crayon Shin-chan...</p>
                    <p class='text-sm'>x1</p>
                  </div>
                </div>
                <p class='text-sm'>80$</p>
              </div>
              <div class='flex justify-between items-center mb-4'>
                <div class='flex items-center'>
                  <img
                    src='https://placehold.co/50x50'
                    alt='Product image'
                    class='w-12 h-12 mr-4'
                  />
                  <div>
                    <p class='text-sm'>Crayon Shin-chan...</p>
                    <p class='text-sm'>x1</p>
                  </div>
                </div>
                <p class='text-sm'>80$</p>
              </div>
              <div class='border-t pt-2'>
                <div class='flex justify-between items-center mb-2'>
                  <p class='text-sm'>Total product value</p>
                  <p class='text-sm'>80$</p>
                </div>
                <div class='flex justify-between items-center mb-2'>
                  <p class='text-sm text-red-500'>Discount</p>
                  <p class='text-sm text-red-500'>-37$</p>
                </div>
                <div class='flex justify-between items-center mb-2'>
                  <p class='text-sm'>Tax</p>
                  <p class='text-sm'>10$</p>
                </div>
                <div class='flex justify-between items-center mb-4'>
                  <p class='text-sm'>Shipping</p>
                  <p class='text-sm'>10$</p>
                </div>
                <div class='flex justify-between items-center mb-4 border-t pt-2'>
                  <p class='text-lg font-semibold'>Total Price</p>
                  <p class='text-lg font-semibold'>43$</p>
                </div>
                <button class='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-white border border-black hover:text-black transition-all duration-300'>
                  Pay now (2)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth='sm'
        className='p-4 transition-all duration-500'
      >
        {isAdding ? (
          <>
            <DialogTitle>
              {isEditMode ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogContent>
              <TextField
                label='Receiver Name'
                value={receiverName}
                onChange={e => setReceiverName(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Receiver Phone'
                value={receiverPhone}
                onChange={e => setReceiverPhone(e.target.value)}
                fullWidth
                margin='normal'
              />
              <TextField
                select
                label='Province'
                value={
                  provinces.find(p => p.name === selectedProvince)?.code || ''
                }
                onChange={e => {
                  const provinceCode = e.target.value
                  const provinceName = provinces.find(
                    p => p.code === provinceCode
                  )?.name
                  setSelectedProvince(provinceName)
                  getDistricts(provinceCode).then(setDistricts)
                  setSelectedDistrict('')
                  setSelectedWard('')
                  setWards([])
                }}
                fullWidth
                margin='normal'
              >
                {provinces.map(province => (
                  <MenuItem key={province.code} value={province.code}>
                    {province.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label='District'
                value={
                  districts.find(d => d.name === selectedDistrict)?.code || ''
                }
                onChange={e => {
                  const districtCode = e.target.value
                  const districtName = districts.find(
                    d => d.code === districtCode
                  )?.name
                  setSelectedDistrict(districtName)
                  getWards(districtCode).then(setWards)
                  setSelectedWard('')
                }}
                fullWidth
                margin='normal'
                disabled={!selectedProvince}
              >
                {districts.map(district => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label='Ward'
                value={wards.find(w => w.name === selectedWard)?.code || ''}
                onChange={e => {
                  const wardCode = e.target.value
                  const wardName = wards.find(w => w.code === wardCode)?.name
                  setSelectedWard(wardName)
                }}
                fullWidth
                margin='normal'
                disabled={!selectedDistrict}
              >
                {wards.map(ward => (
                  <MenuItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label='Street'
                value={street}
                onChange={e => setStreet(e.target.value)}
                fullWidth
                margin='normal'
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddressSave}
                color='primary'
                variant='contained'
              >
                {isEditMode ? 'Update Address' : 'Save Address'}
              </Button>
              <Button
                onClick={isEditing ? handleEdtitingState : handleAddingState}
                color='secondary'
                variant='outlined'
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>My Address</DialogTitle>
            <DialogContent>
              {' '}
              <RadioGroup
                name='use-radio-group'
                defaultValue='first'
                value={tempAddress?._id || ''}
                onChange={handleAddressSelect}
              >
                {addresses.map(address => (
                  <div
                    key={address._id}
                    className='border p-4 mb-2 rounded relative flex items-start'
                  >
                    <MyFormControlLabel
                      key={address._id}
                      value={address._id}
                      control={<Radio color='default' />}
                    />{' '}
                    <div>
                      {' '}
                      <p>
                        <strong>Address:</strong>{' '}
                        {`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}
                      </p>
                      <p>
                        <strong>Receiver Name:</strong> {address.receiverName}
                      </p>
                      <div className='w-full flex justify-between items-center'>
                        <p>
                          <strong>Receiver Phone:</strong>{' '}
                          {address.receiverPhone}
                        </p>
                        <button
                          className='underline text-blue-600 hover:text-blue-800 cursor-pointer'
                          onClick={()=>handleDeleteAddress(address._id)}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <button
                onClick={handleAddingState}
                className='flex items-center hover:bg-black hover:text-white px-4 py-2 rounded bg-white border mb-3 text-black transition-all duration-300'
              >
                <AddOutlined className='mr-2' />
                Add New Address
              </button>
              <Divider />
              <div className='flex justify-end gap-2 items-center mt-3 w-full'>
                <button
                  className='flex items-center hover:bg-black hover:text-white px-4 py-2 rounded bg-white border mb-3 text-black transition-all duration-300'
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className='flex  items-center bg-black text-white px-4 py-2 rounded hover:bg-white border mb-3 hover:text-black transition-all duration-300'
                  onClick={handleSaveChanges}
                >
                  Save Change
                </button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  )
}

export default Checkout
