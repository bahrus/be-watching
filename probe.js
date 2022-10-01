export function probe(pp, bw) {
    const { self, for: f, subtree } = pp;
    let matches;
    if (subtree) {
        matches = Array.from(self.querySelectorAll(f));
    }
    else {
        matches = Array.from(self.children).filter(x => x.matches(f));
    }
    matches.forEach(m => bw.doAddedNode(pp, m));
}
