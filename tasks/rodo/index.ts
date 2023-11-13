import { ChatOpenAI } from "langchain/chat_models/openai";
import { execute } from "../../task-provider";
import { RodoInput } from "./rodoInput"

const taskName = "rodo"
await execute(taskName, async (input: RodoInput) => {


    return `Podaj mi informacje o sobie zamieniając anonimizujac dane. 
Zamien imie na %imie%
Nazwisko na %nazwisko%
Zawod na %zawod%
Miasto na %miasto%`
})
