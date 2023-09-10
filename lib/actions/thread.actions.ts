'use server';
// Imports
import {connectToDb} from '../mongoose';
import User from '../models/user.model';
import {revalidatePath} from 'next/cache';
import Thread from '../models/thread.model';
import Community from '../models/community.model';



// Create thread params interface
interface Params {
    text:string,
    author:string,
    communityId:string | null,
    path:string,
};

// Create thread
export const createThread = async ({text, author, communityId, path}:Params) => {
    try {
        
        // Db connection
        connectToDb();


        // Community id object
        const communityIdObject = await Community.findOne(
            {id:communityId},
            {_id:1}
        );
    
        // Creating thread
        const createdThread = await Thread.create({
            text,
            author,
            community:communityIdObject
        });
    
        // Updating user
        await User.findByIdAndUpdate(author, {
            $push:{threads:createdThread._id}
        });

        // Updating community
        if (communityIdObject) {
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: {threads:createdThread._id},
            });
        };
    
        // Revalidating path
        revalidatePath(path);

    } catch (err:any) {
        throw new Error(`Error creating thread: ${err}`);
    }
};



// Fetch threads
export const fetchThreads = async (pageNumber = 1, pageSize=20) => {
    try {

        // Db connection
        connectToDb();

        // Skip amount
        const skipAmount = (pageNumber - 1) * pageSize;
        
        // Threads fetching
        const threadsQuery = Thread
            .find({parentId:{$in:[null, undefined]}})
            .sort({createdAt:'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path:'author',
                model:User
            })
            .populate({
                path:'community',
                model:Community,
            })
            .populate({
                path:'children',
                populate:{
                    path:'author',
                    model:User,
                    select:'_id name parentId image'
                }
            });
        const totalThreadsCount = await Thread.countDocuments({parentId:{$in:[null, undefined]}});
        const threads = await threadsQuery.exec();
        const isNext = totalThreadsCount > skipAmount + threads.length;

        return {threads, isNext};
        
    } catch (err:any) {
        throw new Error(`Error fetching threads: ${err}`);   
    }
};



// Fetching thread by id
export const fetchThreadById = async (id:string) => {
    try {
        const thread = await Thread
            .findById(id)
            .populate({
                path:'author',
                model:User,
                select:'_id id name image'
            })
            .populate({
                path:'children',
                populate:[
                    {
                        path:'author',
                        model:User,
                        select:'_id id name image parentId'
                    },
                    {
                        path:'children',
                        model:Thread,
                        populate:{
                            path:'author',
                            model:User,
                            select:'_id id name image parentId'
                        }
                    }
                ]
            }).exec();
        return thread;
    } catch (err:any) {
        throw new Error(`Error fetching thread: ${err.message}`);
    }
};



// Add comment params interface
interface addCommentParams {
    threadId:string,
    commentText:string,
    userId:string,
    path:string
}

// Add comment
export const addCommentToThread = async ({
    threadId,
    commentText,
    userId,
    path
}:addCommentParams) => {
    connectToDb();
    try {
        
    
        // Fetching original thread
        const originalThread = await Thread.findById(threadId);
        if(!originalThread){
            throw new Error('Thread not found');
        }

        // Creating a new thread with the comment text
        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        });
        const savedCommentThread = await commentThread.save();

        // Update the original thread
        originalThread.children.push(savedCommentThread._id);
        await originalThread.save();

        // Revalidating path
        revalidatePath(path);


    } catch (err:any) {
        throw new Error(`Error adding comment: ${err.message}`);
    }
};