// Imports
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';



// Params interface
interface Params{
    id:string;
    currentUserId:string;
    parentId:string | null;
    content:string;
    author:{
        name:string;
        image:string;
        id:string;
    };
    community:{
        name:string;
        image:string;
        id:string;
    } | null;
    createdAt:string;
    comments:{
        author:{
            image:string;
        };
    }[];
    isComment?:boolean;
};



// Main function
const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}:Params) => {
    return (
        <article className={`flex flex-col w-full rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className='flex items-start justify-between'>
                <div className='flex flex-row flex-1 w-full gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link
                            href={`/profile/${author.id}`}
                            className='relative w-11 h-11'
                        >
                            <Image
                                src={author.image}
                                alt='Profile image'
                                className='cursor-pointer rounded-full'
                                fill
                            />
                        </Link>
                        <div className='thread-card_bar'/>
                    </div>
                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {author.name}
                            </h4>
                        </Link>
                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                <Image
                                    src='/assets/heart-gray.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='reply'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain'
                                    />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='repost'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Image
                                    src='/assets/share.svg'
                                    alt='share'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className='mt-1 text-subtle-medium test-gray-1'>
                                        {comments.length} replies
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};



// Export
export default ThreadCard;