import OpenAI from 'openai';
import { authorize, getTaskInput, sendResult } from '../../task-provider';
import { GetInputResponse } from "./input.ts"
const taskName = "moderation"
const openai = new OpenAI();

const token = await authorize(taskName);
const input = await getTaskInput<GetInputResponse>(token);


const results = await Promise.all(input.input.map(async (data) => {
    const moderation = await openai.moderations.create({
        input: data
    });

    return moderation.results[0].flagged;
}));

await sendResult(token, results);
