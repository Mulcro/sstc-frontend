import {Link} from 'react-router-dom';

const Main = () =>{
    return (
        <div className="text-white  w-full h-[85vh] px-5 grid bg-transparent">
            <div className=" grid grid-cols-2 items-center">
                <div className="heroText text-white h-full flex flex-col gap-10 justify-center">
                    <h1 className='font-black lg:text-[40px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[60px]'>We <spam className='py-1 px-4 bg-mccd-gold text-mccd-blue transition-all ease-in-out duration-200 rounded-full hover:bg-transparent hover:text-mccd-gold border-2 border-mccd-gold'>manage sessions</spam> so you don't have to!</h1>

                    <h4 className=' font-medium lg:text-[20px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]'>Staff worldwide struggle to manage multiple sessions efficiently, whether in education, healthcare, or corporate settings, but our app simplifies the process, allowing you to focus on delivering the best outcomes.</h4>

                    <h4 className=' font-medium lg:text-[20px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]'>Reach out today to discover how our app can be tailored to meet the specific needs of your field and streamline your session management process.</h4>
                    
                    <div className='flex flex-row gap-8 justify-center'>
                        <Link to="/sessions" className='font-bold font-medium lg:text-[16px] sm:text-[10px] xs:text-[10px] lg:leading-[40px] py-2 px-8 text-mccd-gold rounded-xl border-2 border-solid border-mccd-gold shadow-custom hover:bg-mccd-blue ease-in-out duration-300 hover:shadow-none hover:text-mccd-gold-dark'>View Live Demo</Link>
                        <button className='font-bold font-medium lg:text-[16px] sm:text-[10px] xs:text-[10px] lg:leading-[40px] py-2 px-8 text-mccd-gold rounded-xl border-2 border-solid border-mccd-gold shadow-custom hover:bg-mccd-blue-light transition-all ease-in-out duration-300 hover:shadow-none hover:text-mccd-gold-dark'>Contact Me</button>
                    </div>
                
                </div>

                <div className='flex justify-center items-center'>
                    <img src='\imgSSTC1.svg' className='xl:h-[30rem] md:h-[50rem]'/>
                </div>
            </div>

        </div>
    )
}

export default Main;