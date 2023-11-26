import { execute } from "../../task-provider";
import { ToolsInput } from "./toolsInput"
import { addToDoSchema } from "./functions/todo";
import { addEventSchema } from "./functions/calendar";
import { today } from "../../tools/dateTools";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SystemMessage, HumanMessage } from "langchain/schema";
import context from "./context";
import { parseConversation } from "../../tools/functionCallingTools";

const taskName = "tools"

const tools = {
    addTodo: ({ task }: { task: string }) => {
        return {
            tool: "ToDo",
            desc: task
        }
    },
    addEvent: ({ event, date }: { event: string, date: string }) => {
        return {
            tool: "Calendar",
            desc: event,
            date: date
        }
    }
}
await execute(taskName, async (input: ToolsInput) => {

    const model = new ChatOpenAI({
        modelName: "gpt-4-0613"
    }).bind({
        functions: [addEventSchema, addToDoSchema]
    })

    const response = await model.invoke([
        new SystemMessage(context),
        new SystemMessage(today()),
        new HumanMessage(input.question)
    ])
    return await parseConversation(response, tools)
})
