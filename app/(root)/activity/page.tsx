// Imports
import Link from 'next/link';
import Image from 'next/image';
import {redirect} from 'next/navigation';
import {currentUser} from '@clerk/nextjs';
import {fetchUser, fetchUserActivities} from '@/lib/actions/user.actions';



// Main function
const Page = async () => {


    // Checking if user is onboarded
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');


    // Fetching activites
    const res = await fetchUserActivities(userInfo._id);


    return (
        <section>
            <h1 className='text-white'>Activity</h1>
            <section className='mt-10 flex flex-col gap-5'>
                {res.length > 0 ? (
                    <>
                        {res.map(activity => (
                            <Link
                                key={activity._id}
                                href={`/thread/${activity.parentId}`}
                            >
                                <article className='activity-card'>
                                    <Image
                                        src={activity.author.image}
                                        alt='User picture'
                                        width={20}
                                        height={20}
                                        className='rounded-full object-cover'
                                    />
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {activity.author.name}
                                        </span>{' '}
                                        commented on your post
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-1'>No activities yet</p>
                )}
            </section>
        </section>
    );
};



// Export
export default Page;