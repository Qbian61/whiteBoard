"use strict";

function util() {
}

util.inherits = function (ctor, superCtor) {
    if (ctor === undefined || ctor === null) throw new TypeError('The constructor to "inherits" must not be ' + "null or undefined");
    if (superCtor === undefined || superCtor === null) throw new TypeError('The super constructor to "inherits" must not ' + "be null or undefined");
    if (superCtor.prototype === undefined) throw new TypeError('The super constructor to "inherits" must ' + "have a prototype");
    ctor.super_ = superCtor;

    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    } else {
        if (ctor.prototype.__proto__ === undefined) {

            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });

            return;
        }
        ctor.prototype.__proto__ = superCtor.prototype;
    }
};
