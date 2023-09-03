// Import
import mongoose from 'mongoose';



// User schema
const UserSchema = new mongoose.Schema({
    id:{type:String, required:true},
    username:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    image:String,
    bio:String,
    onboarded:{type:Boolean, default:false},
    threads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }],
    communities:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    }],
});



// Export
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;