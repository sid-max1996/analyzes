const valid = require('../data/valid');

exports.getColValue = function(col) {
    let td = $(col);
    let input = $(td.find("input[type=text]")[0]);
    if (valid.isHasValue(input.val())) return input.val();
    let textarea = $(td.find("textarea")[0]);
    if (valid.isHasValue(textarea.val())) return textarea.val();
    let select = $(td.find("select")[0]);
    if (valid.isHasValue(select.val())) return select.val();
    return td.text();
}

exports.clearColValue = function(col) {
    let td = $(col);
    let input = $(td.find("input[type=text]")[0]);
    let select = $(td.find("select")[0]);
    let textarea = $(td.find("textarea")[0]);
    if (valid.isHasValue(input.val())) input.val("");
    else if (valid.isHasValue(select.val())) select.val("");
    else if (valid.isHasValue(textarea.val())) textarea.val("");
    else td.text("");
}

exports.toggleRowClass = function(row, newClass, oldClass) {
    if (valid.isNotEmpty(oldClass))
        $(row).removeClass(oldClass);
    if (valid.isNotEmpty(newClass))
        $(row).addClass(newClass);
};

exports.removeRowClassPause = function(row, className, miliSec) {
    if (valid.isNotEmpty(className)) {
        setTimeout(() => {
            $(row).removeClass(className);
        }, miliSec);
    }
};