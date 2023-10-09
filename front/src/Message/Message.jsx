import React from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import jwt_decode from "jwt-decode";

const token = localStorage.getItem('token')
const { id } = jwt_decode(token);

// getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: newChat._id, message: newMessage, sender: req.user });
// message = {
//     from: req.user._id,
//     to,
//     content: message,
//     messageType,
//     file: req.body.file
// };

const Message = ({ index, messageData }) => {
    console.log(index);
    console.log('0000000000000000000');
    console.log(messageData);
    return (
        <>
            {messageData.sender.id === id ? (
                <div key={index} className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                        <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                            <img src={messageData.sender.image} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <div className="relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            {messageData.message.messageType === 'text' && (
                                <div className="text-left">{messageData.message.content}</div>
                            )}
                            {messageData.message.messageType === 'video' && (
                                <div class="relative w-full">
                                    <video src={messageData.message.file?.secure_url} controls class="w-full rounded-lg shadow-lg"></video>
                                </div>
                            )}
                            {messageData.message.messageType === 'audio' && (
                                <div class="text-left">
                                    <div class="relative">
                                        <div class="absolute top-0 left-0 h-full w-full   rounded-lg"></div>
                                        <audio src={messageData.message.file?.secure_url} controls class=" bg-gradient-to-b from-purple-400 to-pink-500 rounded-lg opacity-50" style={{ backgroundColor: 'transparent', borderRadius: '100px' }}></audio>
                                    </div>
                                </div>
                            )}
                            {messageData.message.messageType === 'image' && (
                                <div className="text-left">
                                    <img src={messageData.message.file?.secure_url} alt="Image" className="w-full" />
                                </div>
                            )}
                            {messageData.message.messageType === 'document' && (
                                <div className="text-left">
                                    {/* <Document
                                        file={messageData.message.file?.secure_url}
                                        error={<div>Failed to load PDF file.</div>}
                                    >
                                        <Page pageNumber={1} width={300} />
                                    </Document>
                                    <a href={messageData.message.file?.secure_url} target="_blank" rel="noopener noreferrer">
                                        View Full PDF
                                    </a> */}


                                    <div className="cm280p3y m3h9lho3 lna84pfr psacz3a6 rku33uoa mmw11n2j">
                                        <div role="button" tabIndex={0} title={`Download &quot; "${messageData.message.file?.originalName}" &quot;`} className="cm280p3y p357zi0d f8m0rgwh elxb2u3l ln8gz9je gfz4du6o r7fjleex gtscxtjd tffp5ko5 l8fojup5 paxyh2gw">
                                            <div className="l8fojup5 paxyh2gw sfeitywo cqsf3vkf rcg4vxlo gfz4du6o r7fjleex aja0x350 ln8gz9je s0eflmyh">
                                                <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd p357zi0d dnb887gk gjuq5ydh i2cterl7 fhf7t426 sap93d0t r15c9g6i lqdozo90 igb3k0ri bavixdlz nntdgyy8"><div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7">
                                                    <div className="sxl192xd hbhfgwk1 fs6hn1up ekdr8vow icon-doc-generic"></div>
                                                </div>
                                                    <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7 g0rxnol2 g3ewzqzm tt8xd2xn mpdn4nr2 spjzgwxb a3oefunm" style={{ flexGrow: 1 }}>
                                                        <div className="gfz4du6o r7fjleex lhj4utae m1c2hokz c32ccnay suguakab aoi073rw">
                                                            <span dir="auto" aria-label className="_11JPr">{messageData.message.file?.originalName}</span>
                                                        </div>
                                                        <div className="e4p1bexh lak21jic ocd2b0bc f9ovudaz aa0kojfi gx1rr48f cr2cog7z sabn9a5k ekmn1tbb hys5s3z0 ktnphmnq hpb4froj tf9oak2v">
                                                            <span data-meta-key="type" className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm" title={messageData.message.file?.format}>{messageData.message.file?.format}</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm tt8xd2xn mw4yctpw mpdn4nr2 qnz2jpws">•</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm" title={messageData.message.file?.size}>{messageData.message.file?.size} kB</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm tt8xd2xn mw4yctpw mpdn4nr2 qnz2jpws">•</span>
                                                        </div>
                                                    </div>
                                                    <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7" style={{ flexGrow: 0, flexShrink: 0 }}>
                                                        <div className="g0rxnol2 p357zi0d kk3akd72 gndfcl4n ac2vgrno tddarlmj jbxl65f1 mnd5airb">
                                                            <span data-icon="audio-download" className>
                                                                <a href={messageData.message.file?.secure_url}>
                                                                    <svg href={messageData.message.file?.secure_url} viewBox="0 0 34 34" height={34} width={34} preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 34 34" xmlSpace="preserve">
                                                                        <path fill="currentColor" d="M17,2c8.3,0,15,6.7,15,15s-6.7,15-15,15S2,25.3,2,17S8.7,2,17,2 M17,1C8.2,1,1,8.2,1,17 s7.2,16,16,16s16-7.2,16-16S25.8,1,17,1L17,1z" />
                                                                        <path fill="currentColor" d="M22.4,17.5h-3.2v-6.8c0-0.4-0.3-0.7-0.7-0.7h-3.2c-0.4,0-0.7,0.3-0.7,0.7v6.8h-3.2 c-0.6,0-0.8,0.4-0.4,0.8l5,5.3c0.5,0.7,1,0.5,1.5,0l5-5.3C23.2,17.8,23,17.5,22.4,17.5z" />
                                                                    </svg>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="lhggkp7q ou6eaia9 qw4steeu">
                                            <div className="gq1t1y46 o38k74y6 e4p1bexh cr2cog7z le5p0ye3 p357zi0d gndfcl4n" role="button">
                                                <span className="l7jjieqr fewfhwl7" dir="auto">4:07 AM</span>
                                                <div className="do8e0lj9 l7jjieqr k6y3xtnu">
                                                    <span aria-label=" Sent " data-icon="msg-check" className>
                                                        <svg viewBox="0 0 12 11" height={11} width={16} preserveAspectRatio="xMidYMid meet" className fill="none">
                                                            <path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                        <div className="h-8 w-8 bg-indigo-200 rounded-full overflow-hidden image-container">
                            <img src={messageData.sender.image} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <div className="relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            {messageData.message.messageType === 'text' && (
                                <div className="text-left">{messageData.message.content}</div>
                            )}
                            {messageData.message.messageType === 'video' && (
                                <div class="relative w-full">
                                    <video src={messageData.message.file?.secure_url} controls class="w-full rounded-lg shadow-lg"></video>
                                </div>
                            )}
                            {messageData.message.messageType === 'audio' && (
                                <div class="text-left">
                                    <div class="relative">
                                        <div class="absolute top-0 left-0 h-full w-full   rounded-lg"></div>
                                        <audio src={messageData.message.file?.secure_url} controls class=" bg-gradient-to-b from-purple-400 to-pink-500 rounded-lg opacity-50" style={{ backgroundColor: 'transparent', borderRadius: '100px' }}></audio>
                                    </div>
                                </div>
                            )}
                            {messageData.message.messageType === 'image' && (
                                <div className="text-left">
                                    <img src={messageData.message.file?.secure_url} alt="Image" className="w-full" />
                                </div>
                            )}
                            {messageData.message.messageType === 'document' && (
                                <div className="text-left">
                                    {/* <Document
                                        file={messageData.message.file?.secure_url}
                                        error={<div>Failed to load PDF file.</div>}
                                    >
                                        <Page pageNumber={1} width={300} />
                                    </Document>
                                    <a href={messageData.message.file?.secure_url} target="_blank" rel="noopener noreferrer">
                                        View Full PDF
                                    </a> */}


                                    <div className="cm280p3y m3h9lho3 lna84pfr psacz3a6 rku33uoa mmw11n2j">
                                        <div role="button" tabIndex={0} title={`Download &quot; "${messageData.message.file?.originalName}" &quot;`} className="cm280p3y p357zi0d f8m0rgwh elxb2u3l ln8gz9je gfz4du6o r7fjleex gtscxtjd tffp5ko5 l8fojup5 paxyh2gw">
                                            <div className="l8fojup5 paxyh2gw sfeitywo cqsf3vkf rcg4vxlo gfz4du6o r7fjleex aja0x350 ln8gz9je s0eflmyh">
                                                <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd p357zi0d dnb887gk gjuq5ydh i2cterl7 fhf7t426 sap93d0t r15c9g6i lqdozo90 igb3k0ri bavixdlz nntdgyy8"><div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7">
                                                    <div className="sxl192xd hbhfgwk1 fs6hn1up ekdr8vow icon-doc-generic"></div>
                                                </div>
                                                    <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7 g0rxnol2 g3ewzqzm tt8xd2xn mpdn4nr2 spjzgwxb a3oefunm" style={{ flexGrow: 1 }}>
                                                        <div className="gfz4du6o r7fjleex lhj4utae m1c2hokz c32ccnay suguakab aoi073rw">
                                                            <span dir="auto" aria-label className="_11JPr">{messageData.message.file?.originalName}</span>
                                                        </div>
                                                        <div className="e4p1bexh lak21jic ocd2b0bc f9ovudaz aa0kojfi gx1rr48f cr2cog7z sabn9a5k ekmn1tbb hys5s3z0 ktnphmnq hpb4froj tf9oak2v">
                                                            <span data-meta-key="type" className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm" title={messageData.message.file?.format}>{messageData.message.file?.format}</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm tt8xd2xn mw4yctpw mpdn4nr2 qnz2jpws">•</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm" title={messageData.message.file?.size}>{messageData.message.file?.size} kB</span>
                                                            <span className="l7jjieqr gfz4du6o r7fjleex lhj4utae le5p0ye3 p8zrgzvm tt8xd2xn mw4yctpw mpdn4nr2 qnz2jpws">•</span>
                                                        </div>
                                                    </div>
                                                    <div className="tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7" style={{ flexGrow: 0, flexShrink: 0 }}>
                                                        <div className="g0rxnol2 p357zi0d kk3akd72 gndfcl4n ac2vgrno tddarlmj jbxl65f1 mnd5airb">
                                                            <span data-icon="audio-download" className>
                                                                <a href={messageData.message.file?.secure_url}>
                                                                    <svg href={messageData.message.file?.secure_url} viewBox="0 0 34 34" height={34} width={34} preserveAspectRatio="xMidYMid meet" className version="1.1" x="0px" y="0px" enableBackground="new 0 0 34 34" xmlSpace="preserve">
                                                                        <path fill="currentColor" d="M17,2c8.3,0,15,6.7,15,15s-6.7,15-15,15S2,25.3,2,17S8.7,2,17,2 M17,1C8.2,1,1,8.2,1,17 s7.2,16,16,16s16-7.2,16-16S25.8,1,17,1L17,1z" />
                                                                        <path fill="currentColor" d="M22.4,17.5h-3.2v-6.8c0-0.4-0.3-0.7-0.7-0.7h-3.2c-0.4,0-0.7,0.3-0.7,0.7v6.8h-3.2 c-0.6,0-0.8,0.4-0.4,0.8l5,5.3c0.5,0.7,1,0.5,1.5,0l5-5.3C23.2,17.8,23,17.5,22.4,17.5z" />
                                                                    </svg>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="lhggkp7q ou6eaia9 qw4steeu">
                                            <div className="gq1t1y46 o38k74y6 e4p1bexh cr2cog7z le5p0ye3 p357zi0d gndfcl4n" role="button">
                                                <span className="l7jjieqr fewfhwl7" dir="auto">4:07 AM</span>
                                                <div className="do8e0lj9 l7jjieqr k6y3xtnu">
                                                    <span aria-label=" Sent " data-icon="msg-check" className>
                                                        <svg viewBox="0 0 12 11" height={11} width={16} preserveAspectRatio="xMidYMid meet" className fill="none">
                                                            <path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Message;