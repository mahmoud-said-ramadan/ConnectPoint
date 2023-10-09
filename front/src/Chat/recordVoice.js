// import React, { useState, useEffect, useRef } from "react";

// function VoiceRecorder({ isRecording, handleVoiceMessage, canvasRef }) {
//     const [recording, setRecording] = useState(false);
//     const [paused, setPaused] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [mediaStream, setMediaStream] = useState(null);
//     // canvasRef = useRef(null);

//     useEffect(() => {
//         if (canvasRef.current) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext("2d");

//             if (ctx) {
//                 const drawRecordingLine = () => {
//                     // Your drawRecordingLine function code goes here
//                     // Make sure to use the `canvas` and `ctx` variables
//                 };

//                 if (ctx) { 
//                     // Example: Draw a red rectangle on the canvas
//                 ctx.fillStyle = "red";
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);

//                 // Call the drawRecordingLine function
//                 drawRecordingLine();
//                 }

//             }
//         }
//     }, [canvasRef]);


//     const handleRecordClick = () => {
//         if (!recording && !paused) {
//             startRecording();
//         } else if (recording && !paused) {
//             pauseRecording();
//         } else {
//             resumeRecording();
//         }
//     };

//     const startRecording = () => {
//         navigator.mediaDevices
//             .getUserMedia({ audio: true })
//             .then((stream) => {
//                 const chunks = [];
//                 const recorder = new MediaRecorder(stream);

//                 recorder.addEventListener("dataavailable", (event) => {
//                     if (event.data.size > 0) {
//                         chunks.push(event.data);
//                         drawRecordingLine();
//                     }
//                 });

//                 recorder.addEventListener("stop", () => {
//                     const blob = new Blob(chunks, { type: "audio/webm" });
//                     sendVoiceMessage(blob);
//                 });

//                 setMediaRecorder(recorder);
//                 setMediaStream(stream);
//                 recorder.start();
//                 setRecording(true);
//             })
//             .catch((error) => {
//                 console.error("Error accessing microphone:", error);
//             });
//     };

//     const drawRecordingLine = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

//         const audioChunks = mediaRecorder ? mediaRecorder.stream.getAudioTracks()[0].getSettings().channelCount : 1;
//         const canvasHeight = canvas.height;
//         const canvasWidth = canvas.width;

//         // Create an AudioContext instance
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//         // Create an AnalyserNode
//         const analyser = audioContext.createAnalyser();

//         // Connect the AnalyserNode to the audio source
//         const source = audioContext.createMediaStreamSource(mediaRecorder.stream);
//         source.connect(analyser);

//         // Set the properties of the AnalyserNode
//         analyser.fftSize = 2048;
//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         const barWidth = canvasWidth / bufferLength;


//         const draw = () => {
//             const drawVisual = requestAnimationFrame(draw);

//             if (mediaRecorder && mediaRecorder.state === "recording") {
//                 const channelCount = mediaRecorder.stream.getAudioTracks()[0].getSettings().channelCount;

//                 const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
//                 gradient.addColorStop(0, "red");
//                 gradient.addColorStop(1, "yellow");
//                 ctx.fillStyle = gradient;

//                 mediaRecorder.stream.getAudioTracks()[0].getSettings();

//                 analyser.getByteFrequencyData(dataArray);

//                 ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//                 for (let i = 0; i < bufferLength; i++) {
//                     const barHeight = dataArray[i] * (canvasHeight / 255);
//                     const x = i * barWidth;
//                     const y = canvasHeight - barHeight;
//                     ctx.fillRect(x, y, barWidth, barHeight);
//                 }
//             } else {
//                 cancelAnimationFrame(drawVisual);
//             }
//         };

//         draw();
//     };

//     const pauseRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.pause();
//             setPaused(true);
//         }
//     };

//     const resumeRecording = () => {
//         if (mediaRecorder && mediaRecorder.state === "paused") {
//             mediaRecorder.resume();
//             setPaused(false);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             mediaStream.getTracks().forEach((track) => track.stop());
//             setRecording(false);
//             setPaused(false);
//             setMediaRecorder(null);
//             setMediaStream(null);
//         }

//     };

//     const sendVoiceMessage = (blob) => {
//         handleVoiceMessage(blob);
//     };




