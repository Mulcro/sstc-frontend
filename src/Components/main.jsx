import {useEffect, useRef, useState} from 'react';

const Main = () =>{
    return (
        <div className="font-Poppins text-white  w-full h-[85vh] p-5 grid bg-gradient-to-l from-mccd-gold to-mccd-blue">
            <div className=" grid grid-cols-2 items-center">
                <div className="heroText text-white">
                    <h1 className='font-black lg:text-[40px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2'>We manage sessions so you don't have to!</h1>

                    <h4 className=' font-medium lg:text-[20px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]'>Staff worldwide struggle to manage multiple sessions efficiently, whether in education, healthcare, or corporate settings, but our app simplifies the process, allowing you to focus on delivering the best outcomes.</h4>

                    <h4 className=' font-medium lg:text-[20px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]'>Reach out today to discover how our app can be tailored to meet the specific needs of your field and streamline your session management process.</h4>

                    <button className=' font-medium lg:text-[20px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]'>Contact Me</button>
                </div>

                <div className='flex justify-center items-center'>
                    <img src='public\imgSSTC1.svg' className='xl:h-[30rem] md:h-[50rem]'/>
                </div>
            </div>

        </div>
    )
}

export default Main;