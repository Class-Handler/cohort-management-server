const cleanStudentsInput = (string) => {
    if(string && string.length !== 0)
    return string.replace(/\r?\n|\r|\n/g || "", "#").split("#")
      .filter((el) => el.trim().length)
      .map((el) => el.trim().toLowerCase());
  };

  module.exports = cleanStudentsInput