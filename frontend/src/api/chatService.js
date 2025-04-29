// src/api/chatService.js

export const sendChatMessage = async (prompt, onChunk, onComplete) => {
    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get response from AI');
        }

        // Set up a reader for the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        // Read the stream chunk by chunk
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                onComplete(fullResponse);
                break;
            }

            // Decode the chunk and pass it to the callback
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            onChunk(chunk);
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};