//     return (
//         <div className="_2xy_p _3XKXx">
//             <button
//                 className={`svlsagor qssinsw9 lniyxyh2 p357zi0d ac2vgrno gndfcl4n ${recording ? "recording" : ""
//                     }`}
//                 aria-label="Voice message"
//                 data-tab={11}
//                 fdprocessedid="m7mhca"
//                 onClick={handleRecordClick}
//             >
//                 <span data-icon="ptt">
//                     {recording && !paused ? (
//                         <>
//                             {/* Pause Icon */}
//                             <svg
//                                 viewBox="0 0 24 24"
//                                 height={24}
//                                 width={24}
//                                 preserveAspectRatio="xMidYMid meet"
//                                 className="pause-icon text-red-500"
//                                 version="1.1"
//                                 x="0px"
//                                 y="0px"
//                                 enableBackground="new 0 0 24 24"
//                                 xmlSpace="preserve"
//                             >
//                                 <rect x="6" y="4" width="4" height="16" className="fill-current" />
//                                 <rect x="14" y="4" width="4" height="16" className="fill-current" />
//                             </svg>
//                             {/* Pause Label */}
//                             <span>Pause</span>
//                         </>
//                     ) : (
//                         <>
//                             {/* Record Icon */}
//                             <svg
//                                 viewBox="0 0 24 24"
//                                 height={24}
//                                 width={24}
//                                 preserveAspectRatio="xMidYMid meet"
//                                 className="recording"
//                                 version="1.1"
//                                 x="0px"
//                                 y="0px"
//                                 enableBackground="new 0 0 24 24"
//                                 xmlSpace="preserve"
//                             >
//                                 <path
//                                     fill="currentColor"
//                                     d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z"
//                                 />
//                             </svg>
//                             {/* Record Label */}
//                             <span>Record</span>
//                         </>
//                     )}
//                 </span>
//             </button>

//             {recording && (
//                 <button
//                     className="svlsagor qssinsw9 lniyxyh2 p357zi0d ac2vgrno gndfcl4n"
//                     aria-label="Send voice message"
//                     data-tab={11}
//                     fdprocessedid="m7mhca"
//                     onClick={stopRecording}
//                 >
//                     <span data-icon="ptt">
//                         {/* Send Icon */}
//                         <svg
//                             viewBox="0 0 24 24"
//                             height={24}
//                             width={24}
//                             preserveAspectRatio="xMidYMid meet"
//                             version="1.1"
//                             x="0px"
//                             y="0px"
//                             enableBackground="new 0 0 24 24"
//                             xmlSpace="preserve"
//                         >
//                             <path
//                                 fill="currentColor"
//                                 d="M6,6H18V18H6V6Z"
//                             />
//                         </svg>
//                         {/* Send Label */}
//                         {/* <span>Send</span> */}
//                     </span>
//                 </button>
//             )}
//         </div>
//     );
// }

// export default VoiceRecorder;



// import React, { useState, useEffect, useRef } from "react";

// function VoiceRecorder({ isRecording, onRecordingChange, setIsRecording, handleVoiceMessage }) {
//     const [recording, setRecording] = useState(false);
//     const [paused, setPaused] = useState(false);
//     const [mediaRecorder, setMediaRecorder] = useState(null);
//     const [mediaStream, setMediaStream] = useState(null);
//     const [analyserNode, setAnalyserNode] = useState(null);
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         onRecordingChange(isRecording);
//     }, [isRecording]);

//     useEffect(() => {
//         if (canvasRef.current) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext("2d");

//             if (ctx) {
//                 // Example: Draw a red rectangle on the canvas
//                 ctx.fillStyle = "transparent";
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     }, []);

//     useEffect(() => {
//         if (recording && !paused) {
//             requestAnimationFrame(drawRecordingLine);
//         }
//     });

//     const handleRecordClick = () => {
//         if (!recording && !paused) {
//             startRecording();
//         } else if (recording && !paused) {
//             pauseRecording();
//         } else {
//             resumeRecording();
//         }
//     };

//     const startRecording = () => {
//         setIsRecording(true);
//         navigator.mediaDevices
//             .getUserMedia({ audio: true })
//             .then((stream) => {
//                 const chunks = [];
//                 const recorder = new MediaRecorder(stream);

//                 recorder.addEventListener("dataavailable", (event) => {
//                     if (event.data.size > 0) {
//                         chunks.push(event.data);
//                     }
//                 });

