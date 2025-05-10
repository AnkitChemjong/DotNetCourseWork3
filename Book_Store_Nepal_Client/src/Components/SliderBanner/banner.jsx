import React, { useEffect, useState } from 'react';
import axiosService from '@/Services/Axios';

const SliderBanner = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axiosService.get('/api/banner/active');
        if (res.status === 200 && res.data.message) {
          setMessage(res.data.message);
        } else {
          setMessage('');
        }
      } catch {
        setMessage('');
      }
    };

    fetchBanner();
    const interval = setInterval(fetchBanner, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!message) return null;

  console.log(message);

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-200 h-12 flex items-center overflow-hidden relative z-40">
      <style jsx>{`
        .marquee-content {
          animation: marquee 20s linear infinite;
          white-space: nowrap;
          display: inline-block;
          padding-left: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      
      <div className="marquee-content">
        <span className="text-yellow-800 font-medium text-lg mx-4">
          {message}
        </span>
        <span className="text-yellow-800 font-medium text-lg mx-4">
          {message}
        </span>
      </div>
    </div>
  );
};

export default SliderBanner;
