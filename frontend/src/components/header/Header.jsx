import React from 'react'
import logo from '../../assets/images/logo.png';
import {NavLink, Link} from 'react-router-dom';
import { useEffect, useRef, useContext } from 'react';
import {BiMenu} from 'react-icons/bi';
import { authContext } from '../../context/AuthContext.jsx';

const navLinks = [
  {
    path:'/home',
    display:'Home'
  },
  {
    path:'/doctors',
    display:'Find a Doctor'
  },
  {
    path:'/services',
    display:'Services'
  },
  {
    path:'/contact',
    display:'Contact'
  }
]

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const {user, role, token} = useContext(authContext);

  const handleStickyHeader = () =>{
    window.addEventListener('scroll', ()=>{
      if(document.body.scrollTop >80 || document.documentElement.scrollTop > 80){
        headerRef.current.classList.add('sticky__header');
      }else{
        headerRef.current.classList.remove('sticky__header');
      }
    })
  }

  useEffect(()=>{
    handleStickyHeader();

    return ()=> window.removeEventListener('scroll', handleStickyHeader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  console.log("user is ", user);

  return (
    <header className='header flex items-center' ref={headerRef} >
        <div className='container' >
            <div className='flex items-center justify-between ' >
              {/* Logo */}
              <div>
                <img src={logo} alt='Logo Image' loading='lazy' />
              </div>

              {/* Menu */}
          
              <div className='navigation' onClick={toggleMenu} ref={menuRef} >
                  <ul className='menu flex items-center gap-[2.7rem] ' >
                      {
                        navLinks.map((link, index)=>(
                          <li key={index} >
                            <NavLink to={link.path} 
                            className={navClass => navClass.isActive ? 
                            ' text-primaryColor text-[16px] leading-7 font-[600] ' : 
                            ' text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor ' } > {link.display} </NavLink>
                          </li>
                        ))
                      }
                  </ul>
              </div>

              {/* Nav Right */}
              <div className='flex items-center gap-4 ' >
                {
                  token && user ? 
                  (
                    <div>
                        <Link to={`${role==='doctor' ? '/doctors/profile/me' : '/users/profile/me' }`} 
                        className='flex justify-center items-center gap-3 ' >
                          <figure className='w-[25px] rounded-full md:w-[45px] md:h-[45px] cursor-pointer ' >
                              <img src={user?.photo} className='w-[25px] rounded-full md:w-[45px] md:h-[45px] ' alt='User Image' loading='lazy' />
                          </figure>
                          <h2 className=' text-sm md:font-bold md:text-[16px] ' >{user?.name}</h2>
                        </Link>
                  </div>
                  ) :  
                  (
                    <Link to='/login' >
                <button className=' bg-primaryColor py-2 px-6 text-white justify-center rounded-[50px] font-[600] h-[44px] flex items-center ' >Login</button>
              </Link>
                  )
                }
              </div>
             

              <span className='md:hidden' onClick={toggleMenu} >
                  <BiMenu className='w-6 h-6 cursor-pointer ' />
              </span>

            </div>
        </div>
    </header>
  )
}

export default Header