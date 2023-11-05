import { authorize, sendResult } from "../../task-provider";
import { HelloApiInput } from "./input";

const getTaskInput = async (token: string) => {
    const baseUrl = Bun.env.API_URL;
    const url = `${baseUrl}/task/${token}`;
    const response = await fetch(url);
    const data = await response.json<HelloApiInput>();
    console.log("Task", data.msg)
    console.log("Cookie", data.cookie)
    return data.cookie;
}
const taskName = "helloapi"

const token = await authorize(taskName);

const input = await getTaskInput(token);

const success = await sendResult(token, input)
console.log("helloapi", success)
