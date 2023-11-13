import { ChatPromptTemplate } from "langchain/prompts";
import { execute } from "../../task-provider";
import { ScraperInput } from "./scraperInput"
import { ChatOpenAI } from "langchain/chat_models/openai";
const taskName = "scraper"

const retry = async (request: () => Promise<Response>, n: number) => {
    let counter = 1;
    do {
        const response = await request();
        console.log(`Request ${counter} status`, response.status)
        if (response.status >= 200 && response.status < 300)
            return await response.text()
        ++counter
    }
    while (counter <= n)
    throw Error("Retry limit reached")
}

await execute(taskName, async (input: ScraperInput) => {

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo"
    })

    const responsefunc = () => fetch(input.input, {
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
        }
    })

    const article = await retry(responsefunc, 5)

    console.log("article", article)
    const template = ChatPromptTemplate.fromMessages([
        ["system", `jesteś asystem odpowiadającym na pytania z artykułu.
###
Musisz odpowiedzieć w kilku słowach
###
Oto jego treśc: {article}`],
        ["user", "{question}"]
    ])

    const prompt = await template.formatMessages({
        article,
        question: input.question
    })
    const { content } = await model.call(prompt)

    return content
})
