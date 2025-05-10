import NotificationsBell from '@/Components/NotificationListener/NotificationListener';
import React from 'react'
import { useSelector } from 'react-redux';


const NotificationDisplay = () => {


  const user = useSelector((state) => state.user.data);
  const token = useSelector((state) => state.user.token);



  return (
    <div>
        <NotificationsBell userId={user.userId}  token={token}/>
        
      
    </div>
  )
}

export default NotificationDisplay
