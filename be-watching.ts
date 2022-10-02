import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';
import {Action} from 'trans-render/lib/types';

export abstract class BeWatching extends EventTarget implements Actions {
    #mutationObserver: MutationObserver | undefined;

    async createQueryInfo({for: f}: PP) {
        const {getQuery} = await import('trans-render/lib/specialKeys.js');
        return {
            queryInfo: getQuery(f!)
        }
        
    }
    
    async onTarget({proxy, target, self}: PP){
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        return {
            targetVal: await findRealm(self, target!)
        };
    }
    onNoTarget({self}: PP){
        return {
            targetVal: self
        };
    }
    async onBeVigilant(pp: PP) {
        
        this.#removeObserver();
        const {beVigilant} = await import('./beVigilant.js');
        this.#mutationObserver = beVigilant(pp, this);
        this.#mutationObserver.observe(pp.proxy.targetVal!, pp);
    }

    async onDoInit(pp: PP){
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

    watchForBeacon(pp:  PP): void {
        const {beaconEventName, beWatchFul, targetVal } = pp;
        targetVal!.addEventListener(beaconEventName!, async e => {
            const {proxy, subtree, self} = pp;
            proxy.beaconCount!++;
            const {probe} = await import('./probe.js');
            const searchFrom = beWatchFul && subtree && proxy.beaconCount! > 1 ? (e.target as Element).parentElement : self;
            probe(pp, this, searchFrom);

        }, {
            once: !beWatchFul
        })
    }
    
    finale(proxy: Proxy){
        proxy.targetVal = undefined;
        this.#removeObserver();
        
    }
}

export const virtualProps : (keyof VirtualProps)[] = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon',
 'beaconEventName', 'target', 'targetVal'];

const params : (keyof Proxy)[]  = ['queryInfo', 'subtree', 'attributes', 'characterData', 'childList'];

export const actions:  Partial<{[key in keyof Actions]: Action<Proxy> | keyof Proxy}> = {
    onTarget: 'target',
    onNoTarget:{
        ifNoneOf: ['target']
    },
    onBeVigilant: {
        ifAllOf:  ['beVigilant', 'targetVal', 'queryInfo'],
        ifKeyIn:  params
    },
    onDoInit: {
        ifAllOf: ['doInit', 'targetVal', 'queryInfo'],
        ifNoneOf: ['doInitAfterBeacon'],
        ifKeyIn: params,
    },
    watchForBeacon: {
        ifAllOf: ['targetVal', 'queryInfo'],
        ifAtLeastOneOf: ['doInitAfterBeacon', 'beWatchFul']
    },
    createQueryInfo: 'for',
}

export const defaultProps: Partial<Proxy> = {
    beaconCount: 0,
    beaconEventName: 'i-am-here',
}
