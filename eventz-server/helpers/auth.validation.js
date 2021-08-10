const {
    validEmail,
    validPass,
    validString,
    validText
} = require('./validation');

exports.validSignUp = [
    validText("fname","First Name",48),
    validString(false,"lname","Last Name",20),
    validEmail("email"),
    validPass("password")
];

exports.validLogin = [
    validEmail("email"),
    validPass("password")
]

exports.validEmailId = [
    validEmail("email")
]

exports.validPassword = [
    validPass("password")
]

