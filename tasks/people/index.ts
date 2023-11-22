import { execute } from "../../task-provider";
import { PeopleInput } from "./peopleInput"
import { Person } from "./person";
import { ChatOpenAI } from "langchain/chat_models/openai";
const taskName = "people"

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo"
})
await execute(taskName, async (input: PeopleInput) => {

    const dataResponse = await fetch(input.data)
    const data = await dataResponse.json<Person[]>()

    const { content: name } = await model.call([
        ["system", `Jesteś asystenem który z każdego pytania wyciąga jedynie imię i nazwisko
        Odpowiedz zwracasz w formacie json : {"imie":"Tomasz","nazwisko":"Obyrtacz"}` ],
        ["user", input.question]
    ])
    console.info(name)
    const userDetails = JSON.parse(name);

    const user = data.findLast(u => u.imie == userDetails.imie && u.nazwisko == userDetails.nazwisko)
    if (user === undefined)
        throw Error(`User ${userDetails} not found`)

    const { content: response } = await model.call([
        ["system", `Jesteś asystenem który z który odpowiada na pytania zadane przez użytkownika
        Informacje o osobie o którą pyta użytkownik:
        ${JSON.stringify(user)}`],
        ["user", input.question]
    ])

    return response
})
