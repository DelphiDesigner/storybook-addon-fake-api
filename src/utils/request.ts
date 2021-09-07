export class Request {
    url: string;
    method: string;
    status: number;
    constructor(input: { url: string, method: string } | string, options: { method?: string } = {}) {
        if (typeof input === 'object') {
            this.method = options.method || input.method || 'GET';
            this.url = input.url;
        } else {
            this.method = options.method || 'GET';
            this.url = input;
        }
    }
}
