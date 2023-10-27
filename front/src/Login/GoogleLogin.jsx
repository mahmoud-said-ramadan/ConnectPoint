// import React, { useState } from 'react';
// import { GoogleLogin } from 'react-google-login';


// const clientId = '200689384505-lejet0f8tet6vmggh6lj08pfjtqi02v1.apps.googleusercontent.com';
// export const CustomGoogleLogin = () => {
//     const [flag, setFlag] = useState(false);
//     const [name, setName] = useState(null);

//     const onSuccess = (res) => {

//         setName(res.profileObj['name']);
//         console.log('success', res.profileObj);
//         setFlag(true);
//         // Handle the successful Google login response
//     };

//     const onFailure = (res) => {
//         // Handle any errors that occur during Google login
//     };

//     return (
//         <>
//             {
//                 flag ? <h2>Hello {name}</h2>
//                     :
//                     <GoogleLogin
//                         clientId={clientId}
//                         onSuccess={onSuccess}
//                         onFailure={onFailure}
//                         buttonText={'sign in with google'}
//                         cookiePolicy={'single_host_origin'}
//                         isSignedIn={false}
//                     // fetchBasicProfile={true}
//                     // onRequest={handleGoogleLogin}
//                     />
//             }
//         </>
//     );
// };