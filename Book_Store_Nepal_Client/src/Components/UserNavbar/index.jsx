import React, { useRef, useState ,useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaSignInAlt } from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosService from '@/Services/Axios';
import { getUser } from '@/Store/Slice/UserSlice';
import { FaCartShopping } from "react-icons/fa6";

const UserNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch=useDispatch();
    const location = useLocation();
    const navigate=useNavigate();
    const userState=useSelector(state=>state?.user);
    const {data:user}=userState;
    const [toggle,setToggle]=useState(false);
    const proTog=useRef(null);
    const navItems = [
        {
            pageName: "Home",
            path: '/',
            icon: <FaHome className="mr-2" />,
            show:true
        },
        {
            pageName: "Books",
            path: '/books',
            icon: <FaBook className="mr-2" />,
            show:true
        },
        {
            pageName: "Sign In",
            path: '/sign-in',
            icon: <FaSignInAlt className="mr-2" />,
            show:!user
        },
        {
            pageName: "Sign Up",
            path: '/sign-up',
            icon: <SiGnuprivacyguard className="mr-2" />,
            show:!user
        }
    ];
    const handleLogout=async()=>{
        try{
            const response=await axiosService.get('/api/user/logout');
            if(response?.status===200){
                dispatch(getUser());
                alert(response?.data?.message);
                navigate('/sign-in');
            }
        }
        catch(error){
            console.log(error);
            alert(error?.message);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            proTog.current &&
            !proTog.current.contains(event.target)
          ) {
            setToggle(false);
          }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }, []);

    return (
        <nav className="bg-white shadow-lg w-full fixed top-0 left-0 right-0 z-50 mb-2">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold text-indigo-600 whitespace-nowrap">
                            BookStoreNepal
                        </Link>
                    </div>

                    
                    <div className="hidden md:flex md:space-x-2 lg:space-x-4">
                        {navItems.map((item, index) => (
                            item?.show &&
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 whitespace-nowrap
                                    ${location.pathname === item.path 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                            >
                                {item.icon}
                                {item.pageName}
                            </Link>
                        ))}
                        {
                            user &&
                            <div className='p-2'>
                                <FaCartShopping onClick={()=>navigate('/cart')} className='w-5 h-5 cursor-pointer'/>
                            </div>
                        }
                        {
                            user &&
                            <div ref={proTog} onClick={()=>setToggle(!toggle)} className={`w-10 cursor-pointer h-10 rounded-full bg-white border-2 border-black flex items-center justify-center
                                ${location.pathname === '/profile'
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}>
    <p className='text-black font-bold text-xl'>
        {user?.name?.slice(0,1)?.toUpperCase()}
    </p>
</div>

                        }
                    </div>

                  
                    <div className="md:hidden flex items-center gap-4">
                    {
                            user &&
                            <div className='p-2 md:hidden'>
                                <FaCartShopping onClick={()=>navigate('/cart')} className='w-5 h-5 cursor-pointer'/>
                            </div>
                        }
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                            aria-expanded="false"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {toggle && (
          <div className={`absolute right-3 z-10 mt-1 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 focus:outline-none bg-white`}>
            <div
              onClick={()=>navigate('/profile')}
              className={`px-4 py-2 text-sm  hover:bg-slate-100 cursor-pointer flex flex-row gap-2 items-center hover:text-blue-600 ${
                location.pathname === "/profile"? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
              }`}
            >
              Your Profile
            </div>
            <div
              onClick={handleLogout}
              className={`px-4 py-2 text-sm   hover:bg-slate-100 cursor-pointer hover:text-blue-600 flex flex-row gap-2 items-center`}
            >
              Log out
            </div>
          </div>
        )}
        
            
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-4 space-y-1">
                        {navItems.map((item, index) => (
                        item?.show &&
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center px-3 py-3  rounded-md text-base font-medium transition-colors duration-300 
                                    ${location.pathname === item.path 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                            >
                                {item.icon}
                                {item.pageName}
                            </Link>
                        ))}
                        {
                            user &&
                            <>
                            <div className={`flex gap-2 items-center cursor-pointer rounded-lg px-1
                                ${location.pathname === "/profile" 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`} onClick={()=>navigate('/profile')}>

                            <div className='w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center'>
    <p className='text-black font-bold text-xl'>
        {user?.name?.slice(0,1)?.toUpperCase()}
    </p>

</div>
<p className='text-gray-700'>Profile</p>
                            </div>
                            <div
              onClick={handleLogout}
              className={`px-4 py-2 text-sm   hover:bg-slate-100 cursor-pointer hover:text-blue-600 flex flex-row gap-2 items-center`}
            >
              Log out
            </div>
                            </>
                        }
                    </div>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;