import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import userIcon from './user-icon.png'
import popSound from './popUp-message-2.mp3'
import notificationSound from './Notification.mp3'
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import Message from '../Message/Message.jsx';
import FileUploadMenu from './uploadFile.js'
import Imojis from './imojis.js'
import VoiceRecorder from './recordVoice.js'








export default function Chat() {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const friendsRef = useRef(friends);  // Store the friends value using useRef
    const [chat, setChat] = useState([]);
    const [chatHeader, setChatHeader] = useState(null);
    const [friendId, setFriendId] = useState(null);
    const friendIdRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessageCount, setNewMessageCount] = useState({});


    const token = localStorage.getItem('token');




    const baseUrl = 'http://localhost:5000/';
    const clientIo = io(baseUrl);

    const { id } = jwt_decode(token);

    clientIo.emit('updateSocketId', id);
    clientIo.on('updateSocketId', data => {
        console.log('ppppppppppppppppppppppppppppppppppp');
        console.log(data);
        console.log('ppppppppppppppppppppppppppppppppppp');
    })

    const header = {
        authorization: `kokoz ` + token?.replace(/"/g, '')
    }



    const handleFileUpload = async (file) => {
        // Do something with the uploaded file
        console.log('chat.jsx-----------------');
        console.log(file);
        // setUploadedFile(file);
        try {
            if (friendId && file) {
                const data = await axios.post("http://localhost:5000/chat/", { file, to: friendId }, { headers: { ...header, "Content-Type": "multipart/form-data" } });
                console.log('--------------message-1-------------------');
                console.log(data);
                console.log('-----------------message-2----------------');
                if (data.status === 201) {
                    console.log('SENT YASTA');
                    const newMessage = {
                        chatId: data.data.chatId,
                        message: data.data.message,
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
    };

    // const [loginId, setLoginId] = useState(null)
    // let userId;
    const getIsLogin = () => {
        if (token) {
            setIsLogin(true);
            getUser();
            // setLoginId(id)
            getFriends();
        }
    }


    const getUser = async () => {
        const { data } = await axios('http://localhost:5000/user/', { headers: header });
        console.log('----------------user1------------------');
        console.log(data.user);
        console.log('----------------user2------------------');
        data?.message ? setUser(data.user) : setUser(null);
        // Emit the 'login' event when the user logs in
        clientIo.emit('login', data.user._id);
    }

    // friends start //


    const getFriends = async () => {
        const { data } = await axios('http://localhost:5000/user/getFriends', { headers: header });
        console.log('-------------friends1---------------------');
        console.log(data.friends.friends);
        console.log('--------------friends2--------------------');
        data?.message ? setFriends(data.friends.friends) : setFriends(null);
    }
    // friends end //



    // Chat start //
    const getChat = async (userId) => {
        setIsRecording(false)
        if (userId) {
            setFriendId(userId);
            friendIdRef.current = userId; // Update the ref value
        }
        let friend = friends.find(friend => friend.user._id === userId);
        setChatHeader(friend);
        const { data } = await axios(`http://localhost:5000/chat/${friend.user._id}`, { headers: header });
        console.log('--------------chat--------------------');
        console.log(data.chat);
        console.log('---------------chat-------------------');
        if (data.chat) {
            setChat(data.chat);
            // setMessages(null);  // To clear the message array first
            data.chat.messages.forEach(ele => {
                const newMessage = {
                    message: ele,
                    sender: { image: ele.from.image?.secure_url || userIcon, id: ele.from._id },
                };
                appendMessage(newMessage);
            });
        } else {
            setChat(null);
        }

        // Reset the new message count for the selected friend
        setNewMessageCount((prevCount) => ({
            ...prevCount,
            [userId]: 0,
        }));
    };
    // Chat end //



    const appendMessage = (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    const formRef = useRef(null); // Initialize the ref with null

    useEffect(() => {
        const handleKeyUp = (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                sendMessage();
            }
        };

        if (formRef.current) { // Check if the ref is assigned before adding the event listener
            formRef.current.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            if (formRef.current) { // Check if the ref is assigned before removing the event listener
                formRef.current.removeEventListener('keyup', handleKeyUp);
            }
        };
    }, []);


    const handleImojiSelected = (emoji) => {
        console.log({ emoji });
        const input = document.getElementById('message-input');
        input.value += emoji.emoji;
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default Enter key behavior
            sendMessage();
        }
    };



    // const [voiceMessage, setVoiceMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    const handleRecordingStatusChange = (status) => {
        setIsRecording(status);
    };

    const sendVoice = async (voiceMessage) => {
        // Handle sending the message
        if (voiceMessage) {
            // Send the voice message
            console.log("Sending voice message:", voiceMessage);
            console.log(`Sending message to friend with ID: ${friendId}`);
            // Create a FormData object to send the voice message as multipart/form-data
            const formData = new FormData();
            formData.append("file", voiceMessage);
            formData.append('to', friendId)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...header, // Add any additional headers here
                },
            };
            const data = await axios.post(`http://localhost:5000/chat/`, formData, config);
            console.log('--------------Voice-1-------------------');
            console.log(data);
            console.log('-----------------Voice-2----------------');
            if (data.status === 201) {
                console.log('SENT YASTA');
                const newMessage = {
                    chatId: data.data.chatId,
                    message: data.data.message,
                    sender: { image: user.image?.secure_url || userIcon, id: user._id },
                };
                appendMessage(newMessage);
            }
            else {
                console.log("FAIL YASTA");
            }

            // setVoiceMessage("");
        }
    };

    const handleVoiceMessage = (voiceMessage) => {
        console.log("Received voice message:", voiceMessage);
        // Perform any additional logic or actions with the voice message
        // setVoiceMessage(voiceMessage);
        sendVoice(voiceMessage);

    };




    const sendMessage = async () => {
        try {
            let message = document.getElementById("message-input");
            if (friendId && message) {
                let friend = friends.find(friend => friend.user._id === friendId);
                const content = message.value;
                const newMessage = {
                    message: {
                        content,
                        messageType: "text",
                        from: user,
                        to: friend
                    },
                    sender: { image: user.image?.secure_url || userIcon, id: user._id },
                };
                appendMessage(newMessage);
                document.getElementById("message-input").value = '';

                console.log(`Sending message to friend with ID: ${friendId}`);
                const data = await axios.post(`http://localhost:5000/chat/`, { message: content, to: friendId }, { headers: header });
                console.log('--------------message-1-------------------');
                console.log(data);
                console.log('-----------------message-2----------------');
                if (data.status === 201) {
                    console.log('SENT YASTA');
                    // const newMessage = {
                    //     chatId: data.data.chatId,
                    //     message: data.data.message,
                    //     sender: { image: user.image?.secure_url || userIcon, id: user._id },
                    // };
                    // appendMessage(newMessage);
                }
                else {
                    console.log("FAIL YASTA");
                }
                // clientIo.emit('addMessage', { message: message.value, to: friendId, header })
                // data?.chat ? setChat(data?.chat) : setChat(chat);
            }
        } catch (error) {
            console.log(error)
        }
    }

    function playMessageSound() {
        // Check if the audio is supported and the element exists
        const messageSound = document.getElementById('messageSound');
        if (messageSound && typeof messageSound.play === 'function') {
            messageSound.volume = 0.3;
            messageSound.play();
        }
    }

    // Function to play the notification sound
    function playNotificationSound() {
        const notificationSound = document.getElementById('notificationSound');
        if (notificationSound && typeof notificationSound.play === 'function') {
            notificationSound.volume = 0.3;
            notificationSound.play();
        }
        // Play the sound logic
    }

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

    let isChatActive = true;

    useEffect(() => {
        // const [isChatActive, setIsChatActive] = useState(true);

        getIsLogin();
        // Function to handle visibility change
        function handleVisibilityChange() {
            (document.visibilityState === 'visible') ? isChatActive = true : isChatActive = false;
        }

        // Add event listener for visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run the effect only once


    useEffect(() => {
        const receiveMessageHandler = (data) => {
            console.log('==================receiveMessageHandler=1====================');
            console.log(data);
            console.log('===================receiveMessageHandler=2===================');
            const sender = { image: data.sender.image?.secure_url || userIcon, id: data.sender._id };
            const senderId = sender.id;
            // const newMessage = {
            //     chatId: data.chatId,
            //     message: data.message,
            //     sender,
            // };
            // appendMessage(newMessage);
            // Play the notification sound if the chat with the friend is not currently open
            if (senderId !== friendIdRef.current) {
                playNotificationSound();
                // Increment the new message count for the friend
                setNewMessageCount((prevCount) => ({
                    ...prevCount,
                    [senderId]: (prevCount[senderId] || 0) + 1,
                }));
            }
            else {
                const newMessage = {
                    chatId: data.chatId,
                    message: data.message,
                    sender,
                };
                appendMessage(newMessage);
                playMessageSound();
            }
        };

        clientIo.on('recieveMessage', receiveMessageHandler);

        // Clean up the event listener when the component unmounts
        return () => {
            clientIo.off('recieveMessage', receiveMessageHandler);
        };
    }, []); // The empty dependency array ensures that the effect runs only once

    const changeIsActiveStatus = async (event) => {
        const data = await axios.patch(`http://localhost:5000/user/changeIsActive`, { isActive: event.target.checked }, { headers: header });
        console.log('AWESOME---------------');
        console.log({ data });
        setUser((prevUser) => ({
            ...prevUser,
            isActive: !prevUser.isActive,
        }));
    };



    useEffect(() => {
        const friendOfflineHandler = (friendId) => {
            console.log('friendOfflineHandler=========', friendId);
            friendsRef.current = friendsRef.current.map(friend => {
                if (friend.user._id === friendId) {
                    return {
                        ...friend,
                        status: 'offline'
                    };
                }
                return friend;
            });
        };

        // Listen for the 'friendOffline' event to handle offline status updates
        clientIo.on('friendOffline', friendOfflineHandler);

        // Clean up the event listener when the component unmounts
        return () => {
            clientIo.off('friendOffline', friendOfflineHandler);
        };
    }, []);



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
                            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg" style={{ 'background-color': 'white', border: '1px #1e85d7 solid' }}>
                                {user ?
                                    <>
                                        <div className="h-20 w-20 rounded-full border overflow-hidden image-container">
                                            <img src={user.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full" />
                                        </div>
                                        <div className="text-sm font-semibold mt-2">{user.userName}</div>
                                        <div className="text-xs text-gray-500">Back-End Developer</div>
                                        <div id='status' className="flex flex-row items-center mt-3">
                                            {/* <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                                                <div className="h-3 w-3 bg-white rounded-full self-end mr-1" />
                                            </div> */}
                                            <label className="switch">
                                                <input type="checkbox" checked={user.isActive} onClick={changeIsActiveStatus} />
                                                <span className="slider round" />
                                            </label>
                                            <div className="leading-none ml-1 text-xs">{user.status}</div>
                                        </div>
                                    </>
                                    : ''
                                }
                            </div>
                            <div className="flex flex-col mt-8">
                                {friends.length ?
                                    <>
                                        <div className="flex flex-row items-center justify-between text-xs" >
                                            <span className="font-bold">Active Conversations</span>
                                            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                                                {friends.filter((friend) => friend.place === 'main').length}
                                            </span>
                                        </div>
                                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                                            {friends.map((friend) => (
                                                friend.place === 'main' && (
                                                    <button
                                                        key={friend.user._id}
                                                        onClick={() => getChat(friend.user._id)}
                                                        className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 friend-row ${friend.user._id === friendId ? 'active' : ''}`}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                                                                <img src={friend.user.image?.secure_url || userIcon} alt="Avatar" className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="ml-2 text-sm font-semibold">
                                                                {friend.user.userName} {newMessageCount[friend.user._id] > 0 && (
                                                                    <span className="new-message-count">
                                                                        {newMessageCount[friend.user._id]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                        {friends.some((friend) => friend.place === 'archive') && (
                                            <>
                                                <div className="flex flex-row items-center justify-between text-xs mt-6">
                                                    <span className="font-bold">Archived</span>
                                                    <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                                                        {friends.filter((friend) => friend.place === 'archive').length}
                                                    </span>
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
                                    <div className="py-2 px-3  flex flex-row justify-between items-center" style={{ 'background-color': '#1e85d7' }}>
                                        <div className="flex items-center">
                                            <div className='h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container'>
                                                <img className="w-10 h-10 rounded-full" src={chatHeader.user.image?.secure_url} />
                                            </div>
                                            <div className="ml-4">
                                                <p style={{ display: 'block', color: 'white' }} className="text-grey-darkest">{chatHeader.user.userName}</p>
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
                                        <div className="flex flex-col h-full overflow-x-auto mb-4">
                                            <div className="flex flex-col h-full">
                                                {chat?.messages ? (
                                                    <div id='chatContent' className="grid grid-cols-12 gap-y-2" ref={messageRef}>
                                                        {/* Render existing messages */}
                                                        {messages.map((messageData, index) => (
                                                            <Message index={index} messageData={messageData} key={index} />
                                                        ))}
                                                        <audio id="messageSound" preload="auto">
                                                            <source src={popSound} type="audio/mpeg" />
                                                        </audio>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center items-center h-full">
                                                        <div className="bg-gray-200 p-4 rounded-lg">
                                                            <p className="text-gray-600 text-lg">Say Hi To Start A Chat</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                                            <div>
                                                <FileUploadMenu onFileUpload={handleFileUpload} />
                                            </div>
                                            <div className="flex-grow ml-4">
                                                <div className="relative w-full">
                                                    <form onSubmit={sendMessage}>
                                                        <input
                                                            id="message-input"
                                                            type="text"
                                                            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                    </form>
                                                    <Imojis onImojiSelected={handleImojiSelected} />
                                                </div>
                                            </div>
                                            <div className="_2xy_p _3XKXx">
                                                <VoiceRecorder onVoiceMessage={handleVoiceMessage} />
                                            </div>
                                        </div> */}
                                        <div style={{ position: 'relative', display: 'flex', 'justify-content': 'center' }} className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">

                                            {isRecording ? (
                                                // <div className="relative w-full">
                                                //     {/* <canvas ref={canvasRef} id="recording-canvas" /> */}
                                                //     {/* <canvas ref={canvasRef} width={500} height={200} /> */}
                                                // </div>
                                                ''
                                            ) : (
                                                <>
                                                    <div>
                                                        <FileUploadMenu onFileUpload={handleFileUpload} />
                                                    </div>
                                                    <div className="flex-grow ml-4">
                                                        <div className="relative w-full">
                                                            <form onSubmit={sendMessage}>
                                                                <input
                                                                    id="message-input"
                                                                    type="text"
                                                                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                                                    onKeyDown={handleKeyDown}
                                                                    autoComplete='off'
                                                                />
                                                            </form>
                                                            <Imojis onImojiSelected={handleImojiSelected} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                {/* <VoiceRecorder
                                                    isRecording={isRecording}
                                                    handleVoiceMessage={handleVoiceMessage}
                                                    onRecordingChange={handleRecordingChange}
                                                    setIsRecording={setIsRecording}
                                                // canvasRef={canvasRef}
                                                /> */}

                                                <VoiceRecorder
                                                    handleVoiceMessage={handleVoiceMessage}
                                                    onRecordingStatusChange={handleRecordingStatusChange}
                                                // canvasRef={canvasRef}
                                                />
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
            <audio id="notificationSound" preload="auto">
                <source src={notificationSound} type="audio/mpeg" />
            </audio>



        </>
    )
}



// import {useState, useEffect} from 'react';

// function Sidebar() {
//     const [selectedFriend, setSelectedFriend] = useState(null);
//     const [unreadMessages, setUnreadMessages] = useState({});

//     // Function to handle selecting a friend
//     function handleFriendSelect(friend) {
//         setSelectedFriend(friend);
//     }

//     // Function to handle receiving a message
//     function handleReceiveMessage(message) {
//         // Update the unread messages state
//         setUnreadMessages((prevUnreadMessages) => ({
//             ...prevUnreadMessages,
//             [message.sender]: (prevUnreadMessages[message.sender] || 0) + 1,
//         }));
//     }

//     useEffect(() => {
//         // Add event listener to handle receiving messages
//         socket.on('message', handleReceiveMessage);

//         // Clean up the event listener on component unmount
//         return () => {
//             socket.off('message', handleReceiveMessage);
//         };
//     }, []);

//     return (
//         <div>
//             {/* Render your sidebar with friends */}
//             {friends.map((friend) => (
//                 <div
//                     key={friend.id}
//                     onClick={() => handleFriendSelect(friend)}
//                     className={selectedFriend === friend ? 'selected' : ''}
//                 >
//                     {friend.name}
//                     {unreadMessages[friend.id] > 0 && <span>{unreadMessages[friend.id]}</span>}
//                 </div>
//             ))}
//         </div>
//     );
// }

// function MainContent() {
//     const [currentFriend, setCurrentFriend] = useState(null);

//     useEffect(() => {
//         // Update the current friend when the selectedFriend state changes
//         setCurrentFriend(selectedFriend);
//     }, [selectedFriend]);

//     // ...

//     return (
//         <div>
//             {/* Render the chat interface with the current friend */}
//             {currentFriend && <ChatInterface friend={currentFriend} />}
//         </div>
//     );
// }

// function ChatInterface({ friend }) {
//     const [messages, setMessages] = useState([]);

//     // ...

//     return (
//         <div>
//             {/* Render the messages with the selected friend */}
//             {messages.map((message) => (
//                 <div key={message.id}>{message.content}</div>
//             ))}
//         </div>
//     );
// }





















// <div id="chat-container" className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full">
//                                         <div className="flex flex-col h-full overflow-x-auto mb-4" >
//                                             <div className="flex flex-col h-full">
//                                                 {chat?.messages ?
//                                                     <>
//                                                         <div id='chatContent' className="grid grid-cols-12 gap-y-2" ref={messageRef}>
//                                                             {/* Render existing messages */}
//                                                             {messages.map((messageData, index) => (
//                                                                 <>
//                                                                     <Message index={index} messageData={messageData} />
//                                                                 </>
//                                                             ))}
//                                                             <audio id="messageSound" preload="auto">
//                                                                 <source src={popSound} type="audio/mpeg" />
//                                                             </audio>
//                                                         </div>
//                                                     </>
//                                                     :
//                                                     <div className="flex justify-center items-center h-full">
//                                                         <div className="bg-gray-200 p-4 rounded-lg">
//                                                             <p className="text-gray-600 text-lg">Say Hi To Start A Chat</p>
//                                                         </div>
//                                                     </div>
//                                                 }
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
//                                             <div>
//                                                 <FileUploadMenu onFileUpload={handleFileUpload} />
//                                             </div>
//                                             <div className="flex-grow ml-4">
//                                                 <div className="relative w-full">
//                                                     <input id='message-input' type="text" className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
//                                                     <Imojis onImojiSelected={handleImojiSelected} />
//                                                 </div>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <button onClick={() => sendMessage()} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
//                                                     <span>Send</span>
//                                                     <span className="ml-2">
//                                                         <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                                                         </svg>
//                                                     </span>
//                                                 </button>
//                                             </div>
//                                             <div className="_2xy_p _3XKXx">
//                                                 <VoiceRecorder onVoiceMessage={handleVoiceMessage} />
//                                             </div>
//                                         </div>
//                                     </div>

















































{/* 
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