import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps<T = Element> extends MutationObserverInit {
    for?: string,
}

export interface VirtualProps<T = Element> extends EndUserProps<T>, MinimalProxy<T>{

}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions<T = Element>{
    onFor(pp: PP): void;

    finale(): void;
}