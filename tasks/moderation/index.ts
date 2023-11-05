import OpenAI from 'openai';
import { authorize, getTaskInput, sendResult } from '../../task-provider';
import { ModerationInput } from './moderationInput.ts';
const taskName = "moderation"
const openai = new OpenAI();

const token = await authorize(taskName);
const input = await getTaskInput<ModerationInput>(token);
console.log("Input", input)


const results = await Promise.all(input.map(async (data) => {
    const moderation = await openai.moderations.create({
        input: data
    });

    return moderation.results[0].flagged;
}));

await sendResult(token, results);
