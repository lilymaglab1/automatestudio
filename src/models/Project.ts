
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    userId: string;
    title: string;
    status: 'draft' | 'completed' | 'rendering';
    step: number;
    settings: {
        ratio: string;
        style: string;
        durationPreset: number;
        cutSpeed: string;
        topic: string;
        selectedVoice: string;
    };
    script: string;
    segments: any[];
    thumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
    userId: { type: String, required: true, default: 'default_user' },
    title: { type: String, required: true },
    status: { type: String, enum: ['draft', 'completed', 'rendering'], default: 'draft' },
    step: { type: Number, default: 1 },
    settings: { type: Object, default: {} },
    script: { type: String, default: '' },
    segments: { type: Array, default: [] },
    thumbnail: { type: String },
}, { timestamps: true });

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
