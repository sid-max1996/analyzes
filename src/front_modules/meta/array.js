const valid = require('../data/valid');

exports.pushPropsValues = function(props, values, propsPush, valuesPush) {
    valuesPush.forEach((valuePush, ind) => {
        if (valid.isHasValue(valuePush) && valid.isHasValue(propsPush[ind])) {
            props.push(propsPush[ind]);
            values.push(valuePush);
        }
    });
}