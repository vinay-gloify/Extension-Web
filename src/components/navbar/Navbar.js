
import React from 'react'
import "./Navbar.css"
import { TbPremiumRights } from "react-icons/tb";
import { RiHomeGearLine } from "react-icons/ri";

function Navbar() {
  const email = localStorage.getItem("email")
  return (
    <div>
        <div className="d-flex justify-content-between border-bottom border-danger py-2 px-2">
        <div>
          <a href="http://www.discovemail.com/" target="_blank">
            <img className="extdlogo" src="discovemail_logo.svg"></img>
          </a>
        </div>
        <div>

          <a
            href="http://www.discovemail.com/?query=Price#price"
            target="_blank"
            className="mx-2"
            data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Price"
          >
            <TbPremiumRights className='priceicon themeColor fs-5'/>
          </a>

          <a href="http://www.discovemail.com/" target="_blank">
            <RiHomeGearLine className='homeicon themeColor fs-5' />
          </a>
         
         {email ? <a href="https://www.discovemail.com/settings/profile" target='_blank' className="mx-2 text-decoration-none">
          <span className='profileIcon fs-5'>{email?.slice(0,1)}</span>
         </a> : null}
        </div>
      </div>
    </div>
  )
}

export default Navbar;