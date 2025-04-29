import { GoogleGenAI, Type } from '@google/genai';
import dotenv from "dotenv";
import fs from 'fs/promises';

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const createFileDeclaration = {
    name: 'create_file',
    description: 'Creates a new file in the current working directory with specified content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            fileName: {
                type: Type.STRING,
                description: 'The name of the file to create (e.g., "report.txt").',
            },
            content: {
                type: Type.STRING,
                description: 'The content to write into the file.',
            },
        },
        required: ['fileName', 'content'],
    },
};

const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: "Create a Todo.jsx code with a simple todo application inside it.",
    config: {
        tools: [{
            functionDeclarations: [createFileDeclaration]
        }],
    },
});

if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0];
    console.log(`Function to call: ${functionCall.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall.args, null, 2)}`);

    if (functionCall.name === 'create_file') {
        const { fileName, content } = functionCall.args;
        try {
            await fs.writeFile(fileName, content);
            console.log(`Successfully created file: ${fileName}`);
        } catch (error) {
            console.error(`Error creating file ${fileName}:`, error);
        }
    } else {
        console.warn(`Requested unknown function: ${functionCall.name}`);
    }

} else {
    console.log("No function call found.");
    console.log("Model response text:", response.text);
}