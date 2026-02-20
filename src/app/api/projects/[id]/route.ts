
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';

export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        await connectDB();
        const id = context.params.id;
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        await connectDB();
        const id = context.params.id;
        await Project.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await request.json();
        const id = context.params.id;

        const project = await Project.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
