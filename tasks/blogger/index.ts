import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { execute } from "../../task-provider";
import { BloggerInput } from "./bloggerInput";
import { context } from "./context";
import { BloggerAnswer } from "./bloggerAnswer";
const taskName = "blogger"

await execute(taskName, async (input: BloggerInput): Promise<BloggerAnswer> => {
    const systemTemplate = `
    Jako {role} tworzysz wpisy na bloga. Do każdego podttytułu napisz treść rozdziału. Nie uwględniaj innych aspektów niż ten o który prosiłem. Postaraj się odpawiadać krótko i zwięźle. Najlepiej w 2-3 zdaniach ale w takim stopniu by móc przygotować z tą wiedzą pizze
     ###{context}###
    `;


    const humanTemplate = "{text}";

    // Utworzenie promptu z dwóch wiadomości według podanych szablonów:
    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["human", humanTemplate],
    ]);

    const chat = new ChatOpenAI({
        maxTokens: 100,
        modelName: "gpt-3.5-turbo"
    });

    const texts = Promise.all(input.blog.map(async title => {
        const formattedChatPrompt = await chatPrompt.formatMessages({
            context,
            role: "Copywriter",
            text: title,
        });

        // Inicjalizacja domyślnego modelu, czyli gpt-3.5-turbo
        // Wykonanie zapytania do modelu
        const start = Date.now()
        const { content } = await chat.call(formattedChatPrompt);
        const seconds = (Date.now() - start) / 1000;
        console.log(`Took ${seconds} seconds to call API`)
        return content
    }))


    return texts;
})


