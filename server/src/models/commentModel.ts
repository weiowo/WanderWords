import { Schema, model, Document } from 'mongoose';

interface IComment extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IComment>('Comment', commentSchema);
