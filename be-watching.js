export class BeWatching extends EventTarget {
    #mutationObserver;
    onFor(pp) {
        const { for: f } = pp;
        this.#removeObserver();
        this.#mutationObserver = new MutationObserver(async (mutationList, observer) => {
            for (const mut of mutationList) {
                const addedNodes = Array.from(mut.addedNodes);
                for (const node of addedNodes) {
                    if (node instanceof Element) {
                        if (!node.matches(f))
                            continue;
                        await this.doAddedNode(pp, node);
                    }
                }
                const removedNodes = Array.from(mut.removedNodes);
                for (const node of removedNodes) {
                    if (node instanceof Element) {
                        if (!node.matches(f))
                            continue;
                        await this.doRemovedNode(pp, node);
                    }
                }
            }
        });
        this.#mutationObserver.observe(pp.proxy.self, pp);
    }
    #removeObserver() {
        if (!this.#mutationObserver) {
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }
    finale() {
        this.#removeObserver();
    }
}
export const virtualProps = ['subtree', 'attributes', 'characterData', 'childList', 'for'];
export const actions = {
    onFor: {
        ifAllOf: ['for'],
        ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList']
    }
};
