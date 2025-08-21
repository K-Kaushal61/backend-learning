import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, // third-party file uploading site provided URL will be used
            required: true
        },
        thumbnail:{
            type: String, // third-party file uploading site provided URL will be used
            required: true
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        tduration:{
            type: Number, // info about file, provided from third-party file uploading site
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate) // aggregation pipeline

export const Video = mongoose.model("Video", videoSchema)