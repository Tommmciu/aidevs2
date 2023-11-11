import { authorize, postTaskInput, sendResult } from "../../task-provider";
import { LiarInput } from "./liarInput";

const taskName = "liar"

const token = await authorize(taskName)

const form = new FormData()
form.set("question", "What is capital of Poland?")

const input = await postTaskInput<LiarInput>(token, form);

const validate = (answer: string): boolean => {
    const lower = answer.toLowerCase()
    return lower.includes("warsaw") &&
        lower.includes("capital") &&
        lower.includes("poland")
}

await sendResult(token, validate(input.answer) ? "YES" : "NO")

