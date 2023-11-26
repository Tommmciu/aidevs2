import { execute } from "../../task-provider";
import { OwnapiInput } from "./ownapiInput"

const taskName = "ownapi"
await execute(taskName, async (input: OwnapiInput) => {
    return `${process.env.OWNAPI_URL}/chat`
})
