
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project } from '@/models/Project';

// Simple in-memory store for development without DB
// This allows the UI to function even if MongoDB is not running
// note: this will be reset when the server restarts
const memoryStore = new Map();

async function isConnected() {
    try {
        await connectDB();
        return true;
    } catch (e) {
        console.warn("Database connection failed, using in-memory fallback");
        return false;
    }
}

export async function GET(request: Request) {
    try {
        const connected = await isConnected();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'default_user';

        if (!connected) {
            const projects = Array.from(memoryStore.values())
                .filter((p: any) => p.userId === userId)
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            return NextResponse.json(projects);
        }

        const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
        return NextResponse.json(projects);
    } catch (error: any) {
        console.error("GET Project Error:", error);
        // Fallback to memory on error
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'default_user';
        const projects = Array.from(memoryStore.values())
            .filter((p: any) => p.userId === userId);
        return NextResponse.json(projects);
    }
}

export async function POST(request: Request) {
    let body: any = {};
    try {
        body = await request.json();
        const connected = await isConnected();

        if (!connected) {
            const id = body.id || Math.random().toString(36).substring(7);
            const now = new Date();
            const project = {
                ...body,
                _id: id,
                id: id,
                userId: body.userId || 'default_user',
                createdAt: memoryStore.get(body.id)?.createdAt || now,
                updatedAt: now,
                status: body.status || 'draft',
                _fallback: true
            };
            memoryStore.set(id, project);
            return NextResponse.json(project);
        }

        let project;
        if (body.id) {
            // Update existing project
            project = await Project.findByIdAndUpdate(
                body.id,
                body,
                { new: true }
            );

            // If project not found in DB (maybe created in memory before db was connected), create it
            if (!project) {
                project = new Project({
                    ...body,
                    _id: body.id, // Try to keep same ID
                    userId: body.userId || 'default_user'
                });
                await project.save();
            }
        } else {
            // Create new project
            if (!body.title) body.title = 'Untitled Project';

            project = new Project({
                ...body,
                userId: body.userId || 'default_user'
            });
            await project.save();
        }

        return NextResponse.json(project);
    } catch (error: any) {
        console.error("POST Project Error (falling back to memory):", error);

        // Fallback catch-all handling
        const id = body?.id || Math.random().toString(36).substring(7);
        const now = new Date();
        const project = {
            ...body,
            _id: id,
            id: id,
            userId: body?.userId || 'default_user',
            createdAt: now,
            updatedAt: now,
            status: body?.status || 'draft',
            _fallback: true
        };
        memoryStore.set(id, project);
        return NextResponse.json(project);
    }
}
