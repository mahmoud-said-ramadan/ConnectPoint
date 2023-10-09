import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';

function Imojis({ onImojiSelected }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleMenuBtnClick = () => {
        setMenuVisible(!menuVisible);
    };

    const handleEmojiSelection = (emoji) => {
        console.log(emoji.emoji); // Log the selected emoji
        onImojiSelected(emoji); // Call the callback function with the selected emoji
        // setMenuVisible(false); // Hide the emoji menu
    };

    return (
        <div ref={menuRef}>
            <button onClick={handleMenuBtnClick} className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            {menuVisible && (
                <div className="absolute mt-2 right-0 bg-white rounded-lg shadow-lg z-10" style={{ bottom: '40px' }}>
                    <EmojiPicker onEmojiClick={handleEmojiSelection} />
                </div>
            )}
        </div>
    );
}

export default Imojis;