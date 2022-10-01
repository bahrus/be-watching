export class BeWatching extends EventTarget {
    #mutationObserver;
    async onBeVigilant(pp) {
        this.#removeObserver();
        const { beVigilant } = await import('./beVigilant.js');
        this.#mutationObserver = beVigilant(pp, this);
        this.#mutationObserver.observe(pp.proxy.self, pp);
    }
    async doInit(pp) {
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
export const virtualProps = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon', 'beaconEventName'];
export const actions = {
    onBeVigilant: {
        ifAllOf: ['beVigilant'],
        ifKeyIn: ['for', 'subtree', 'attributes', 'characterData', 'childList']
    }
};
