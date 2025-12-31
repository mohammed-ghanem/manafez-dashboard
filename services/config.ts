// export const getAPIConfig = () => {
//   const isDevelopment = process.env.NODE_ENV === 'development';
//   const isLocalhost = typeof window !== 'undefined' && 
//     window.location.hostname === 'localhost';

//   return {
//     baseURL: process.env.NEXT_PUBLIC_BASE_URL,
//     withCredentials: true,
//     // Different cookie settings for development vs production
//     cookieSettings: {
//       secure: !isDevelopment,
//       sameSite: isLocalhost ? 'lax' : 'none',
//     }
//   };
// };