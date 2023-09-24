import React from 'react';
import jwt_decode from "jwt-decode";

const token = localStorage.getItem('token')
const { id } = jwt_decode(token);


const Message = ({ key, messageData }) => {
    return (
        <>
            {messageData.sender.id === id ? (
                <div key={key} className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                        <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                            <img src={messageData.sender.image} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <div className="relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            <div className="text-left">{messageData.message}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                        <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                            <img src={messageData.sender.image} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                            <div className="text-left">{messageData.message}</div>
                        </div>
                    </div>
                </div>
            )}
            {/* <h1>{ message }</h1> */}
        </>
    );
};

export default Message;
