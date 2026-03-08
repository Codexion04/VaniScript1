
import fetch from 'node-fetch';

async function test() {
    try {
        console.log('Sending request to backend...');
        const res = await fetch('http://localhost:5000/generate-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'Test prompt for debugging',
                platforms: ['LinkedIn']
            })
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response Metadata:', Object.keys(data));
        if (data.posts) {
            console.log('Platforms returned:', Object.keys(data.posts));
        } else {
            console.log('Full Response:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
}

test();
