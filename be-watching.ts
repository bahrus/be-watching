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
        const {probe} = await import('./probe.js');
        probe(pp, this);
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

    watchForBeacon({beaconEventName, proxy, beWatchFul}: ProxyProps): void {
        self.addEventListener(beaconEventName!, e => {
            proxy.beaconCount!++;
        }, {
            once: !beWatchFul
        })
    }
    
    finale(){
        this.#removeObserver();
    }
}

export const virtualProps : (keyof VirtualProps)[] = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon', 'beaconEventName'];

const params : (keyof Proxy)[]  = ['for', 'subtree', 'attributes', 'characterData', 'childList'];

export const actions:  Partial<{[key in keyof Actions]: Action<Proxy>}> = {
    onBeVigilant: {
        ifAllOf:  ['beVigilant'],
        ifKeyIn:  params
    },
    doInit: {
        ifAllOf: ['doInit'],
        ifNoneOf: ['doInitAfterBeacon'],
        ifKeyIn: params,
    },
    watchForBeacon: {
        ifAtLeastOneOf: ['doInitAfterBeacon', 'beWatchFul']
    }
}

export const defaultProps: Partial<Proxy> = {
    beaconCount: 0,
    beaconEventName: 'i-am-here',
}
