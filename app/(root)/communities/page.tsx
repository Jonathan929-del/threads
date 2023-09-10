// Imports
import {redirect} from 'next/navigation';
import {currentUser} from '@clerk/nextjs';
import {fetchUser} from '@/lib/actions/user.actions';
import {fetchCommunities} from '@/lib/actions/community.actions';
import CommunityCard from '@/components/cards/CommunityCard';



// Main function
const Page = async () => {


    // Checking if user is onboarded
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');


    // Fetching communities
    const result = await fetchCommunities({
        searchString:'',
        pageNumber:1,
        pageSize:25
    });


    return (
        <section>
            <h1 className='text-white'>Search</h1>

            <div className='mt-14 flex flex-col gap-9'>
                {result.communities.length === 0 ? (
                    <p className='no-result'>No communities found</p>
                ) : (
                    <>
                        {result.communities.map(community => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={user.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    );
};



// Export
export default Page;