import { BaseMessageChunk } from "langchain/schema";

export const parseFunctionCall = (
    result: BaseMessageChunk
): { name: string; args: any } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }
    return {
        name: result.additional_kwargs.function_call.name,
        args: JSON.parse(result.additional_kwargs.function_call.arguments),
    };
};

export async function parseConversation(conversation: BaseMessageChunk, tools: any) {
    const action = parseFunctionCall(conversation)

    if (action) {
        console.log(`action: ${action.name}`);
        console.log(action.args);
        return await tools[action.name](action.args);
    } else {
        return conversation.content;
    }
}
