import {PP} from './types';
import {BeWatching} from './be-watching.js';

export function beVigilant(pp: PP, bw: BeWatching){
    const {queryInfo} = pp;
    const {query} = queryInfo!;
    const mutationObserver = new MutationObserver(
        async (mutationList: MutationRecord[], observer: MutationObserver) => {
            for(const mut of mutationList){
                const addedNodes = Array.from(mut.addedNodes);
                for(const node of addedNodes){
                    if(node instanceof Element){
                        if(!node.matches(query)) continue;
                        await bw.doAddedNode(pp, node);
                    }
                }
                const removedNodes = Array.from(mut.removedNodes);
                for(const node of removedNodes){
                    if(node instanceof Element){
                        if(!node.matches(query)) continue;
                        await bw.doRemovedNode(pp, node);
                    }                        
                }
            }
        }
    );
    return mutationObserver;

}