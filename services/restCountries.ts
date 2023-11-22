import { Country } from "./country"


export class RestCountries {
    private BASEURL: string

    constructor() {
        this.BASEURL = "https://restcountries.com"
    }

    async GetCountry(country: string): Promise<Country> {
        const response = await fetch(`${this.BASEURL}`)
        if (response.status !== 200)
            throw Error(`Request failed with status: ${response.status}`)
        return await response.json<Country>()
    }

    async GetPopulation(country: string): Promise<number> {
        const result = await this.GetCountry(country);
        return result.population
    }
}
