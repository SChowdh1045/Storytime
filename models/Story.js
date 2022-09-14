import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public','private']
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },    
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


// 'Story' is a random model name
export default mongoose.model('Story', StorySchema);