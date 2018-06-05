const check = require('../../../lib').valid.check;

exports.getColValue = function(col) {
    let td = $(col);
    let input = $(td.find("input[type=text]")[0]);
    let textarea = $(td.find("textarea")[0]);
    let select = $(td.find("select")[0]);
    if ((check.notNull(textarea.val()) || check.notNull(input.val())) && check.notNull(select.val())) {
        let op = select.val();
        let text = check.notNull(textarea.val()) ? textarea.val() : input.val();
        return { op: op, text: text };
    }
    if (check.notNull(input.val())) return { text: input.val() };
    if (check.notNull(textarea.val())) return { text: textarea.val() };
    if (check.notNull(select.val()) && select.is("[multiple]")) return { ops: select.val() };
    if (check.notNull(select.val())) return { op: select.val() };
    return { text: td.text() };
}

exports.clearColValue = function(col) {
    let td = $(col);
    let input = $(td.find("input[type=text]")[0]);
    let select = $(td.find("select")[0]);
    let textarea = $(td.find("textarea")[0]);
    if (check.notNull(input.val())) input.val("");
    if (check.notNull(select.val())) select.val(" ");
    if (check.notNull(textarea.val())) textarea.val("");
}

exports.toggleRowClass = function(row, newClass, oldClass) {
    if (check.notEmpty(oldClass))
        $(row).removeClass(oldClass);
    if (check.notEmpty(newClass))
        $(row).addClass(newClass);
};

exports.removeRowClassPause = function(row, className, miliSec) {
    if (check.notEmpty(className)) {
        setTimeout(() => {
            $(row).removeClass(className);
        }, miliSec);
    }
};