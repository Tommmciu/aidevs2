import OpenAI from 'openai';
import { execute } from '../../task-provider';
import { ModerationInput } from './moderationInput.ts';
const taskName = "moderation"
const openai = new OpenAI();

const results = (input: ModerationInput) => Promise.all(input.map(async (data) => {
    const moderation = await openai.moderations.create({
        input: data
    });

    return moderation.results[0].flagged;
}));

await execute(taskName, results);
