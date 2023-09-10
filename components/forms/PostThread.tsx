'use client';
// Imports
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {Textarea} from '../ui/textarea';
import {useOrganization} from '@clerk/nextjs';
import {Button} from '@/components/ui/button';
import {zodResolver} from '@hookform/resolvers/zod';
import {usePathname, useRouter} from 'next/navigation';
import {createThread} from '@/lib/actions/thread.actions';
import {ThreadValidation} from '@/lib/validations/thread';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';



// Main function
const PostThread = ({userId}:{userId:string}) => {


    // States
    const router = useRouter();
    const pathname = usePathname();
    const {organization} = useOrganization();


    // Form
    const form = useForm({
        resolver:zodResolver(ThreadValidation),
        defaultValues:{
            thread:'',
            accountId:userId
        }
    });


    // Submit handler
    const onSubmit = async (values:z.infer<typeof ThreadValidation>) => {
        await createThread({
            text:values.thread,
            author:userId,
            communityId:organization ? organization.id : null,
            path:pathname
        });
        router.push('/');
    };


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-10 mt-10'
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({field}) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl
                                className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                            >
                                <Textarea
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    className='bg-primary-500'
                >
                    Post thread
                </Button>
            </form>
        </Form>
    );
};



// Export
export default PostThread;