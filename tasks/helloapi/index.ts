import { authorize, getTaskInput, sendResult } from "../../task-provider";
import { HelloApiInput } from "./input";

const taskName = "helloapi"

const token = await authorize(taskName);

const input = await getTaskInput<HelloApiInput>(token);

let result = input.cookie;

const success = await sendResult(token, result)
console.log("helloapi", success)
