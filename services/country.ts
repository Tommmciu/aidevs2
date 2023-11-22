
export type Country = {
    name: {
        common: string;
        official: string;
        nativeName: {
            pol: {
                official: string;
                common: string;
            };
        };
    };
    tld: string[];
    cca2: string;
    ccn3: string;
    cca3: string;
    cioc: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    currencies: {
        PLN: {
            name: string;
            symbol: string;
        };
    };
    idd: {
        root: string;
        suffixes: string[];
    };
    capital: string[];
    altSpellings: string[];
    region: string;
    subregion: string;
    languages: {
        pol: string;
    };
    translations: {
        ara: {
            official: string;
            common: string;
        };
        // Add other language translations here
    };
    latlng: number[];
    landlocked: boolean;
    borders: string[];
    area: number;
    demonyms: {
        eng: {
            f: string;
            m: string;
        };
        fra: {
            f: string;
            m: string;
        };
        // Add other language demonyms here
    };
    flag: string;
    maps: {
        googleMaps: string;
        openStreetMaps: string;
    };
    population: number;
    gini: {
        2018: number;
    };
    fifa: string;
    car: {
        signs: string[];
        side: string;
    };
    timezones: string[];
    continents: string[];
    flags: {
        png: string;
        svg: string;
        alt: string;
    };
    coatOfArms: {
        png: string;
        svg: string;
    };
    startOfWeek: string;
    capitalInfo: {
        latlng: number[];
    };
    postalCode: {
        format: string;
        regex: string;
    };
}
