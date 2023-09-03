'use client';
// Imports
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {Input} from '../ui/input';
import {Button} from '@/components/ui/button';
import {zodResolver} from '@hookform/resolvers/zod';
import {usePathname, useRouter} from 'next/navigation';
import {CommentValidation} from '@/lib/validations/thread';
import {addCommentToThread} from '@/lib/actions/thread.actions';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import Image from 'next/image';



// Params interface
interface Params {
    threadId:string;
    currentUserId:string;
    currentUserImg:string;
};



// Main function
const Comment = ({threadId, currentUserId, currentUserImg}:Params) => {


    // States
    const router = useRouter();
    const pathname = usePathname();


    // Form
    const form = useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues:{
            thread:''
        }
    });


    // Submit handler
    const onSubmit = async (values:z.infer<typeof CommentValidation>) => {
        await addCommentToThread({
            threadId,
            commentText:values.thread,
            userId:JSON.parse(currentUserId),
            path:pathname
        });
        form.reset();
    };


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='comment-form'
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({field}) => (
                        <FormItem className='flex gap-3 w-full items-center'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='User image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    placeholder='Comment...'
                                    className='no-focus text-light-1 outline-none'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    className='comment-form_btn'
                >
                    Reply
                </Button>
            </form>
        </Form>
    );
};



// Export
export default Comment;