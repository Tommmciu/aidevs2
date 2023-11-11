import { execute } from "../../task-provider";
import { InputWhisper } from "./inputWhisper";
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

await execute(taskName, async (input: InputWhisper) => {
    const client = new OpenAI()

    const url = extractUrl(input.msg)
    //TODO: Read from URL
    const file = fs.createReadStream("tasks/whisper/mateusz.mp3")
    const { text: transctiption } = await client.audio.transcriptions.create({
        model: "whisper-1",
        file: await toFile(file)
    })
    return transctiption
})
