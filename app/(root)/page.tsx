// Imports
import React from 'react';
import {currentUser} from '@clerk/nextjs';
import ThreadCard from '@/components/cards/ThreadCard';
import {fetchThreads} from '@/lib/actions/thread.actions';



// Main function
const Home = async () => {


  // Fetching current user
  const user = await currentUser();


  // Fetching posts
  const threads = await fetchThreads(1, 30);


  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {threads.threads.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {
              threads.threads.map(thread => (
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
              ))
            }
          </>
        )}
      </section>
    </>
  );
};



// Export
export default Home;