import statusTextMap from './statusMap';

export class Response {
    ok: boolean;
    statusText: string;
    status: number;
    url: string;
    responseText: string;
    keys: Array<string> = [];
    all: Array<string> = [];

    constructor(url: string, status: number, responseText: string) {
        this.ok = ((status / 100) | 0) === 2;
        this.statusText = statusTextMap.get(status);
        this.status = status;
        this.url = url;
        this.responseText = responseText;
    }

    headers = {
        keys: () => this.keys,
        entries: () => this.all,
        // get: (n: string): string => this.headers[n.toLowerCase()],
        has: (n: string) => n.toLowerCase() in this.headers,
    };


    text() { return Promise.resolve(this.responseText); }

    json() { return Promise.resolve(JSON.parse(this.responseText)); }

    clone() { new Response(this.url, this.status, this.responseText); }
}
