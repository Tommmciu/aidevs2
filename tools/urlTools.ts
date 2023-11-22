export const extractUrl = (input: string): string => {
    const urlRegex = /(http(s?)?:\/\/[^\s]+)/;

    const extractedUrl = input.match(urlRegex);

    if (extractedUrl) {
        const url = extractedUrl[0];
        return url;
    } else {
        throw Error("No URL found in the input string.");
    }
}

