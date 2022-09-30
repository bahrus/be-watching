import {Actions, Proxy, PP, VirtualProps, ProxyProps} from './types';
import {Action} from 'trans-render/lib/types';

export abstract class BeWatching extends EventTarget implements Actions {
    #mutationObserver: MutationObserver | undefined;
    
    onFor(pp: PP): void {
        const {for: f} = pp;
        this.removeObserver();
        this.#mutationObserver = new MutationObserver(
            async (mutationList: MutationRecord[], observer: MutationObserver) => {
                for(const mut of mutationList){
                    const addedNodes = Array.from(mut.addedNodes);
                    for(const node of addedNodes){
                        if(node instanceof Element){
                            if(!node.matches(f!)) continue;
                            await this.doAddedNode(pp, node);
                        }
                    }
                    const removedNodes = Array.from(mut.removedNodes);
                    for(const node of removedNodes){
                        if(node instanceof Element){
                            if(!node.matches(f!)) continue;
                            await this.doRemovedNode(pp, node);
                        }                        
                    }
                }
            }
        );
        this.#mutationObserver.observe(pp.proxy.self!, pp);
    }

    removeObserver(){
        if(!this.#mutationObserver){
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }

    abstract doAddedNode(pp: PP, node: Node): void | Promise<void>;

    abstract doRemovedNode(pp: PP, node: Node): void | Promise<void>;
    
    finale(){
        this.removeObserver();
    }
}

export const virtualProps : (keyof VirtualProps)[] = ['subtree', 'attributes', 'characterData', 'childList', 'for'];

export const doOnFor : Action<Proxy> = {
    ifAllOf: ['for'],
    ifKeyIn:  ['subtree', 'attributes', 'characterData', 'childList']
};