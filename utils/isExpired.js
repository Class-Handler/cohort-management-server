const isExpired = (date) => {

    const proJectExpDate = new Date(date)
    const now = Date.now()

    const differenceInMilliseconds = proJectExpDate - now;

    if(differenceInMilliseconds > 1000 * 60){
        return true
    } 

    return false
  };
  
  module.exports = isExpired;