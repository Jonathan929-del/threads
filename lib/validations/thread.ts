// Import
import * as z from 'zod';



// Thread validation
export const ThreadValidation = z.object({
    thread:z.string().nonempty().min(3, {message:'Minimum 3 characters'}),
    accountId:z.string()
});



// Comment validation
export const CommentValidation = z.object({
    thread:z.string().nonempty().min(3, {message:'Minimum 3 characters'})
});