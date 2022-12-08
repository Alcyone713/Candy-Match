import React from 'react'
import './Header.css'
import logo from '../Assets/logo.png'

export default function Header() {
  return (
    <div className='header'>
        <img src={logo} alt='logo' />
        <h1>Candy match</h1>
    </div>
  )
}
