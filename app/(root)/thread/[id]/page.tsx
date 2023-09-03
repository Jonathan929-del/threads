// Imports
import React from 'react';
import {redirect} from 'next/navigation';
import {currentUser} from '@clerk/nextjs';
import Comment from '@/components/forms/Comment';
import {fetchUser} from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/ThreadCard';
import {fetchThreadById} from '@/lib/actions/thread.actions';



// Main function
const Page = async ({params}:{params:{id:string}}) => {


    // Id and user check
    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');


    // Fetching thread
    const thread = await fetchThreadById(params.id);


    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ''}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className='mt-7'>
                <Comment
                    threadId={thread.id}
                    currentUserId={JSON.stringify(userInfo._id)}
                    currentUserImg={userInfo.image}
                />
            </div>

            <div className='mt-10'>
                {thread.children.length > 0 && thread.children.map((child:any) => (
                    <ThreadCard
                        key={child._id}
                        id={child._id}
                        currentUserId={user?.id || ''}
                        parentId={child.parentId}
                        content={child.text}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
};



// Export
export default Page;