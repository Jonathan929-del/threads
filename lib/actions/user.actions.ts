'use server';
// Imports
import {FilterQuery, SortOrder} from 'mongoose';
import User from '../models/user.model';
import {connectToDb} from '../mongoose';
import {revalidatePath} from 'next/cache';
import Thread from '../models/thread.model';



// Update user params interface
interface UpdateUserParams{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,
};

// Update user
export const updateUser = async ({
    userId,
    username,
    name,
    bio,
    image,
    path
}:UpdateUserParams) => {
    try {
        connectToDb();
        await User.findOneAndUpdate({id:userId}, {
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded:true
        }, {upsert:true});
        if(path === '/profile/edit'){
            revalidatePath(path);
        }
    } catch (err:any) {
        console.log(`Failed to update user: ${err.message}`);
    }
};



// Fetch user
export const fetchUser = async (userId:string) => {
    try {
        connectToDb();
        return await User.findOne({id:userId});
    } catch (err:any) {
        console.log(`Failed to fetch user: ${err.message}`);
    }
};



// Fetch threads by user's id
export const fetchUserPosts = async (userId:string) => {
    try {
        connectToDb();
        const threads = await User
            .findOne({id:userId})
            .populate({
                path:'threads',
                model:Thread,
                populate:{
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:'name iamge id'
                    }
                }
            });
        return threads;
    } catch (err:any) {
        throw new Error(`Error fetching threads: ${err.message}`)
    }
};



// Fetching users params
interface FetchUsersParams {
    userId:string;
    searchString?:string;
    pageNumber?:number;
    pageSize?:number;
    sortBy:SortOrder
};

// Fetching all users
export const fetchUsers = async ({userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy='desc'}:FetchUsersParams) => {
    try {

        connectToDb();

        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');
        const query:FilterQuery<typeof User> = {
            id:{$ne:userId}
        };
        if(searchString.trim() !== ''){
            query.$or = [
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        };
        const sortOptions = {createdAt:sortBy};
        const usersQuery = User
            .find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        const users = await usersQuery.exec();
        const totalUsersCount = await User.countDocuments(query);
        const isNext = totalUsersCount > skipAmount + users.length;
        return {users, isNext};


    } catch (err:any) {
        throw new Error(`Error fetching users: ${err.message}`);
    }
};



// Fetching activities
export const fetchUserActivities = async (userId:string) => {
    try {

        connectToDb();


        const userThreads = await Thread.find({author:userId});
        const childThreadsIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);
        const replies = await Thread
            .find({
                _id:{$in:childThreadsIds},
                author:{$ne:userId}
            })
            .populate({
                path:'author',
                model:User,
                select:'image name _id'
            });
        return replies;


    } catch (err:any) {
        throw new Error(`Error fetching activities: ${err.message}`);
    }
};