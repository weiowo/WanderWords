import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  user: Schema.Types.ObjectId;
  img?: string;
  title: string;
  slug: string;
  desc?: string;
  category: string;
  content: string;
  isFeatured: boolean;
  visit: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    img: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String },
    category: { type: String, default: 'general' },
    content: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    visit: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default model<IPost>('Post', postSchema);
