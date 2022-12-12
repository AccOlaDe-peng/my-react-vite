/**
 * @description:
 * @author: pengrenchang
 * @Date: 2022-11-07 13:58:13
 * @LastEditors: pengrenchang
 * @LastEditTime: 2022-11-07 15:33:16
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

export class myPromise {
    private status: string;
    private value: unknown;
    private reason: unknown;
    onResolvedCallbacks: any[];
    onRejectedCallbacks: any[];

    constructor(executor: Function) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        console.log("开始执行", this.status);

        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            this._reject(error);
        }
    }

    _resolve = (value: unknown) => {
        if (this.status === PENDING) {
            this.status = FULFILLED;
            this.value = value;
            console.log("执行结束", this.status);
            this.onResolvedCallbacks.forEach((fn) => fn(this.value));
        }
    };

    _reject = (reason: unknown) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            this.onRejectedCallbacks.forEach((fn) => fn(this.reason));
        }
    };

    then(onResolved: Function, onRejected?: Function) {
        if (typeof onResolved !== "function")
            onResolved = (value: any) => value;
        if (typeof onRejected !== "function")
            onRejected = (reason: any) => {
                throw reason;
            };

        let promise = new myPromise((resolve: Function, reject: Function) => {
            if (this.status === FULFILLED) {
                setTimeout(() => resolve(onResolved && onResolved(this.value)));
            }

            if (this.status === REJECTED) {
                setTimeout(() => resolve(onRejected && onRejected(this.value)));
            }

            if (this.status === PENDING) {
                console.log("then中的PENDING");

                if (this._isFunction(onResolved)) {
                    this.onResolvedCallbacks.push(() =>
                        setTimeout(() => {
                            try {
                                this.resolvedPromise(
                                    promise,
                                    onResolved && onResolved(this.value),
                                    resolve,
                                    reject
                                );
                            } catch (error) {
                                reject(error);
                            }
                        })
                    );
                }
                if (this._isFunction(onRejected)) {
                    this.onRejectedCallbacks.push(() =>
                        setTimeout(() => {
                            try {
                                this.resolvedPromise(
                                    promise,
                                    onRejected && onRejected(this.reason),
                                    resolve,
                                    reject
                                );
                            } catch (error) {
                                reject(error);
                            }
                        })
                    );
                }
            }
        });
        return promise;
    }

    resolvedPromise(promise: any, result: any, resolve: any, reject: any) {
        if (promise === result)
            reject(new TypeError("Chaining cycle detected for promise"));
        if (
            (result && typeof result === "object") ||
            typeof result === "function"
        ) {
            let called: any;
            try {
                let then = result.then;
                if (typeof then === "function") {
                    then.call(
                        result,
                        (value: any) => {
                            if (called) return;
                            called = true;
                            this.resolvedPromise(
                                promise,
                                value,
                                resolve,
                                reject
                            );
                        },
                        (reason: any) => {
                            if (called) return;
                            called = true;
                            reject(reason);
                        }
                    );
                } else {
                    if (called) return;
                    called = true;
                    resolve(result);
                }
            } catch (error) {
                if (called) return;
                called = true;
                reject(error);
            }
        } else {
            resolve(result);
        }
    }

    _isFunction(fn: Function | undefined) {
        return typeof fn === "function";
    }

    static resolve(value: any) {
        let promise = new myPromise((resolve: Function, reject: Function) => {
            setTimeout(() => {
                promise.resolvedPromise(promise, value, resolve, reject);
            });
        });
        return promise;
    }

    static reject(reason: any) {
        return new myPromise((resolve: Function, reject: Function) => {
            reject(reason);
        });
    }

    static all(promises: any) {
        return new myPromise((resolve: Function, reject: Function) => {
            let result: any = [];
            let count = 0;
            let currentIndex = 0;
            for (let promise of promises) {
                let resultIndex = currentIndex;
                currentIndex += 1;
                myPromise.resolve(promise).then(
                    (value: any) => {
                        result[resultIndex] = value;
                        count += 1;
                        if (count === currentIndex) resolve(result);
                    },
                    (reason: any) => {
                        reject(reason);
                    }
                );
            }
            if (currentIndex === 0) resolve(result);
        });
    }
}
