import { writeFileSync } from 'fs';

const API_KEY = 'sk_cb1d0c35221408dc0730a37eb9662a1244fc9b48f1c0e333';

async function main() {
    const lines = [];

    // Search Korean female voices specifically
    const searchRes = await fetch('https://api.elevenlabs.io/v1/shared-voices?page_size=100&search=korean+female', {
        headers: { 'xi-api-key': API_KEY }
    });

    if (searchRes.ok) {
        const data = await searchRes.json();
        const voices = data.voices || [];
        lines.push(`=== KOREAN FEMALE VOICES: ${voices.length} ===`);
        voices.forEach((v, i) => {
            lines.push(JSON.stringify({
                idx: i + 1,
                id: v.voice_id,
                name: v.name,
                gender: v.gender,
                accent: v.accent,
                age: v.age,
                category: v.category,
                description: v.description,
                cloned: v.cloned_by_count || 0,
            }));
        });
    }

    // Also search for "korean woman"
    lines.push('');
    const res2 = await fetch('https://api.elevenlabs.io/v1/shared-voices?page_size=100&search=korean+woman', {
        headers: { 'xi-api-key': API_KEY }
    });
    if (res2.ok) {
        const d2 = await res2.json();
        lines.push(`=== KOREAN WOMAN: ${(d2.voices || []).length} ===`);
        (d2.voices || []).forEach((v, i) => {
            lines.push(JSON.stringify({ idx: i + 1, id: v.voice_id, name: v.name, gender: v.gender, accent: v.accent, age: v.age, desc: v.description, cloned: v.cloned_by_count || 0 }));
        });
    }

    // Search for "한국 여성"
    lines.push('');
    const res3 = await fetch('https://api.elevenlabs.io/v1/shared-voices?page_size=100&search=korean+girl', {
        headers: { 'xi-api-key': API_KEY }
    });
    if (res3.ok) {
        const d3 = await res3.json();
        lines.push(`=== KOREAN GIRL: ${(d3.voices || []).length} ===`);
        (d3.voices || []).forEach((v, i) => {
            lines.push(JSON.stringify({ idx: i + 1, id: v.voice_id, name: v.name, gender: v.gender, accent: v.accent, age: v.age, desc: v.description, cloned: v.cloned_by_count || 0 }));
        });
    }

    const output = lines.join('\n');
    writeFileSync('scripts/korean-female-voices.txt', output, 'utf-8');
    console.log('Done! Saved to scripts/korean-female-voices.txt');
    console.log(`Total lines: ${lines.length}`);
}

main().catch(console.error);
