import { newMockXhr } from 'mock-xmlhttprequest';
import { Request } from './request';
import { Response } from './response';
import { arrayEquals } from './array';
import { match } from 'path-to-regexp';

// const global =
//     (typeof globalThis !== 'undefined' && globalThis) ||
//     (typeof self !== 'undefined' && self);
//     // (typeof global !== 'undefined' && global);

export class Faker {

    requestMap : any;
    MockXhr : any;

    realFetch : any;
    realXMLHttpRequest: any;
    constructor() {
        this.MockXhr = newMockXhr();
        this.MockXhr.onSend = this.mockXhrRequest;

        this.realFetch = global.fetch;
        this.realXMLHttpRequest = global.XMLHttpRequest;

        global.fetch = this.mockFetch;
        global.XMLHttpRequest = this.MockXhr;

        this.requestMap = {};
    }

    getNormalizedUrl = (rawUrl = '') => {
        const baseUrl =
            rawUrl.indexOf('http') == 0 ? undefined : 'http://localhost';
        const url = new URL(rawUrl, baseUrl);
        const searchParamKeys : Array<string>= [];
        if (url.search) {
            url.searchParams.forEach((v,k,p)=>{
                searchParamKeys.push(k);
            })
        }
        return {
            path: url.host + url.pathname,
            searchParamKeys,
        };
    };


    getRequests = () => Object.values(this.requestMap);

    getKey = (url : string = '', searchParamKeys: Array<string>= [], method : string = '') =>
        url && method
            ? [url, ...searchParamKeys, method.toLowerCase()].join('_')
            : '';

    makeInitialRequestMap = (requests: Request) => {
        if (!requests || !Array.isArray(requests)) {
            return;
        }

        requests.forEach((request) => {
            this.add(request);
        });
    };

    add = (request: Request) => {
        const { path, searchParamKeys } = this.getNormalizedUrl(request.url);
        const key = this.getKey(path, searchParamKeys, request.method);
        this.requestMap[key] = {
            ...request,
            path,
            searchParamKeys,
            method: request.method || 'GET',
            status: request.status || 200,
            skip: false,
        };
    };

    update = (item : {url: string, method: string}, fieldKey: number, value: string) => {
        const { url, method } = item;
        const { path, searchParamKeys } = this.getNormalizedUrl(url);
        const itemKey = this.getKey(path, searchParamKeys, method);

        if (
            this.requestMap.hasOwnProperty(itemKey) &&
            this.requestMap[itemKey].hasOwnProperty(fieldKey)
        ) {
            this.requestMap[itemKey][fieldKey] = value;
        }
    };

    matchMock = (url: string, method = 'GET') => {
        const { path, searchParamKeys } = this.getNormalizedUrl(url);
        for (let key in this.requestMap) {
            const { url: requestUrl, method: requestMethod } =
                this.requestMap[key];
            const { path: requestPath, searchParamKeys: requestSearchKeys } =
                this.getNormalizedUrl(requestUrl);

            if (
                match(requestPath)(path) &&
                method == requestMethod &&
                arrayEquals(searchParamKeys, requestSearchKeys) &&
                !this.requestMap[key].skip
            ) {
                return this.requestMap[key];
            }
        }

        return null;
    };

    mockFetch = (input: string | {url: string, method: string}, options: {method: string}) => {
        const request = new Request(input, options);
        const { url, method } = request;
        const matched = this.matchMock(url, method);

        if (matched) {
            return new Promise((resolve) => {
                resolve(new Response(url, matched.status,JSON.stringify( matched.response)));
            });
        }
        return this.realFetch(input, options);
    };

    mockXhrRequest = (xhr: any) => {
        const { method, url } = xhr;
        const matched = this.matchMock(url, method);
        if (matched) {
            xhr.respond(+matched.status, {}, matched.response);
        } else {
            // eslint-disable-next-line new-cap
            const realXhr = new this.realXMLHttpRequest();
            realXhr.open(method, url);

            realXhr.onreadystatechange = function onReadyStateChange() {
                if (realXhr.readyState === 4 && realXhr.status === 200) {
                    xhr.respond(200, {}, this.responseText);
                }
            };

            realXhr.send();

            const errorHandler = function () {
                return 'Network failed';
            };

            realXhr.onerror = errorHandler;
            realXhr.ontimeout = errorHandler;
        }
    };

    restore = () => {
        this.requestMap = {};
    };
}

export default new Faker();
