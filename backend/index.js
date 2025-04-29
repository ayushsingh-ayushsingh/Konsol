import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const contentsArray = [];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end('Hello World!');
});

app.post('/chat', async (req, res) => {
    const latestPrompt = req.body.prompt;

    if (!latestPrompt || typeof latestPrompt !== 'string') {
        return res.status(400).json({ error: 'Invalid request body. Expected a "prompt" string.' });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    let headersSent = false;

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set.');
            if (!headersSent) {
                return res.status(500).json({ error: 'Server configuration error: API Key missing.' });
            } else {
                res.end();
                return;
            }
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        contentsArray.push({
            role: 'user',
            parts: [{ text: latestPrompt }],
        });

        const contents = contentsArray;

        const tools = [{ googleSearch: {} }];
        const config = {
            tools,
            responseMimeType: 'text/plain',
        };
        const model = 'gemini-2.5-flash-preview-04-17';

        console.log(`Processing chat request with model: ${model}`);

        const response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        headersSent = true;

        let fullModelResponse = "";

        for await (const chunk of response) {
            if (chunk.text) {
                res.write(chunk.text);
                fullModelResponse += chunk.text;
            }
        }

        if (fullModelResponse) {
            contentsArray.push({
                role: 'model',
                parts: [{ text: fullModelResponse }],
            });
        }

        res.end();

    } catch (error) {
        console.error('Error processing chat request:', error);

        if (contentsArray.length > 0 && contentsArray[contentsArray.length - 1].role === 'user') {
            contentsArray.pop();
        }

        if (!headersSent) {
            res.status(500).json({ error: 'Internal Server Error during AI processing.' });
        } else {
            res.end();
        }
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});