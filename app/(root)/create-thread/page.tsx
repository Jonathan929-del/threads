// Imports
import React from 'react';
import {redirect} from 'next/navigation';
import {currentUser} from '@clerk/nextjs';
import {fetchUser} from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';


// Main function
const Page = async () => {

    // Fetching user
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');


    return (
        <>
            <h1 className='head-text'>Create thread</h1>
            <PostThread userId={userInfo._id}/>
        </>
    );
};



// Export
export default Page;