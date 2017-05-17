/**
 * Created by christian on 8/09/16.
 */
import {Injectable} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs/Rx";
import {ObservableInput} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import axios from "axios";

//region: using type merging:
export interface Server {
    get<T,V>(resource:string, observer?:Observer<T>):Observable<V>;
    post<T,V>(resource:string, payload:T, observer?:Observer<T>):Observable<V>;
}
;
export abstract class Server {
    static local():Server {
        return new AxiosGateway('http://localhost:3004/');
    }
}
;
//endregion
@Injectable()
export class AxiosGateway implements Server {

    constructor(private serverHost:string = 'http://localhost:3004/') {
    }


    private request<T, V>(resource:string, method:string, data:T|null = null, headers:any = {'X-Custom-Header': 'foobar'}):Observable<V> {
        var config:any = {
            baseURL: this.serverHost,
            timeout: 1000,
            method: method,
            headers: headers,
            url: resource,
            data: data
        };
        console.log("calling resource [", resource, "] of server: [", this.serverHost, "]");
        return <Observable<V>> Observable
            .of(config)
            .flatMap(config => axios.request(config))
            .retry(3)
            .pluck('data')
            .do((resp:any) => {
                console.log("returned from call for resource: ", resource, JSON.stringify(resp));
            });
    }

    private manageResponse<T,V>(observable:Observable<V>, resource:string, observer:Observer<V>|null):Observable<V> {
        if (observer) {
            observable.first().subscribe(
                (value:V)=> {
                    observer.next(value);
                },
                (error:any) => {
                    console.error("call to: ", resource, "failed:", error);
                    observer.error(error);
                },
                () => {
                } //TODO: axio does not abort promise
            );
        }
        return observable;
    }

    get<T,V>(resource:string, observer:Observer<V>|null = null):Observable<V> {
        return this.manageResponse(this.request<T, V>(resource, 'get'), resource, observer);
    }


    post<T,V>(resource:string, payload:T, observer:Observer<V>|null = null):Observable<V> {
        return this.manageResponse(this.request<T, V>(resource, 'post', payload), resource, observer);
    }
}
export interface IPipeline<T,V> {
    run(resource:T):void;
    next(resource:T):void;
    subscribe(cb:((value:V) => void)):Subscription;
    asObservable():Observable<V>;
}
export interface IResourcePipeline<T, V> extends IPipeline<T,V> {
}
export class OnlyLatestFilteredCallGeneric<T, V> implements IResourcePipeline<T, V>  {

    private continuousLoadPipeline:Subject<T> = new Subject<T>();
    private observable:ObservableInput<V>;

    constructor(call:(value:any, index:number) => ObservableInput<V>, observer?:Observer<V>) {
        this.observable = this.continuousLoadPipeline
            .switchMap(call).share();
        if (observer) {
            (<Observable<V>> this.observable).subscribe(observer); //TODO: leaking subscription
        }
    }

    run(resource:T):IResourcePipeline<T, V> {
        this.continuousLoadPipeline.next(resource);
        return this;
    }

    next(resource:T):void {
        this.run(resource);
    }

    subscribe(cb:((value:V) => void)) {
        const obs = <Observable<V>> this.observable;
        return obs.subscribe(cb);
    }

    asObservable():Observable<V> {
        return <Observable<V>> this.observable;
    }
}
export class OnlyLatestFilteredCall<T> extends OnlyLatestFilteredCallGeneric<string, T> {
}
export class WebSocketSubject<T> {

    private websocket:WebSocket;
    private obs:Observable<{}>;
    private open:boolean = false;
    private toBeSent:Function[] = [];

    constructor(url:string) {
        this.websocket = new WebSocket(url);
        this.obs = Observable.create((observer:Observer<T>) => {
            this.websocket.onmessage = observer.next.bind(observer);
            const errorCb = (error:any) => {
                console.error("websocket error: ", error);
                observer.error(error);
            }
            this.websocket.onerror = errorCb;
            this.websocket.onclose = errorCb;
            return observer;
        })
            .map((event:any)=>event.data);
        this.websocket.onopen = (ev:Event)=> {
            console.log("websocket to [", url, "] opened!");
            this.open = true;
            this.toBeSent.map((cb:()=>string)=>this.websocket.send(cb()));
            this.toBeSent = [];
        }
    }

    subscribe(cb:(value:any)=>void) {
        return this.obs.subscribe(cb);
    }

    send(message:()=>string):void {
        console.log("sending through ws: ", message());
        if (this.open == false) {
            this.toBeSent.push(message);
            return;
        }
        this.websocket.send(message());
    }

    run(resource:string):void {
        this.send(()=>resource);
    }

    next(resource:string):void {
        this.send(()=>resource);
    }

    asObservable<T>():Observable<T> {
        return <Observable<T>>this.obs;
    }
}
export class StatefulPipeline<T, V> {
    private observable:ObservableInput<V>;
    private continuousLoadPipeline:Subject<(value:T)=>T> = new Subject<(value:T)=>T>();

    asObservable():Observable<V> {
        return <Observable<V>> this.observable;
    }

    constructor(call:(value:any, index:number) => ObservableInput<V>, initialValue:T) {
        this.observable = this.continuousLoadPipeline
            .scan((oldValue:T, fn:(value:T)=>T)=>fn(oldValue), initialValue)
            .switchMap(call);
    }

    run(resource:(value:T)=>T):void {
        this.continuousLoadPipeline.next(resource);
    }

    next(resource:(value:T)=>T):void {
        this.run(resource);
    }

    subscribe(cb:((value:V) => void)) {
        const obs = <Observable<V>> this.observable;
        return obs.subscribe(cb);
    }

}

