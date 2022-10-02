import {PP} from './types';
import { BeWatching } from './be-watching.js';

export function probe(pp: PP, bw: BeWatching, container?: Element | null){
    const {queryInfo, subtree, targetVal} = pp;
    let matches: Element[] | undefined;
    const searchFrom = container || targetVal!;
    const {query} = queryInfo!;
    if(subtree){
        matches = Array.from(searchFrom.querySelectorAll(query));
    }else{
        matches = Array.from(searchFrom.children).filter(x => x.matches(query));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}