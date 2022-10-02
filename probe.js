export function probe(pp, bw, container) {
    const { for: f, subtree, targetVal } = pp;
    let matches;
    const searchFrom = container || targetVal;
    if (subtree) {
        matches = Array.from(searchFrom.querySelectorAll(f));
    }
    else {
        matches = Array.from(searchFrom.children).filter(x => x.matches(f));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}
