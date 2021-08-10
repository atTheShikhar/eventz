const { check } = require("express-validator");

const stringErr = (field) => {
    return `Only strings are allowed for ${field}`;
}
const textErr = (field) => {
    return `Only alphabets and punctuations are allowed for ${field}`;
}
const numErr = (field) => {
    return `Only numbers are allowed for ${field}`;
}
const minLenErr = (field, num) => {
    return `Minimum ${num} characters are allowed for ${field}`;
}
const maxLenErr = (field, num) => {
    return `Maximum ${num} characters are allowed for ${field}`;
}
const exactLen = (field, num) => {
    return `Exactly ${num} characters are allowed for ${field}`;
}
const emptErr = (field) => {
    return `${field} cannot be empty!`;
}
const dateErr = (field, errtype) => {
    if (errtype === "invalid")
        return `Invalid ${field}`;

    return `${field} cannot be in ${errtype}!`;
}

exports.validString = (required, field, name, max) => {
    const rule = check(field).trim()
        .isString().withMessage(stringErr(name))
        .isLength({
            max: max
        }).withMessage(maxLenErr(name, max));
    if (required) {
        rule.notEmpty().withMessage(emptErr(name))
    }

    return rule;
}
exports.validText = (field, name, max) => {
    const rule = check(field).trim()
        .notEmpty().withMessage(emptErr(name))
        .isAlpha('en-US', { ignore: " .," }).withMessage(textErr(name))
        .isLength({
            max: max
        }).withMessage(maxLenErr(name, max))
    return rule;
}

exports.validNum = (field, name, len) => {
    const rule = check(field).trim()
        .notEmpty().withMessage(emptErr(name))
        .isNumeric({
            no_symbols: true
        }).withMessage(numErr(name))
        .isLength(
            {
                max: len,
                min: len
            }
        ).withMessage(exactLen(name, len))

    return rule;
}
exports.validDate = (field, name, pastOrFuture) => {
    const rule = check(field)
        .isISO8601().withMessage(dateErr(name, "invalid"))
        .custom((datePassed) => {
            const now = new Date();
            const date = new Date(datePassed);
            if (pastOrFuture === "past") {
                return (date > now);
            } else if (pastOrFuture === "future") {
                return (date < now);
            } else {
                return true;
            }
        }).withMessage(dateErr(name, pastOrFuture));
    return rule;
}
exports.validEmail = (field) => {
    const rule = check(field).trim()
        .isEmail().withMessage("Invalid email")
        .toLowerCase();
    return rule;
}
exports.validPass = (field) => {
    const rule = check(field)
        .isLength({
            min: 6
        }).withMessage("Passwords cannot be less than 6 characters!");
    return rule;
}