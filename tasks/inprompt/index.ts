import * as fs from "fs";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { execute } from "../../task-provider";
import { InputInprompt } from "./inputInprompt";

const taskName = "inprompt"

const openai = new ChatOpenAI();

function getFirstWord(inputString: string): string | null {
    // Remove leading and trailing whitespaces
    const trimmedString = inputString.trim();

    // Check if the string is not empty after trimming
    if (trimmedString.length === 0) {
        return null; // Return null for an empty string
    }

    // Split the string into an array of words
    const words = trimmedString.split(' ');

    // Return the first word
    return words[0];
}

await execute("inprompt", async (input: InputInprompt) => {
    const dict: Record<string, string> = input.input.reduce((prev: Record<string, string>, current: string) => {
        const name: string | null = getFirstWord(current);

        if (name !== null) {
            prev[name] = current;
        }
        return prev;
    }, {});

    const { content: name } = await openai.call([
        new SystemMessage("Do podanego zdania zwracasz jedynie wystepujace w nim imię"),
        new HumanMessage(input.question)
    ])

    const description = dict[name];
    console.log(name, description)
    const { content: response } = await openai.call([
        new SystemMessage(description),
        new HumanMessage(input.question)
    ])
    return response;
})
