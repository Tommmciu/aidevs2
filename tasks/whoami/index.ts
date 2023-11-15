import { ChatPromptTemplate } from "langchain/prompts";
import { authorize, getTaskInput, sendResult } from "../../task-provider";
import { WhoamiInput } from "./whoamiInput"
import { ChatOpenAI } from "langchain/chat_models/openai";

const taskName = "whoami"
const token = await authorize(taskName)
const hintsNo = 3

const context = `Jesteś asystentem pomagającym rozpoznawać znane osoby
Jedyne co zwracasz to imię i nazwisko
###
Jeżeli nie jesteś pewny wypisz \`NIE WIEM\``

const hints: string[] = []
for (let i = 0; i < hintsNo - 1; ++i) {
    hints.push((await getTaskInput<WhoamiInput>(token)).hint)
}

const getNewHint = async (): Promise<string> => {
    let n = 0;
    const limit = 10
    while (n < limit) {
        const newHint = (await getTaskInput<WhoamiInput>(token)).hint
        if (!hints.includes(newHint))
            return newHint;
    }
    throw Error(`Couldn't get new hint. Limit ${limit} reached`)
}

const model = new ChatOpenAI({
    maxTokens: 100,
    modelName: "gpt-3.5-turbo"
})
let response = ""
do {
    hints.push(await getNewHint())
    console.info("calling ")
    const { content } = await model.call([
        ["system", context],
        ["user", hints.join('\n')]
    ]);
    response = content
    console.log(response)
}
while (response.trim() === 'NIE WIEM')

await sendResult(token, response)