//                 recorder.addEventListener("stop", () => {
//                     const blob = new Blob(chunks, { type: "audio/webm" });
//                     sendVoiceMessage(blob);
//                 });

//                 const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//                 const analyser = audioContext.createAnalyser();
//                 const source = audioContext.createMediaStreamSource(stream);
//                 source.connect(analyser);

//                 setMediaRecorder(recorder);
//                 setMediaStream(stream);
//                 setAnalyserNode(analyser);
//                 recorder.start();
//                 setRecording(true);
//             })
//             .catch((error) => {
//                 console.error("Error accessing microphone:", error);
//             });
//     };

// const drawRecordingLine = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const canvasHeight = canvas.height;
//     const canvasWidth = canvas.width;

//     if (analyserNode && mediaStream) {
//         const bufferLength = analyserNode.fftSize;
//         const dataArray = new Uint8Array(bufferLength);

//         analyserNode.getByteTimeDomainData(dataArray);

//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//         const lineWidth = 2;
//         const lineSpacing = 2;
//         const numLines = Math.floor(canvasWidth / (lineWidth + lineSpacing));

//         const topHeight = canvasHeight / 2; // Height of the wave from the top
//         const bottomHeight = canvasHeight / 2; // Height of the wave from the bottom
//         const heightMultiplier = 0.1; // Adjust this value to change the height multiplier

//         for (let i = 0; i < numLines; i++) {
//             const dataIndex = Math.floor((dataArray.length * i) / numLines);
//             const amplitude = (dataArray[dataIndex] / 128.0) * (canvasHeight / 2);
//             const x = i * (lineWidth + lineSpacing);
//             const topWaveHeight = topHeight - amplitude * heightMultiplier;
//             const bottomWaveHeight = bottomHeight + amplitude * heightMultiplier;

//             ctx.beginPath();
//             ctx.moveTo(x, topWaveHeight);
//             ctx.lineTo(x, bottomWaveHeight);

//             ctx.strokeStyle = "blue"; // Change brush color when volume is below the threshold


//             ctx.lineWidth = lineWidth;
//             ctx.stroke();
//         }
//     }

//     if (recording && !paused) {
//         setTimeout(() => {
//             requestAnimationFrame(drawRecordingLine);
//         }, 100);
//     }
// };






//     const drawRecordingLine = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         const canvasHeight = canvas.height;
//         const canvasWidth = canvas.width;

//         if (analyserNode && mediaStream) {
//             const bufferLength = analyserNode.fftSize;
//             const dataArray = new Uint8Array(bufferLength);

//             analyserNode.getByteTimeDomainData(dataArray);

//             ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//             const lineWidth = 2;
//             const lineSpacing = 2;
//             const numLines = Math.floor(canvasWidth / (lineWidth + lineSpacing));
//             const topHeight = canvasHeight * 0.7; // Height of the wave from the top
//             const bottomHeight = canvasHeight * 0.3; // Height of the wave from the bottom
//             const heightMultiplier = 0.6; // Adjust this value to change the height multiplier

//             for (let i = 0; i < numLines; i++) {
//                 const dataIndex = Math.floor((dataArray.length * i) / numLines);
//                 const amplitude = (dataArray[dataIndex] / 128.0) * (canvasHeight / 2);
//                 const x = i * (lineWidth + lineSpacing);
//                 // const topWaveHeight = canvasHeight / 2 - amplitude * heightMultiplier;
//                 // const bottomWaveHeight = canvasHeight / 2 + amplitude * heightMultiplier;
//                 const topWaveHeight = topHeight - amplitude * heightMultiplier;
//                 const bottomWaveHeight = bottomHeight + amplitude * heightMultiplier;
//                 ctx.beginPath();
//                 ctx.moveTo(x, topWaveHeight);
//                 ctx.lineTo(x, bottomWaveHeight);

//                 ctx.strokeStyle = "blue";
//                 ctx.lineWidth = lineWidth;
//                 ctx.stroke();
//             }
//         }

//         // if (recording && !paused) {
//         //     requestAnimationFrame(drawRecordingLine);
//         // }
//         if (recording && !paused) {
//             setTimeout(() => {
//                 requestAnimationFrame(drawRecordingLine);
//             }, 100);
//         }
//     };



