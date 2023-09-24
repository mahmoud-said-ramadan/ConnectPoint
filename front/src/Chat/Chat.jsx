import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import userIcon from './user-icon.png'
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import Message from '../Message/Message.jsx';


const token = localStorage.getItem('token')
console.log(token);
const header = {
    authorization: `kokoz ` + token?.replace(/"/g, '')
}

const baseUrl = 'http://localhost:5000/';
const clientIo = io(baseUrl);

const { id } = jwt_decode(token);
console.log(id);

clientIo.emit('updateSocketId', id);

clientIo.on('updateSocketId', data => {
    console.log('ppppppppppppppppppppppppppppppppppp');
    console.log(data);
    console.log('ppppppppppppppppppppppppppppppppppp');
})





export default function Chat() {
    const [isLogin, setIsLogin] = useState(false);
    // const [loginId, setLoginId] = useState(null)
    // let userId;
    const getIsLogin = () => {
        console.log('1');
        if (token) {
            setIsLogin(true);
            getUser();

            // setLoginId(id)
            getFriends();
        }
    }

    const [user, setUser] = useState(null);
    const getUser = async () => {
        console.log(header);
        const { data } = await axios('http://localhost:5000/user/', { headers: header });
        console.log('----------------user------------------');
        console.log(data.user);
        console.log('----------------user------------------');
        data?.message ? setUser(data.user) : setUser(null);
    }

    // friends start //
    const [friends, setFriends] = useState([]);

    const getFriends = async () => {
        const { data } = await axios('http://localhost:5000/user/getFriends', { headers: header });
        console.log('-------------friends---------------------');
        console.log(data.friends.friends);
        console.log('--------------friends--------------------');
        data?.message ? setFriends(data.friends.friends) : setFriends(null);
    }
    // friends end //



    // Chat start //
    const [chat, setChat] = useState([]);
    const [chatHeader, setChatHeader] = useState(null);

    const getChat = async (userId) => {
        let friend = friends.find(friend => friend.user._id === userId);
        console.log({ friend });
        setChatHeader(friend);
        const { data } = await axios(`http://localhost:5000/chat/${userId}`, { headers: header });
        console.log('--------------chat--------------------');
        console.log(data.chat);
        console.log('---------------chat-------------------');
        if (data.chat) {
            setChat(data.chat);
            data.chat.messages.forEach(ele => {
                const newMessage = {
                    // chatId: ele._id,
                    message: ele.message,
                    sender: { image: ele.from.image?.secure_url || userIcon, id: ele.from._id },
                };
                appendMessage(newMessage);
            });
        }
        else {
            setChat(null);
        }

        setFriendId(userId);




    }
    // Chat end //


    const [messages, setMessages] = useState([]);

    const appendMessage = (messageData) => {
        console.log({ messageData });
        setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    const [friendId, setFriendId] = useState(null);

    const sendMessage = async () => {
        try {
            let message = document.getElementById("message-input");
            if (friendId && message) {
                console.log(typeof (friendId));
                console.log(`Sending message to friend with ID: ${friendId}`);
                const data = await axios.post(`http://localhost:5000/chat/`, { message: message.value, to: friendId }, { headers: header });
                console.log('--------------message--------------------');
                console.log(data);
                console.log('-----------------message-----------------');
                if (data.status === 201) {
                    console.log('SENT YASTA');

                    const newMessage = {
                        // chatId: data.chatId,
                        message: message.value,
                        sender: { image: user.image?.secure_url || userIcon, id: user._id },
                    };
                    appendMessage(newMessage);

                }
                else {
                    console.log("FAIL YASTA");
                }
                // clientIo.emit('addMessage', { message: message.value, to: friendId, header })
                // data?.chat ? setChat(data?.chat) : setChat(chat);
                document.getElementById("message-input").value = '';
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getIsLogin();
    }, []);

    const messageRef = useRef();
    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'end',
                inline: 'nearest'
            });
        }

    }, [messages]); // Add 'chat' as a dependency to trigger the effect when chat messages update



    useEffect(() => {
        clientIo.on('recieveMessage', data => {
            console.log('=======================================');
            console.log(data);
            console.log('=======================================');
            // const div = document.createElement('div');
            // div.className = 'col-start-1 col-end-8 p-3 rounded-lg';
            // div.innerHTML = `
            //                     <div className="flex flex-row items-center">
            //                         <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
            //                             <img src='${data.isToExist.image?.secure_url || userIcon}' alt="Avatar" className="h-full w-full object-cover" />
            //                         </div>
            //                         <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
            //                             <div className="text-left">${data.message}</div>
            //                         </div>
            //                     </div>
            //                 `;
            // document.getElementById('chatContent').appendChild(div);

            const newMessage = {
                // chatId: data.chatId,
                message: data.message,
                sender: { image: data.sender.image?.secure_url || userIcon, id: data.sender._id },
            };
            appendMessage(newMessage);
        })
        // Clean up the event listener when component unmounts
        return () => {
            clientIo.off('receiveMessage');
        };
    }, [])



    return (
        <>
            {isLogin ?
                <div className="flex h-screen antialiased text-gray-800">
                    <div className="flex flex-row h-full w-full overflow-x-hidden">
                        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                            <div className="flex flex-row items-center justify-center h-12 w-full" style={{ height: '82%' }}>
                                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="ml-2 font-bold text-2xl">ConnectPoint</div>
                            </div>
                            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
                                {user ?
                                    <>
                                        <div className="h-20 w-20 rounded-full border overflow-hidden image-container">
                                            <img src={user.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full" />
                                        </div>
                                        <div className="text-sm font-semibold mt-2">{user.userName}</div>
                                        <div className="text-xs text-gray-500">Back-End Developer</div>
                                        <div className="flex flex-row items-center mt-3">
                                            <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                                                <div className="h-3 w-3 bg-white rounded-full self-end mr-1" />
                                            </div>
                                            <div className="leading-none ml-1 text-xs">{user.status}</div>
                                        </div>
                                    </>
                                    : ''
                                }

                            </div>
                            <div className="flex flex-col mt-8">
                                {friends.length ?
                                    <>
                                        <div className="flex flex-row items-center justify-between text-xs">
                                            <span className="font-bold">Active Conversations</span>
                                            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">4</span>
                                        </div>
                                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                                            {friends.map((friend) => (
                                                friend.place === 'main' && (
                                                    <button
                                                        key={friend.user._id}
                                                        onClick={() => getChat(friend.user._id)}
                                                        className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                                                                <img src={friend.user.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="ml-2 text-sm font-semibold">{friend.user.userName}</div>
                                                        </div>
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                        {friends.some((friend) => friend.place === 'archive') && (
                                            <>
                                                <div className="flex flex-row items-center justify-between text-xs mt-6">
                                                    <span className="font-bold">Archived</span>
                                                    <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">7</span>
                                                </div>
                                                <div className="flex flex-col space-y-1 mt-4 -mx-2">
                                                    {friends.map((friend) => (
                                                        friend.place === 'archive' && (
                                                            <button
                                                                key={friend.user._id}
                                                                onClick={() => getChat(friend.user._id)}
                                                                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                                                                        <img src={friend.user.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full object-cover" />
                                                                    </div>
                                                                    <div className="ml-2 text-sm font-semibold">{friend.user.userName}</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                    :
                                    ''
                                }
                            </div>
                        </div>
                        <div className="flex flex-col flex-auto h-full p-6" style={{ height: "95%" }}>
                            {chatHeader ?
                                <>
                                    <div className="py-2 px-3 bg-teal-500 flex flex-row justify-between items-center">
                                        <div className="flex items-center">
                                            <div className='h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container'>
                                                <img className="w-10 h-10 rounded-full" src={chatHeader.user.image?.secure_url} />
                                            </div>
                                            <div className="ml-4">
                                                <p style={{ display: 'block' }} className="text-grey-darkest">{chatHeader.user.userName}</p>
                                                {/* <p style={{ display: 'block' }} className="text-grey-darker text-xs mt-1">Andrés, Tom, Harrison, Arnold, Sylvester</p> */}
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                                    <path fill="#263238" fillOpacity=".5" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" /></svg>
                                            </div>
                                            {/* <div className="ml-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                                    <path fill="#263238" fillOpacity=".5" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z" /></svg>
                                            </div> */}
                                            <div className="ml-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                                                    <path fill="#263238" fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="chat-container" className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full">
                                        <div className="flex flex-col h-full overflow-x-auto mb-4" >
                                            <div className="flex flex-col h-full">
                                                {chat?.messages ?
                                                    <>
                                                        <div id='chatContent' className="grid grid-cols-12 gap-y-2" ref={messageRef}>
                                                            {/* {chat.messages.map(message => ( */}

                                                            <>
                                                                {/* Render existing messages */}
                                                                {messages.map((messageData, index) => (
                                                                    <Message key={index} messageData={messageData} />

                                                                ))}
                                                                {/* {message.from._id === loginId ? (
                                                                        <div className="col-start-6 col-end-13 p-3 rounded-lg">
                                                                            <div className="flex items-center justify-start flex-row-reverse">
                                                                                <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                                                                                    <img src={message.from.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full object-cover" />
                                                                                </div>
                                                                                <div className="relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                                                    <div className="text-left">{message.message}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                                                            <div className="flex flex-row items-center">
                                                                                <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                                                                                    <img src={message.from.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full object-cover" />
                                                                                </div>
                                                                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                                                    <div className="text-left">{message.message}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )} */}
                                                            </>
                                                            {/* ))} */}
                                                        </div>
                                                    </>
                                                    :
                                                    <div className="flex justify-center items-center h-full">
                                                        <div className="bg-gray-200 p-4 rounded-lg">
                                                            <p className="text-gray-600 text-lg">Say Hi To Start A Chat</p>
                                                        </div>
                                                    </div>
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
                                                    <input id='message-input' type="text" className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                                                    <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <button onClick={() => sendMessage()} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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
                                </>
                                :
                                ''
                            }
                        </div>
                    </div>
                </div >
                :
                <h1 className=' mx-2 my-6 py-10 px-2' style={{ color: 'black', backgroundColor: 'red' }}>Please Login First!</h1>
            }
        </>
    )
}





// import React, { useState } from 'react';
// import Message from './Message';

// const Chat = () => {
//     const [messages, setMessages] = useState([]);

//     const appendMessage = (messageData) => {
//         setMessages((prevMessages) => [...prevMessages, messageData]);
//     };

//     // Function to handle sending a new message
//     const sendMessage = () => {
//         // Process the message and recipient
//         // ...

//         // Append the new message to the chat
//         const newMessage = {
//             message: 'Hello',
//             userImage: 'https://example.com/avatar.jpg',
//         };
//         appendMessage(newMessage);
//     };

//     return (
//         <div id="chatContent">
//             {/* Render existing messages */}
//             {messages.map((messageData, index) => (
//                 <Message key={index} message={messageData.message} userImage={messageData.userImage} />
//             ))}
//         </div>
//     );
// };

// export default Chat;