import ExchangeRates from "../../services/exchangeRates"
import { RestCountries } from "../../services/restCountries"

const restCountries = new RestCountries()

export const getRateSchema = {
    "name": "getRate",
    "description": "Get the current exchange rate",
    "parameters": {
        "type": "object",
        "properties": {
            "symbol": {
                "type": "string",
                "description": "A query that contains currency name for conversion into symbol. The name of currency must be convert into symbol for example: euro=EUR, dolar=USD"
            },
        },
        "required": ["symbol"]
    }
}

export const getPopulationSchema = {
    "name": "getPopulation",
    "description": "Get the current population of provided country",
    "parameters": {
        "type": "object",
        "properties": {
            "countryName": {
                "type": "string",
                "description": "A query that contains a name of the country. The name of the country must be returned in english. For example: ile ludzi mieszka w polsce?=poland"
            },
        },
        "required": ["countryName"]
    }
}

export const getPopulation = async ({ countryName }: { countryName: string }): Promise<number> => {
    console.log(countryName)
    return await restCountries.GetPopulation(countryName)
}

export const getRate = async ({ symbol }: { symbol: string }) => {
    return ExchangeRates.getCurrentRate(symbol)

}

