import NotificationsBell from '@/Components/NotificationListener/NotificationListener';
import React from 'react'

const NotificationDisplay = () => {
    const { data: user, token } = useSelector(state => state.auth);
  return (
    <div>
        <NotificationsBell userId={user.userId} token={token} />
        
      
    </div>
  )
}

export default NotificationDisplay
