import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageChunk, HumanMessage, SystemMessage } from "langchain/schema";
import { getPopulationSchema, getRateSchema, getPopulation, getRate } from "./functions";
import { execute } from "../../task-provider";
import { getDate } from "../../tools/dateTools";
import { KnowledgeInput } from "./knowledgeInput";
import { parseFunctionCall } from "../../tools/functionCallingTools";

const taskName = "knowledge"


async function parseConversation(conversation: BaseMessageChunk) {
    const action = parseFunctionCall(conversation)

    if (action) {
        console.log(`action: ${action.name}`);
        console.log(action.args);
        return await tools[action.name](action.args);
    } else {
        return conversation.content;
    }
}

const tools: any = {
    getRate,
    getPopulation,
};

const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
}).bind({
    functions: [getRateSchema, getPopulationSchema]
});

await execute(taskName, async (input: KnowledgeInput) => {

    const conversation = await model.invoke([
        new SystemMessage(`
          Fact: Today is ${getDate()}`),
        new HumanMessage(input.question),
    ]);


    const response = await parseConversation(conversation);

    return response
})
