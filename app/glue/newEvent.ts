import {SubscriptionFunction, CompleteCallback, ErrorCallback, SubscriptionCallback} from "./global";
import {Subscribable} from "rxjs/Observable";

export function newEvent<T>(observable: Subscribable<T>, name:string="event name not specified"):SubscriptionFunction<T>
{
    return (okFunction: SubscriptionCallback<T>, errorFunction?: ErrorCallback, completeFunction?: CompleteCallback) =>
        observable.subscribe.call(observable, (value:T) => {
            console.log("arrived value in event named: [",name,"] value: [", value, "]");
            return okFunction(value);
        }, (error:any) => {
            console.error("arrived error in event named: [",name,"] value: [", error, "]")
            if (errorFunction) return errorFunction(error);
        }, completeFunction);
}
