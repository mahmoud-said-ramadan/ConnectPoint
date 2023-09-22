import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
    const [isLogin, setIsLogin] = useState(false);

    const getIsLogin = () => {
        if (localStorage.getItem('token')) {
            setIsLogin(true);
            getFriends();
        }
    }


    // friends start //
    const [friends, setFriends] = useState([]);

    const getFriends = async () => {
        const header = {
            token: localStorage.getItem('token')
        }
        const data = await axios('http://localhost:5000/getFriends', { header });
        data?.message ? setFriends(data.friends) : setFriends(null);
    }
    // friends end //



    // Chat start //
    const [chat, setChat] = useState([]);

    const getChat = async (userId) => {
        const header = {
            token: localStorage.getItem('token')
        }
        const data = await axios(`http://localhost:5000/getChat/${userId}`, { header });
        data?.message ? setChat(data.chat) : setChat(null);
        setChat();
    }
    // Chat end //

    useEffect(() => {
        getIsLogin();
    }, []);

    return (
        <>
            {isLogin ?
                <div className="flex h-screen antialiased text-gray-800">
                    <div className="flex flex-row h-full w-full overflow-x-hidden">
                        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                            <div className="flex flex-row items-center justify-center h-12 w-full">
                                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="ml-2 font-bold text-2xl">QuickChat</div>
                            </div>
                            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
                                <div className="h-20 w-20 rounded-full border overflow-hidden">
                                    <img src="https://avatars3.githubusercontent.com/u/2763884?s=128" alt="Avatar" className="h-full w-full" />
                                </div>
                                <div className="text-sm font-semibold mt-2">Aminos Co.</div>
                                <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
                                <div className="flex flex-row items-center mt-3">
                                    <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                                        <div className="h-3 w-3 bg-white rounded-full self-end mr-1" />
                                    </div>
                                    <div className="leading-none ml-1 text-xs">Active</div>
                                </div>
                            </div>
                            <div className="flex flex-col mt-8">
                                {friends.length ?
                                    <>
                                        <div className="flex flex-row items-center justify-between text-xs">
                                            <span className="font-bold">Active Conversations</span>
                                            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">4</span>
                                        </div>
                                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                                            <button onClick={getChat(`${'2837hj3gbndshuidjbk'}`)} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                                    H
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                                            </button>
                                            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                                                    M
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Marta Curtis</div>
                                                <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
                                                    2
                                                </div>
                                            </button>
                                            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full">
                                                    P
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Philip Tucker</div>
                                            </button>
                                            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-pink-200 rounded-full">
                                                    C
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Christine Reid</div>
                                            </button>
                                            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full">
                                                    J
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Jerry Guzman</div>
                                            </button>
                                        </div>
                                        <div className="flex flex-row items-center justify-between text-xs mt-6">
                                            <span className="font-bold">Archivied</span>
                                            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">7</span>
                                        </div>
                                        <div className="flex flex-col space-y-1 mt-4 -mx-2">
                                            <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                                    H
                                                </div>
                                                <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                                            </button>
                                        </div>
                                    </>
                                    :
                                    ''
                                }
                            </div>
                        </div>
                        <div className="flex flex-col flex-auto h-full p-6">
                            <div className="py-2 px-3 bg-teal-500 flex flex-row justify-between items-center">
                                <div className="flex items-center">
                                    <div>
                                        <img className="w-10 h-10 rounded-full" src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg" /></div><div className="ml-4"><p className="text-grey-darkest">New Movie! Expendables 4</p>
                                        <p className="text-grey-darker text-xs mt-1">Andrés, Tom, Harrison, Arnold, Sylvester</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                            <path fill="#263238" fillOpacity=".5" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" /></svg>
                                    </div>
                                    <div className="ml-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                            <path fill="#263238" fillOpacity=".5" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z" /></svg></div><div className="ml-6"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}><path fill="#263238" fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full">
                                <div className="flex flex-col h-full overflow-x-auto mb-4">
                                    <div className="flex flex-col h-full">
                                        <div className="grid grid-cols-12 gap-y-2">
                                            {chat.length ?
                                                <>
                                                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                        <div className="flex flex-row items-center">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                                A
                                                            </div>
                                                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                                <div>Hey How are you today?</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </> : ''
                                            }

                                            {/* <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing
                                                            elit. Vel ipsa commodi illum saepe numquam maxime
                                                            asperiores voluptate sit, minima perspiciatis.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                <div className="flex items-center justify-start flex-row-reverse">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                        <div>I'm ok what about you?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                <div className="flex items-center justify-start flex-row-reverse">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div>Lorem ipsum dolor sit amet !</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                <div className="flex items-center justify-start flex-row-reverse">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div>Lorem ipsum dolor sit amet !</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                <div className="flex items-center justify-start flex-row-reverse">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div>Lorem ipsum dolor sit amet !</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                <div className="flex items-center justify-start flex-row-reverse">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                                                        </div>
                                                        <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                                                            Seen
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div>
                                                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                            Perspiciatis, in.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                <div className="flex flex-row items-center">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                        A
                                                    </div>
                                                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                        <div className="flex flex-row items-center">
                                                            <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10">
                                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </button>
                                                            <div className="flex flex-row items-center space-x-px ml-4">
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-4 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-10 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-10 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-12 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-10 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-6 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-5 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-4 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-3 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-10 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-10 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-1 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-1 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-8 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-2 w-1 bg-gray-500 rounded-lg" />
                                                                <div className="h-4 w-1 bg-gray-500 rounded-lg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                                    <div>
                                        <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex-grow ml-4">
                                        <div className="relative w-full">
                                            <input type="text" className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                                            <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                                            <span>Send</span>
                                            <span className="ml-2">
                                                <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <h1 className=' mx-2 my-6 py-10 px-2' style={{ color: 'black', backgroundColor: 'red' }}>Please Login First!</h1>
            }
        </>
    )
}

// import React from 'react';

// const MyComponent = () => {
//     return (
//         <div className="bg-blue-500 text-white p-4">
//             <h1 className="text-2xl font-bold">Welcome to my app!</h1>
//             <p className="mt-2">This is a Tailwind CSS example.</p>
//         </div>
//     );
// };

// export default MyComponent;
