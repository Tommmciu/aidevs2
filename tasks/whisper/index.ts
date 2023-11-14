import { execute } from "../../task-provider";
import { WhisperInput } from "./WhisperInput";
import { OpenAI, toFile } from "openai";
import { extractUrl } from "../../tools/urlTools";

const taskName = "whisper"

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
