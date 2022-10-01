import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';
import {Action} from 'trans-render/lib/types';

export abstract class BeWatching extends EventTarget implements Actions {
    #mutationObserver: MutationObserver | undefined;
    
    async onBeVigilant(pp: PP) {
        
        this.#removeObserver();
        const {beVigilant} = await import('./beVigilant.js');
        this.#mutationObserver = beVigilant(pp, this);
        this.#mutationObserver.observe(pp.proxy.self!, pp);
    }

    async doInit(pp: PP){
        
    }

    #removeObserver(){
        if(!this.#mutationObserver){
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }

    abstract doAddedNode(pp: PP, node: Node): void | Promise<void>;

    abstract doRemovedNode(pp: PP, node: Node): void | Promise<void>;
    
    finale(){
        this.#removeObserver();
    }
}

export const virtualProps : (keyof VirtualProps)[] = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon', 'beaconEventName'];

export const actions:  Partial<{[key in keyof Actions]: Action<Proxy>}> = {
    onBeVigilant: {
        ifAllOf:  ['beVigilant'],
        ifKeyIn:  ['for', 'subtree', 'attributes', 'characterData', 'childList']
    }
}
