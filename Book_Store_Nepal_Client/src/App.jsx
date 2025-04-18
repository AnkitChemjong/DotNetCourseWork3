import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Book from './Pages/Book';
import BookDetails from './Pages/BookDetails';
import { getUser } from './Store/Slice/UserSlice';
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import Profile from './Pages/Profile';
import { Navigate } from 'react-router-dom';
import CommonSkeleton from './Components/CommonSkeleton';
import AddBook from './Pages/AddBook';
import AdminDashboard from './Pages/AdminDashboard';
import { getAllBook } from './Store/Slice/AllBookSlice';
import { getAllCart } from './Store/Slice/AllCartSlice';
import Cart from './Pages/Cart';
import { getAllMark } from './Store/Slice/GetAllBookMark';


function AdminRoute({ children }) {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  if (loading) {
    return <CommonSkeleton />; 
  }
  if (!loading && (!user || !user?.role==="admin")) {
    return <Navigate to="/" />;
  }
  return children;
}


const PrivateRoute = ({ children }) => {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;

  if (loading) {
    return <CommonSkeleton />
  }
  if (user) {
    if (user?.role==='admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return children;
    }
  } }
const AuthRoute=({children})=>{
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const logedUser=!!user;
  if (loading) {
    return <CommonSkeleton />; 
  }
  return !loading && logedUser? <Navigate to="/"/>:children;
}
function App() {
  const userState=useSelector(state=>state?.user);
  const bookStates = useSelector(state => state?.books);
  const cartStates = useSelector(state => state?.carts);
  const markStates = useSelector(state => state?.bookmarks);
  const dispatch=useDispatch();
  useState(()=>{
if(!userState?.data){
   dispatch(getUser());
}
if(!bookStates?.data){
  dispatch(getAllBook());
}
if(!cartStates?.data){
  dispatch(getAllCart());
}
if(!markStates?.data){
  dispatch(getAllMark());
}
  },[]);
  function HomeRestrictForAdmin({children}){
    const userStates = useSelector(state => state?.user);
    const { data: user, loading } = userStates;
    if (loading) {
      return <CommonSkeleton />; 
    }
    if(!loading && user?.role==="admin"){
      return <Navigate to="/admin/dashboard" />
    }
    else{
      return children;
    }
  }
 
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeRestrictForAdmin><Home/></HomeRestrictForAdmin>}/>
        <Route path='/sign-up' element={<AuthRoute><SignUp/></AuthRoute>}/>
        <Route path='/sign-in' element={<AuthRoute><SignIn/></AuthRoute>}/>
        <Route path='/books' element={<PrivateRoute><Book/></PrivateRoute>}/>
        <Route path='/cart' element={<PrivateRoute><Cart/></PrivateRoute>}/>
        <Route path='/book-details/:id' element={<PrivateRoute><BookDetails/></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path='/admin/addbook' element={<AdminRoute><AddBook/></AdminRoute>}/>
      </Routes>
      
    </Router>
  )
}

export default App
