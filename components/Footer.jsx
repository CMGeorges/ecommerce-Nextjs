import React from 'react'
import { AiFillInstagram,AiOutlineTwitter,AiFillFacebook } from 'react-icons/ai'
import { FaSnapchatGhost } from 'react-icons/fa'



const Footer = () => {
  return (
    <div className="footer-container">
      <p>2022 All rights reserved © CMGeorges&Cie </p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
        <AiFillFacebook />
        <FaSnapchatGhost />
      </p>
    </div>
  )
}

export default Footer