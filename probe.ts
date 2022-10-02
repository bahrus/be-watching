import {PP} from './types';
import { BeWatching } from './be-watching.js';

export function probe(pp: PP, bw: BeWatching, container?: Element | null){
    const {for: f, subtree, targetVal} = pp;
    let matches: Element[] | undefined;
    const searchFrom = container || targetVal!;
    if(subtree){
        matches = Array.from(searchFrom.querySelectorAll(f!));
    }else{
        matches = Array.from(searchFrom.children).filter(x => x.matches(f!));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}