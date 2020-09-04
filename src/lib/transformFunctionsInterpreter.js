import Helper from './helper'

class TransformFunctionsInterpreter {
    constructor() {
        const functionStartCharRegex = /^[_a-zA-Z]$/;
        const functionCharRegex = /^\w$/;
        const ParameterChar = /^[\-.%0-9a-zA-Z]$/;

        const valueRegex = /^-?\d+(\.\d+)?/;
        const unitRegex = /[a-zA-Z]*$/;

        const numberRegex = /^-?\d+(\.\d+)?$/;
        const angleRegex = /^(-?\d+(\.\d+)?(deg)|(grad)|(rad)|(turn))|0$/;
        const lengthRegex = /^(\d+(\.\d+)?px)|0$/;

        this.toObject = function (transformFunctionsCode) {
            if (Helper.isEmpty(transformFunctionsCode)) return {};

            let states = 0;
            let object = {};
            let functionName = null;
            let parameter = null;
            for (let char of transformFunctionsCode) {
                switch (states) {
                    case 0:
                        if (functionStartCharRegex.test(char)) {
                            functionName = char;
                            states = 1;
                        } else if (char != ' ') throw new SyntaxError();
                        break;
                    case 1:
                        if (functionCharRegex.test(char)) {
                            functionName = functionName.concat(char);
                        } else if (char === '(') {
                            if (typeof object[functionName] != 'undefined') throw new SyntaxError();
                            object[functionName] = [];
                            states = 2;
                        } else if (char === ' ') {
                            object[functionName] = null;
                            states = 0;
                        } else throw new SyntaxError();
                        break;
                    case 2:
                        if (ParameterChar.test(char)) {
                            parameter = char;
                            states = 3;
                        } else if (char != ' ') throw new SyntaxError();
                        break;
                    case 3:
                        if (ParameterChar.test(char)) {
                            parameter = parameter.concat(char);
                        } else if (char === ',') {
                            object[functionName].push(parameter);
                            states = 2;
                        } else if (char === ')') {
                            object[functionName].push(parameter);
                            states = 0;
                        } else if (char === ' ') states = 4;
                        else throw new SyntaxError();
                        break;
                    case 4:
                        if (char === ',') {
                            object[functionName].push(parameter);
                            states = 2;
                        } else if (char === ')') {
                            object[functionName].push(parameter);
                            states = 0;
                        } else if (char != ' ') throw new SyntaxError();
                        break;
                }
            }

            return check(object);
        }
        const valueCheck = {
            number: function (value) {
                if (!numberRegex.test(value)) throw new TypeError();
                return {
                    type: 'number',
                    value: parseFloat(value),
                    unit: ''
                }
            },
            angle: function (value) {
                if (!angleRegex.test(value)) throw new TypeError();
                return {
                    type: 'angle',
                    value: parseFloat(valueRegex.exec(value)[0]),
                    unit: unitRegex.exec(value)[0]
                }
            },
            length: function (value) {
                if (!lengthRegex.test(value)) throw new TypeError();
                return {
                    type: 'length',
                    value: parseFloat(valueRegex.exec(value)[0]),
                    unit: unitRegex.exec(value)[0]
                }
            }
        }
        const functionCheck = {
            matrix: function (parameters) {
                if (parameters === null | parameters.length != 6)
                    throw new SyntaxError();
                return {
                    a: valueCheck.number(parameters[0]),
                    b: valueCheck.number(parameters[1]),
                    c: valueCheck.number(parameters[2]),
                    d: valueCheck.number(parameters[3]),
                    tx: valueCheck.number(parameters[4]),
                    ty: valueCheck.number(parameters[5])
                }
            },
            translate: function (parameters) {
                if (parameters === null | parameters.length < 1 | parameters.length > 2)
                    throw new SyntaxError();
                let tx = valueCheck.length(parameters[0]);
                return {
                    tx: tx,
                    ty: parameters.length === 2 ? valueCheck.length(parameters[1]) : tx
                }
            },
            translateX: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    t: valueCheck.length(parameters[0])
                }
            },
            translateY: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    t: valueCheck.length(parameters[0])
                }
            },
            scale: function (parameters) {
                if (parameters === null | parameters.length < 1 | parameters.length > 2)
                    throw new SyntaxError();
                let sx = valueCheck.number(parameters[0]);
                return {
                    sx: sx,
                    sy: parameters.length === 2 ? valueCheck.number(parameters[1]) : sx
                }
            },
            scaleX: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    s: valueCheck.number(parameters[0])
                }
            },
            scaleY: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    s: valueCheck.number(parameters[0])
                }
            },
            rotate: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            skew: function (parameters) {
                if (parameters === null | parameters.length < 1 | parameters.length > 2)
                    throw new SyntaxError();
                let ax = valueCheck.angle(parameters[0]);
                return {
                    ax: ax,
                    ay: parameters.length === 2 ? valueCheck.angle(parameters[1]) : ax
                }
            },
            skewX: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            skewY: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            matrix3d: function (parameters) {
                if (parameters === null | parameters.length != 16)
                    throw new SyntaxError();
                return {
                    a1: valueCheck.number(parameters[0]),
                    b1: valueCheck.number(parameters[1]),
                    c1: valueCheck.number(parameters[2]),
                    d1: valueCheck.number(parameters[3]),
                    a2: valueCheck.number(parameters[4]),
                    b2: valueCheck.number(parameters[5]),
                    c2: valueCheck.number(parameters[6]),
                    d2: valueCheck.number(parameters[7]),
                    a3: valueCheck.number(parameters[8]),
                    b3: valueCheck.number(parameters[9]),
                    c3: valueCheck.number(parameters[10]),
                    d3: valueCheck.number(parameters[11]),
                    a4: valueCheck.number(parameters[12]),
                    b4: valueCheck.number(parameters[13]),
                    c4: valueCheck.number(parameters[14]),
                    d4: valueCheck.number(parameters[15])
                }
            },
            translate3d: function (parameters) {
                if (parameters === null | parameters.length != 3)
                    throw new SyntaxError();
                return {
                    tx: valueCheck.length(parameters[0]),
                    ty: valueCheck.length(parameters[1]),
                    tz: valueCheck.length(parameters[2])
                }
            },
            translateZ: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    t: valueCheck.length(parameters[0])
                }
            },
            scale3d: function (parameters) {
                if (parameters === null | parameters.length != 3)
                    throw new SyntaxError();
                return {
                    sx: valueCheck.number(parameters[0]),
                    sy: valueCheck.number(parameters[1]),
                    sz: valueCheck.number(parameters[2])
                }
            },
            scaleZ: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    s: valueCheck.number(parameters[0])
                }
            },
            rotate3d: function (parameters) {
                if (parameters === null | parameters.length != 4)
                    throw new SyntaxError();
                return {
                    x: valueCheck.number(parameters[0]),
                    y: valueCheck.number(parameters[1]),
                    z: valueCheck.number(parameters[2]),
                    a: valueCheck.angle(parameters[3])
                }
            },
            rotateX: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            rotateY: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            rotateZ: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    a: valueCheck.angle(parameters[0])
                }
            },
            perspective: function (parameters) {
                if (parameters === null | parameters.length != 1)
                    throw new SyntaxError();
                return {
                    l: valueCheck.length(parameters[0])
                }
            }
        }
        function check(object) {
            let _object = {};
            for (let functionName in object)
                _object[functionName] = functionCheck[functionName](object[functionName]);
            return _object;
        }
    }
    static getAngleValue(angleObject) {
        if (angleObject.type != 'angle') throw new RangeError();
        switch (angleObject.unit) {
            case 'deg': return angleObject.value * Math.PI / 180;
            case 'grad': return angleObject.value * Math.PI / 200;
            case 'rad': return angleObject.value;
            case 'turn': return angleObject.value * 2 * Math.PI;
            default: throw new RangeError();
        }
    }
}

export default TransformFunctionsInterpreter