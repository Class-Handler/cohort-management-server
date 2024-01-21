const validatePartecipant = (partecipantsArr, studentName) => {
  const isPartecipant = partecipantsArr.filter((el) => {
    return el.studentName === studentName.trim().toLowerCase();
  });
  console.log(isPartecipant)

    return isPartecipant

};

module.exports = validatePartecipant;
