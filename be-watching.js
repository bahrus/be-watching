export class BeWatching extends EventTarget {
    #mutationObserver;
    async createQueryInfo({ for: f }) {
        const { getQuery } = await import('trans-render/lib/specialKeys.js');
        return {
            queryInfo: getQuery(f)
        };
    }
    async onTarget({ proxy, target, self }) {
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        return {
            targetVal: await findRealm(self, target)
        };
    }
    onNoTarget({ self }) {
        return {
            targetVal: self
        };
    }
    async onBeVigilant(pp) {
        this.#removeObserver();
        const { beVigilant } = await import('./beVigilant.js');
        this.#mutationObserver = beVigilant(pp, this);
        this.#mutationObserver.observe(pp.proxy.targetVal, pp);
    }
    async onDoInit(pp) {
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
    watchForBeacon(pp) {
        const { beaconEventName, beWatchFul, targetVal } = pp;
        targetVal.addEventListener(beaconEventName, async (e) => {
            const { proxy, subtree, self } = pp;
            proxy.beaconCount++;
            const { probe } = await import('./probe.js');
            const searchFrom = beWatchFul && subtree && proxy.beaconCount > 1 ? e.target.parentElement : self;
            probe(pp, this, searchFrom);
        }, {
            once: !beWatchFul
        });
    }
    finale(proxy) {
        proxy.targetVal = undefined;
        this.#removeObserver();
    }
}
export const virtualProps = ['subtree', 'attributes', 'characterData', 'childList', 'for', 'beVigilant', 'beWatchFul', 'doInit', 'doInitAfterBeacon',
    'beaconEventName', 'target', 'targetVal'];
const params = ['queryInfo', 'subtree', 'attributes', 'characterData', 'childList'];
export const actions = {
    onTarget: 'target',
    onNoTarget: {
        ifNoneOf: ['target']
    },
    onBeVigilant: {
        ifAllOf: ['beVigilant', 'targetVal', 'queryInfo'],
        ifKeyIn: params
    },
    onDoInit: {
        ifAllOf: ['doInit', 'targetVal', 'queryInfo'],
        ifNoneOf: ['doInitAfterBeacon'],
        ifKeyIn: params,
    },
    watchForBeacon: {
        ifAllOf: ['targetVal', 'queryInfo'],
        ifAtLeastOneOf: ['doInitAfterBeacon', 'beWatchFul']
    },
    createQueryInfo: 'for',
};
export const defaultProps = {
    beaconCount: 0,
    beaconEventName: 'i-am-here',
};
