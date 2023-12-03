const { v4: uuidv4 } = require('uuid');

const getOneTimeProjectCode = (date) => {
  const oneTimeId = {
    uuId: uuidv4(),
    expirationDate: date,
  };
  return oneTimeId;
};

module.exports = getOneTimeProjectCode
