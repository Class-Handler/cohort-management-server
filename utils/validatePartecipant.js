const validatePartecipant = (partecipantsArr, studentName) => {
  const partecipants = partecipantsArr.map((el) => {
    return el.studentName;
  });
  const isPartecipant = () =>
    partecipants.includes(studentName.trim().toLowerCase());

    return isPartecipant()

};

module.exports = validatePartecipant;