//     const [blob, setBlob] = useState(null);

//     const handleDataAvailable = (event) => {
//         if (event.data.size > 0) {
//             const newBlob = new Blob([event.data], { type: 'audio/webm' });
//             setBlob(newBlob);
//         }
//     };

//     const sendVoiceMessage = () => {
//         if (blob) {
//             // Your logic for sending the voice blob
//             console.log('Sending voice message:', blob);
//             handleVoiceMessage(blob);
//         }
//     };




//     const pauseRecording = () => {
//         if (mediaRecorder) {
//             mediaRecorder.pause();
//             setPaused(true);
//         }
//     };

//     const resumeRecording = () => {
//         if (mediaRecorder && mediaRecorder.state === "paused") {
//             mediaRecorder.resume();
//             setPaused(false);
//             requestAnimationFrame(drawRecordingLine);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorder) {
//             setIsRecording(false);
//             mediaRecorder.stop();
//             mediaStream.getTracks().forEach((track) => track.stop());
//             analyserNode.disconnect();
//             setRecording(false);
//             setPaused(false);
//             setMediaRecorder(null);
//             setMediaStream(null);
//             setAnalyserNode(null);
//         }
//     };



//     return (
//         <div className="_2xy_p _3XKXx">
//             {recording ?
//                 <>
//                     <button
//                         className={`svlsagor qssinsw9 lniyxyh2 p357zi ${recording ? "" : "qHi2S"}`}
//                         onClick={stopRecording}
//                         disabled={!recording}
//                         style={{ width: '20px', height: '20px', width: '20px', height: '20px', margin: '-10px 10px 0px' }}
//                     >
//                         'remove'
//                     </button>
//                     <canvas ref={canvasRef} width={300} height={46} style={{ display: 'inline-block' }} />
//                     <button
//                         className={`svlsagor qssinsw9 lniyxyh2 p357zi ${recording ? (paused ? "NmB2p" : "sRcHc") : "qHi2S"
//                             }`}
//                         onClick={handleRecordClick}
//                         style={{ width: '35px', height: '35px', padding: '4px' }}
//                     >
//                         {recording ?
//                             (
//                                 paused ?

//                                     'continue'
//                                     :
//                                     'pause'
//                             )
//                             :
//                             ''
//                         }
//                     </button>
//                     <button
//                         className={`svlsagor qssinsw9 lniyxyh2 p357zi ${recording ? "" : "qHi2S"}`}
//                         id="send"
//                         style={{ width: '30px', height: '30px' }}
//                         onClick={sendVoiceMessage}

//                     >
//                         'send'
//                     </button>
//                 </>
//                 :
//                 <button
//                     className={`svlsagor qssinsw9 lniyxyh2 p357zi ${recording ? (paused ? "NmB2p" : "sRcHc") : "qHi2S"
//                         }`}
//                     onClick={handleRecordClick}
//                     style={{ width: '35px', height: '35px' }}
//                 >
//                     'record'
//                 </button>
//             }
//         </div>
//     );
// }

// export default VoiceRecorder;







//remove
//<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" className="i0x3nve6"><path d="M5,0,3,2H0V4H16V2H13L11,0ZM15,5H1V19.5A2.5,2.5,0,0,0,3.5,22h9A2.5,2.5,0,0,0,15,19.5Z" fill="currentColor" /></svg>



// continue
// <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24" xmlSpace="preserve">
//<path fill="red" d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z" />
//</svg>


// pause
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//     <rect x="6" y="4" width="4" height="16" />
//     <rect x="14" y="4" width="4" height="16" />
// </svg>


//send
//<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" className><path d="M17.5,0h0A17.51,17.51,0,0,1,35,17.5h0A17.51,17.51,0,0,1,17.5,35h0A17.51,17.51,0,0,1,0,17.5H0A17.51,17.51,0,0,1,17.5,0Z" fill="currentColor" /><path className="iwt3stqw s79hpmcy ksz6vod1" d="M25.64,18.55,11.2,24.93a.86.86,0,0,1-1.13-.44.83.83,0,0,1-.06-.44l.48-4.11a1.36,1.36,0,0,1,1.24-1.19l7.51-.6a.16.16,0,0,0,.14-.16.16.16,0,0,0-.14-.14l-7.51-.6a1.36,1.36,0,0,1-1.24-1.19L10,12a.84.84,0,0,1,.74-.94.87.87,0,0,1,.45.06l14.44,6.38a.61.61,0,0,1,.31.79A.59.59,0,0,1,25.64,18.55Z" fill="#fff" /></svg>

