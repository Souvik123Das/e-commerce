import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get exclusive offers on your email </h1>
        <p> Always stay updated through your email</p>
        <div>
            <input type="email" placeholder='Please enter your email id' />
            <button>Subscribe</button>
    </div>

    </div>
  )
}

export default NewsLetter
