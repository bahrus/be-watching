import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';

export abstract class BeWatching extends EventTarget implements Actions {
    #mutationObserver: MutationObserver | undefined;
    
    onFor(pp: PP): void {
        this.removeObserver();
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(pp.proxy.self!, pp);
    }

    removeObserver(){
        if(!this.#mutationObserver){
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }

    abstract callback: (mutationList: MutationRecord[], observer: MutationObserver) => void;

    
    finale(){
        this.removeObserver();
    }
}

export const virtualProps : (keyof VirtualProps)[] = ['subtree', 'attributes', 'characterData', 'childList', 'for']