//record
//<svg viewBox="0 0 24 24" height={24} width={24} preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24" xmlSpace="preserve"><path fill="currentColor" d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z" /></svg>







import React, { useState, useEffect, useRef } from "react";

const VoiceRecorder = ({
    handleVoiceMessage,
    onRecordingStatusChange
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [analyserNode, setAnalyserNode] = useState(null);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");

            if (canvasContext) {
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [canvasRef]);


    // const handleRecordClick = async () => {
    //     if (!isRecording) {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //             const mediaRecorderInstance = new MediaRecorder(stream);
    //             const audioContext = new AudioContext();
    //             const analyser = audioContext.createAnalyser();
    //             const source = audioContext.createMediaStreamSource(stream);
    //             source.connect(analyser);
    //             setAnalyserNode(analyser);

    //             setMediaStream(stream);
    //             setMediaRecorder(mediaRecorderInstance);

    //             const chunks = [];
    //             mediaRecorderInstance.ondataavailable = (event) => {
    //                 handleDataAvailable(event);
    //             };

    //             mediaRecorderInstance.onstop = (event) => {
    //                 const blob = new Blob(chunks, { type: "audio/webm" });
    //                 setRecordedBlob(blob);
    //                 // handleVoiceMessage(blob);
    //             };

    //             startRecording();
    //         } catch (error) {
    //             console.error("Error accessing media devices:", error);
    //         }
    //     } else {
    //         if (isPaused) {
    //             resumeRecording();
    //         } else {
    //             pauseRecording();
    //         }
    //     }
    // };



    const handleRecordClick = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorderInstance = new MediaRecorder(stream);
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                setAnalyserNode(analyser);

                setMediaStream(stream);
                setMediaRecorder(mediaRecorderInstance);

                const chunks = [];
                mediaRecorderInstance.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                mediaRecorderInstance.onstop = () => {
                    const blob = new Blob(chunks, { type: "audio/webm" });
                    setRecordedBlob(blob);
                    handleVoiceMessage(blob);
                };

                mediaRecorderInstance.start();
                setIsRecording(true);
                onRecordingStatusChange(true);
                setIsPaused(false);

            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        } else {
            if (isPaused) {
                resumeRecording();
            } else {
                pauseRecording();
            }
        }
    };

    const startRecording = () => {
        mediaRecorder.start();
        setIsRecording(true);
        onRecordingStatusChange(true);
        setIsPaused(false);
    };


    useEffect(() => {
        if (isRecording && canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");

            // Add null check here
            if (canvasContext) {
                const WIDTH = canvas.width;
                const HEIGHT = canvas.height;

                const drawRecordingLine = () => {
                    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
                    analyserNode.getByteTimeDomainData(dataArray);

                    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
                    canvasContext.fillStyle = "rgba(0, 0, 0, 0.2)";
                    canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

                    canvasContext.lineWidth = 2;
                    canvasContext.strokeStyle = "rgb(255, 255, 255)";
                    canvasContext.beginPath();

                    const sliceWidth = (WIDTH * 1.0) / dataArray.length;
                    let x = 0;

                    for (let i = 0; i < dataArray.length; i++) {
                        const v = dataArray[i] / 128.0;
                        const y = (v * HEIGHT) / 2;

                        if (i === 0) {
                            canvasContext.moveTo(x, y);
                        } else {
                            canvasContext.lineTo(x, y);
                        }

                        x += sliceWidth;
                    }

                    canvasContext.lineTo(canvas.width, canvas.height / 2);
                    canvasContext.stroke();

                    if (isRecording && !isPaused) {
                        requestAnimationFrame(drawRecordingLine);
                    }
                };
                if (isRecording && !isPaused) {
                    drawRecordingLine();
                }
                
            }
        }
    }, [isRecording, isPaused, canvasRef]);

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            const chunks = [event.data];
            const blob = new Blob(chunks, { type: "audio/webm" });
            setRecordedBlob(blob);
        }
    };

    // const sendVoiceMessage = () => {
    //     // handleSendRecording();
    //     // setIsRecording(false);
    //     // setIsPaused(false);


    //     if (recordedBlob) {
    //         const voiceMessage = {
    //             type: "voice",
    //             blob: recordedBlob,
    //         };

    //         // Call a function in the parent component (Chat) to handle the voice message
    //         handleVoiceMessage(voiceMessage);
    //     }


    // };


    // const sendVoiceMessage = () => {
    //     console.log('ppppppppppppppppppppppppppppppppppp');
    //     if (!recordedBlob) {
    //         return;
    //     }

    //     const voiceMessage = {
    //         type: "voice",
    //         blob: recordedBlob,
    //     };

    //     handleVoiceMessage(voiceMessage); // Call the handleVoiceMessage function from the prop

    // };



    const pauseRecording = () => {
        mediaRecorder.pause();
        setIsPaused(true);
    };

    const resumeRecording = () => {
        mediaRecorder.resume();
        setIsPaused(false);
    };

    const stopRecording = () => {
        mediaRecorder.stop();
        // sendVoiceMessage();
        removeRecorded();
    };

    const removeRecorded = () => {
        setRecordedBlob(null);
        onRecordingStatusChange(false);
        setIsRecording(false);
        setIsPaused(false);
    };

    return (
        <div className="_2xy_p _3XKXx" style={{ display: 'flex', 'justify-content': 'center', 'align-items': 'center' }}>
            {isRecording ? (
                <>
                    <button
                        className={`svlsagor qssinsw9 lniyxyh2 p357zi ${isRecording ? "" : "qHi2S"
                            }`}
                        onClick={removeRecorded}
                        // disabled={!isRecording}
                        style={{ width: "20px", height: "20px", width: "20px", height: "20px", margin: "-10px 10px 0px" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22" className="i0x3nve6"><path d="M5,0,3,2H0V4H16V2H13L11,0ZM15,5H1V19.5A2.5,2.5,0,0,0,3.5,22h9A2.5,2.5,0,0,0,15,19.5Z" fill="currentColor" /></svg>
                    </button>

                    <canvas ref={canvasRef} width={300} height={46} style={{ display: 'inline-block' }} />

                    <button
                        className={`svlsagor qssinsw9 lniyxyh2 p357zi ${isRecording ? (isPaused ? "NmB2p" : "sRcHc") : "qHi2S"
                            }`}
                        onClick={handleRecordClick}
                        style={{ width: "35px", height: "35px", padding: "4px" }}
                    >
                        {isRecording ? (isPaused ?
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24" xmlSpace="preserve">
                                <path fill="red" d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : ''}
                    </button>
                    <button
                        className={`svlsagor qssinsw9 lniyxyh2 p357zi ${isRecording ? "" : "qHi2S"}`}
                        id="send"
                        style={{ width: "30px", height: "30px" }}
                        onClick={stopRecording}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" className><path d="M17.5,0h0A17.51,17.51,0,0,1,35,17.5h0A17.51,17.51,0,0,1,17.5,35h0A17.51,17.51,0,0,1,0,17.5H0A17.51,17.51,0,0,1,17.5,0Z" fill="currentColor" /><path className="iwt3stqw s79hpmcy ksz6vod1" d="M25.64,18.55,11.2,24.93a.86.86,0,0,1-1.13-.44.83.83,0,0,1-.06-.44l.48-4.11a1.36,1.36,0,0,1,1.24-1.19l7.51-.6a.16.16,0,0,0,.14-.16.16.16,0,0,0-.14-.14l-7.51-.6a1.36,1.36,0,0,1-1.24-1.19L10,12a.84.84,0,0,1,.74-.94.87.87,0,0,1,.45.06l14.44,6.38a.61.61,0,0,1,.31.79A.59.59,0,0,1,25.64,18.55Z" fill="#fff" /></svg>
                    </button>
                </>
            ) : (
                <button
                    className={`svlsagor qssinsw9 lniyxyh2 p357zi ${isRecording ? (isPaused ? "NmB2p" : "sRcHc") : "qHi2S"
                        }`}
                    onClick={handleRecordClick}
                    style={{ width: "35px", height: "35px" }}
                >
                    <svg viewBox="0 0 24 24" height={24} width={24} preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24" xmlSpace="preserve"><path fill="currentColor" d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z" /></svg>
                </button>
            )}
        </div>
    );
};

export default VoiceRecorder;