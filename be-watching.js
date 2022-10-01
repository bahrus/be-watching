export class BeWatching extends EventTarget {
    #mutationObserver;
    async onBeVigilant(pp) {
        this.#removeObserver();
        const { beVigilant } = await import('./beVigilant.js');
        this.#mutationObserver = beVigilant(pp, this);
        this.#mutationObserver.observe(pp.proxy.self, pp);
    }
    async doInit(pp) {
        const { probe } = await import('./probe.js');
        probe(pp, this);
    }
    #removeObserver() {
        if (!this.#mutationObserver) {
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }
    watchForBeacon({ beaconEventName, proxy, beWatchFul }) {
        self.addEventListener(beaconEventName, e => {
            proxy.beaconCount++;
        }, {
            once: !beWatchFul
        });
    }
    finale() {
        this.#removeObserver();
    }
}
export const virtualProps = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon', 'beaconEventName'];
const params = ['for', 'subtree', 'attributes', 'characterData', 'childList'];
export const actions = {
    onBeVigilant: {
        ifAllOf: ['beVigilant'],
        ifKeyIn: params
    },
    doInit: {
        ifAllOf: ['doInit'],
        ifNoneOf: ['doInitAfterBeacon'],
        ifKeyIn: params,
    },
    watchForBeacon: {
        ifAtLeastOneOf: ['doInitAfterBeacon', 'beWatchFul']
    }
};
export const defaultProps = {
    beaconCount: 0,
    beaconEventName: 'i-am-here',
};
