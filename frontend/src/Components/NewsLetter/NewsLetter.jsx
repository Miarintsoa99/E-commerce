import React from 'react'
import './NewLetter.css'
const NewsLetter = () => {
  return (
    <div className="newsletter">
        <h1>Get Exclusive ofeers On Your Email</h1>
        <p>Subsribe to our newsletter and stay updated</p>
        <div>
            <input type="email" placeholder='Your Email id' />
            <button>Subscrire</button>
        </div>
    </div>
  )
}

export default NewsLetter