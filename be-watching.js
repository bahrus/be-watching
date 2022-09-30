export class BeWatching extends EventTarget {
    #mutationObserver;
    onFor(pp) {
        this.removeObserver();
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(pp.proxy.self, pp);
    }
    removeObserver() {
        if (!this.#mutationObserver) {
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }
    finale() {
        this.removeObserver();
    }
}
export const virtualProps = ['subtree', 'attributes', 'characterData', 'childList', 'for'];
