import { execute } from "../../task-provider";
import { WhisperInput } from "./WhisperInput";
import { OpenAI, toFile } from "openai";
import fs from "fs"

const taskName = "whisper"

const extractUrl = (input: string): string => {
    const urlRegex = /(https?:\/\/[^\s]+)/;

    const extractedUrl = input.match(urlRegex);

    if (extractedUrl) {
        const url = extractedUrl[0];
        return url;
    } else {
        console.error("No URL found in the input string.");
        process.exit(1)
    }
}

const filename = (url: string): string => {
    const parts = url.split('/')
    return parts[parts.length - 1]
}

await execute(taskName, async (input: WhisperInput) => {
    const client = new OpenAI()

    const url = extractUrl(input.msg)
    const response = await fetch(url)
    const { text: transctiption } = await client.audio.transcriptions.create({
        model: "whisper-1",
        file: await toFile(response.blob(), filename(url))
    })
    return transctiption
})
