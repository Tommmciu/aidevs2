import { Country } from "./country"


export class RestCountries {
    private BASEURL: string

    constructor() {
        this.BASEURL = "https://restcountries.com"
    }

    async GetCountry(country: string): Promise<Country> {
        const url = `${this.BASEURL}/v3.1/name/${country}`
        console.log(url)
        const response = await fetch(url)
        if (response.status !== 200)
            throw Error(`Request failed with status: ${response.status}`)
        const json = await response.json()
        return json[0] as Country
    }

    async GetPopulation(country: string): Promise<number> {
        const result = await this.GetCountry(country);
        return result.population
    }
}
