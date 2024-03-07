import React from 'react'

const Error = ({errMessage}) => {
  return (
    <div className='w-full h-full flex items-center justify-center ' >
        <h3 className=' text-headingColor text-[20px] leading-[30px] font-semibold '
        >{ errMessage }</h3>
    </div>
  )
}

export default Error