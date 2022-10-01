import {PP} from './types';
import { BeWatching } from './be-watching.js';

export function probe(pp: PP, bw: BeWatching){
    const {self, for: f, subtree} = pp;
    let matches: Element[] | undefined;
    if(subtree){
        matches = Array.from(self.querySelectorAll(f!));
    }else{
        matches = Array.from(self.children).filter(x => x.matches(f!));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}