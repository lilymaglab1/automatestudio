const API_KEY = 'sk_cb1d0c35221408dc0730a37eb9662a1244fc9b48f1c0e333';

async function checkQuota() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
            headers: { 'xi-api-key': API_KEY }
        });

        if (!response.ok) {
            console.error('Error fetching subscription:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('=== ElevenLabs Quota Status ===');
        console.log(`Tier: ${data.tier}`);
        console.log(`Character Limit: ${data.character_limit}`);
        console.log(`Character Count: ${data.character_count}`);
        console.log(`Remaining: ${data.character_limit - data.character_count}`);
        console.log(`Reset Date: ${new Date(data.next_character_count_reset_unix * 1000).toLocaleString()}`);

        if (data.character_limit <= data.character_count) {
            console.log('\n🚨 QUOTA EXCEEDED! You have used all your characters.');
        } else {
            console.log('\n✅ You still have characters left. The error might be something else.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

checkQuota();
