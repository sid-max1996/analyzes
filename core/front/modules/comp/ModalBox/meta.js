exports.hide = function(self, isShowProp, textProp) {
    self[isShowProp] = false;
    self[textProp] = '';
}

exports.show = function(self, text, isShowProp, textProp) {
    self[isShowProp] = true;
    self[textProp] = text;
}