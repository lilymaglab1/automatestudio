const API_KEY = 'sk_cb1d0c35221408dc0730a37eb9662a1244fc9b48f1c0e333';

async function listSystemVoices() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': API_KEY }
        });

        const data = await response.json();
        // Filter only 'pre-made' voices which are free to use via API
        const systemVoices = data.voices.filter(v => v.category === 'pre-made');

        console.log(`=== Found ${systemVoices.length} System Voices ===`);
        systemVoices.forEach((v, i) => {
            console.log(`${i + 1}. [${v.voice_id}] ${v.name} (${v.labels.gender || 'N/A'}, ${v.labels.accent || 'N/A'})`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

listSystemVoices();
