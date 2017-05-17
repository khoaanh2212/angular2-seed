/**
 * Created by christian on 22/09/16.
 */
import R = require("ramda");
/**
 * copies the property values of a DTO to the target object
 * @param dto the input dto
 * @param instance the target object
 * @returns {V}
 */
export function mapFromDTO<T,V>(dto:T, instance:V):V
{
    return <V> R.mapObjIndexed(
            (value:any, key:any, obj:any) => value.key
        ,R.mapObjIndexed(
            (value:any, key:any, obj:any) => {
                const lens=R.lensPath(["key"]);
                const newInstance=R.set(lens, value, instance);
                return newInstance;
            },
        dto
    ));
}
/**
 * a function to change a property that is a Map in an immutable way
 * @param object:V  the object to change
 * @param prop:string[] the property (nested).If it is person.directFamily.children has to be ['directFamily', 'children']
 * @param toAppend:T an object with as key the key and as value the object to append, like {key: string, value: T}
 * @returns {V}
 */
export function changePropertyMap<T, V>(object:V, prop: string[], toAppend:{key: string, value: T}):V
{
    const lens = R.lensPath(prop);
    const newObj = R.set(lens, R.assoc(
        toAppend.key,
        toAppend.value
        , <T[]> R.view(lens, object)), object);
    return newObj;
}
/**
 * a function to append to a property that is a List in an immutable way
 * @param object:V  the object to change
 * @param prop:string[] the property (nested).If it is person.directFamily.children has to be ['directFamily', 'children']
 * @param toAppend:T the object to be added
 * @returns {V}
 */
export function appendToProperty<T, V>(object:V, prop:string[], toAppend:T):V {
    const lens = R.lensPath(prop);
    const newObj = R.set(lens, R.append(toAppend
        , <T[]> R.view(lens, object)), object);
    return newObj;
}
/**
 * it changes a property value returning the changed COPY of the object
 * @param object:V  the object to change
 * @param prop:string[] the property (nested).If it is person.directFamily.children has to be ['directFamily', 'children']
 * @param value:T the value
 * @returns {V}
 */
export function changeProperty<T,V>(object: V, prop: string[], value:T):V
{
    const lens = R.lensPath(prop);
    return R.set(lens, value, object);
}
//region map types
export class StringKeyedMap<T> { [key: string]: T;};
export class IntKeyedMap<T> { [key: number]: T;};
export type AnyMap=StringKeyedMap<any>;
//endregion

//region function types
import {Subscription} from "rxjs/Subscription";
export type MonadicSubscriptionCallback<T,V>=(result:T)=>V;
export type SubscriptionCallback<T>=MonadicSubscriptionCallback<T,void>;
export type ErrorCallback=(error:any)=>void;
export type CompleteCallback=()=>void;
export type SubscriptionFunction<T>=(okFunction: SubscriptionCallback<T>, errorFunction?: ErrorCallback, completeFunction?: CompleteCallback)=>Subscription;
//endregion


