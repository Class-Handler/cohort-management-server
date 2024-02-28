const { validate: uuidValidate } = require("uuid");

const validateCode = (code) => {
    return uuidValidate(code)
};

module.exports = validateCode;
