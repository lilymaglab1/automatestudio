import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceSelection extends Document {
    userId: string;
    myVoiceIds: string[];
    lastSelectedVoiceId?: string;
}

const VoiceSelectionSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    myVoiceIds: { type: [String], default: [] },
    lastSelectedVoiceId: { type: String }
}, { timestamps: true });

export default mongoose.models.VoiceSelection || mongoose.model<IVoiceSelection>('VoiceSelection', VoiceSelectionSchema);
