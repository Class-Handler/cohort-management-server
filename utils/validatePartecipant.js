const validatePartecipant = (partecipantsArr, studentName) => {
  const isPartecipant = partecipantsArr.filter((el) => {
    return (
      el.studentName.startsWith(studentName.trim().toLowerCase()) &&
      el.studentName.includes(studentName.trim().toLowerCase())
    );
  });
  return isPartecipant;
};

module.exports = validatePartecipant;
