import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';
import { savePin } from '../utils/savePin';

const Pin = ({ pin: { postedBy, image, _id, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const alreadySaved = save?.some(item => item?.postedBy._id === user?.googleId);

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img className='rounded-lg w-full' alt='user post' src={urlFor(image).width(250).url()} />
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: '100%' }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                    onClick={((e) => {
                                        e.stopPropagation();
                                        savePin(_id, save);
                                    })}
                                >
                                    {alreadySaved ? `${(save?.filter(item => item)).length} Saved` : 'Save'}
                                </button>
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {postedBy?._id === user?.googleId && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img
                    className='w-8 h-8 rounded-full object-cover'   
                    src={postedBy?.image} 
                    alt='user-profile'
                />
                <p className='font-medium capitalize'>{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin
