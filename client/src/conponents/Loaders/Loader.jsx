import React from 'react'
import './Loader.css'
import Spinner from '../../assets/Spinner.svg'


export default function Loader() {
  return (
    <div className='Loader'>
      <img src={Spinner} alt="Spinner" />
    </div>
  )
}
