import React, { useState, useRef, useEffect } from "react";

// function FileUploadMenu() {
//     const [menuVisible, setMenuVisible] = useState(false);
//     const fileInputRef = useRef(null);

//     const handleMenuBtnClick = () => {
//         setMenuVisible(!menuVisible);
//     };

//     const handleFileInputChange = (event) => {
//         const fileList = event.target.files;
//         // Handle the selected files
//         console.log(fileList);
//     };

//     const handleImageBtnClick = () => {
//         fileInputRef.current.accept = "image/*";
//         fileInputRef.current.click();
//     };

//     const handleDocBtnClick = () => {
//         fileInputRef.current.accept = "";
//         fileInputRef.current.click();
//     };

//     const handleVideoBtnClick = () => {
//         fileInputRef.current.accept = "video/*";
//         fileInputRef.current.click();
//     };

//     return (
//         <div>
//             <button
//                 className="flex items-center justify-center text-gray-400 hover:text-gray-600"
//                 onClick={handleMenuBtnClick}
//             >
//                 <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                     />
//                 </svg>
//             </button>

//             {menuVisible && (
//                 <div>
//                     <input
//                         type="file"
//                         style={{ display: "none" }}
//                         ref={fileInputRef}
//                         onChange={handleFileInputChange}
//                     />
//                     <button onClick={handleImageBtnClick}>Image</button>
//                     <button onClick={handleDocBtnClick}>Document</button>
//                     <button onClick={handleVideoBtnClick}>Video</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default FileUploadMenu;




// import React, { useState, useRef } from "react";

// function FileUploadMenu() {
//     const [menuVisible, setMenuVisible] = useState(false);
//     const fileInputRef = useRef(null);

//     const handleMenuBtnClick = () => {
//         setMenuVisible(!menuVisible);
//     };

//     const handleFileInputChange = (event) => {
//         const fileList = event.target.files;
//         // Handle the selected files
//         console.log(fileList);
//     };

//     const handleImageBtnClick = () => {
//         fileInputRef.current.accept = "image/*";
//         fileInputRef.current.click();
//     };

//     const handleDocBtnClick = () => {
//         fileInputRef.current.accept = "application/pdf";
//         fileInputRef.current.click();
//     };

//     const handleVideoBtnClick = () => {
//         fileInputRef.current.accept = "video/*";
//         fileInputRef.current.click();
//     };

//     return (
//         <div className="relative">
//             <button
//                 className="flex items-center justify-center text-gray-400 hover:text-gray-600"
//                 onClick={handleMenuBtnClick}
//             >
//                 <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                     />
//                 </svg>
//             </button>

//             {menuVisible && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
//                     <button
//                         className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200"
//                         onClick={handleImageBtnClick}
//                     >
//                         Image
//                     </button>
//                     <button
//                         className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200"
//                         onClick={handleDocBtnClick}
//                     >
//                         Document
//                     </button>
//                     <button
//                         className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200"
//                         onClick={handleVideoBtnClick}
//                     >
//                         Video
//                     </button>
//                     <input
//                         type="file"
//                         className="hidden"
//                         ref={fileInputRef}
//                         onChange={handleFileInputChange}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default FileUploadMenu;




// import React, { useState, useRef } from "react";
import { FiImage, FiFileText, FiVideo } from "react-icons/fi";

function FileUploadMenu({ onFileUpload }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

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

    const handleFileInputChange = (event) => {
        const fileList = event.target.files;
        const selectedFile = fileList[0];
        onFileUpload(selectedFile); // Call the callback function with the selected file
    };

    const handleImageBtnClick = () => {
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.click();
    };

    const handleDocBtnClick = () => {
        fileInputRef.current.accept = ".doc,.docx,.pdf";
        fileInputRef.current.click();
    };

    const handleVideoBtnClick = () => {
        fileInputRef.current.accept = "video/*";
        fileInputRef.current.click();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={handleMenuBtnClick}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                </svg>
            </button>

            {menuVisible && (
                <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg z-10" style={{ bottom: '40px' }}>
                    <button
                        className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        onClick={handleImageBtnClick}
                    >
                        <FiImage className="w-5 h-5 mr-2" />
                        Image
                    </button>
                    <button
                        className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        onClick={handleDocBtnClick}
                    >
                        <FiFileText className="w-5 h-5 mr-2" />
                        Document
                    </button>
                    <button
                        className="block w-full p-2 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        onClick={handleVideoBtnClick}
                    >
                        <FiVideo className="w-5 h-5 mr-2" />
                        Video
                    </button>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                    />
                </div>
            )}
        </div>
    );
}

export default FileUploadMenu;





