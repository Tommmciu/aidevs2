import { Rate } from "./rate"

export type NBPTable =
    {
        "table": string,
        "no": string,
        "effectiveDate": Date,
        "rates": Rate[]
    }
