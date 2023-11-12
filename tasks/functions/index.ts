import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { execute } from "../../task-provider";

const taskName = "functions"
const addUserSchema = {
    name: "addUser",
    description: "Extracts fields from the input.",
    parameters: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name",
            },
            surname: {
                type: "string",
                description: "Surname",
            },
            year: {
                type: "number",
                description: "Year of birth",
            },
        },
        required: ["name", "surname", "year"],
    },
};

await execute(taskName, () => addUserSchema);
