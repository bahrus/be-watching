export function probe(pp, bw, container) {
    const { queryInfo, subtree, targetVal } = pp;
    let matches;
    const searchFrom = container || targetVal;
    const { query } = queryInfo;
    if (subtree) {
        matches = Array.from(searchFrom.querySelectorAll(query));
    }
    else {
        matches = Array.from(searchFrom.children).filter(x => x.matches(query));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}
