const API_KEY = 'sk_cb1d0c35221408dc0730a37eb9662a1244fc9b48f1c0e333';

async function debugVoices() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': API_KEY }
        });

        const data = await response.json();
        const voices = data.voices || [];

        console.log(`Total Voices: ${voices.length}`);
        if (voices.length > 0) {
            console.log('First Voice Category:', voices[0].category);
            // Show all unique categories
            const categories = [...new Set(voices.map(v => v.category))];
            console.log('Available Categories:', categories);

            // Let's filter by the actual category for pre-made voices
            const premade = voices.filter(v => v.category === 'premade' || v.category === 'generated');
            console.log(`Premade/Generated: ${premade.length}`);

            premade.forEach((v, i) => {
                console.log(`${i + 1}. ID: ${v.voice_id} | Name: ${v.name} | Category: ${v.category}`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

debugVoices();
