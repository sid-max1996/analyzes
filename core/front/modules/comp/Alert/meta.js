const object = require('../../../../lib').meta.object;

exports.showError = function(isError, self, error, infoProp, textProp, showProp) {
    console.log(`showAlertError isError = ${isError}`);
    if (isError) object.setProps(self, [infoProp, textProp, showProp], ['danger', error, true]);
    else object.setProps(self, [infoProp, textProp, showProp], ['info', '', false]);
}

exports.showToggle = function(isSuccess, self, error, success, infoProp, textProp, showProp) {
    console.log(`showAlertToggle isSuccess = ${isSuccess}`);
    if (!isSuccess) {
        exports.showError(true, self, error, infoProp, textProp, showProp);
    } else {
        object.setProps(
            self, [infoProp, textProp, showProp], ['info', success, true]);
        object.setPropsPause(self, [showProp], [false], 2500);
    }
}