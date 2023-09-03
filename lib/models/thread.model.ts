// Import
import mongoose from 'mongoose';



// Thread schema
const ThreadSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    parentId:{
        type:String
    },
    children: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }]
});



// Export
const Thread = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
export default Thread;