import OpenAI from "openai";
import { execute } from "../../task-provider";
import { GnomeInput } from "./gnomeInput"
const taskName = "gnome"

const chat = new OpenAI()

const context = `
You're getting images of gnomes. Your task is to give answers regarding image
If you can't answer the question send "ERROR"
---
You have to answer in POLISH.
`

await execute(taskName, async (input: GnomeInput) => {

    const { choices } = await chat.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "system",
                content: context
            },
            {
                role: "user",
                content: [
                    { type: "text", text: "What is color of the hat?" },
                    {
                        type: "image_url",
                        image_url: {
                            url: input.url,
                        },
                    },
                ],
            },
        ],
    });
    return choices[0].message.content

})
