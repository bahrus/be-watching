import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps<T = Element> extends MutationObserverInit {
    /**
     * css selector to watch for
     */
    for?: string,
    /**
     * do a css query for initial matches
     */
    doInit?: boolean,
    /**
     * wait for beacon event before doing init css query
     */
    doInitAfterBeacon?: boolean,
    /**
     * Name of event to watch for if doInitAfterBeacon
     */
    beaconEventName?: string,
    /**
     *  List for beacon events even after initial
     */
    beWatchFul?:  boolean,
    /**
     * Use mutation observer
     */
    beVigilant?: boolean,


}

export interface VirtualProps<T = Element> extends EndUserProps<T>, MinimalProxy<T>{
    beaconCount?: number,
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions<T = Element>{
    onBeVigilant(pp: PP): void;
    watchForBeacon(pp: PP): void;
    doInit(pp: PP): void;
    finale(): void;
}