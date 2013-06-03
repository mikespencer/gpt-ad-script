define(function(){

  /**
   * estNowWithYear for determining ad flights.
   * @type {String}.
   */
  return (function () {
    var a = new Date(),
      e = a.getTime(),
      t = a.getDate(),
      // z = get date of the first sunday in the current month.
      z = (a.getDate() - a.getDay()) % 7,
      // s = if the current date is or before the first sunday of the current month, then the result will be 7 less than . This check returns the correct date of the first sunday of this month.
      s = (z <= 0) ? z + 7 : z,
      n = a.getMonth() + 1,
      m = (a.getTimezoneOffset() - ((n < 3 || n > 11) ? 300 : (n > 3 && n < 11) ? 240 : (n === 3) ? (t > (s + 7) || (t === (s + 7) && a.getHours() >= 2)) ? 240 : 300 : (t > s || (t === s && a.getHours() >= 2)) ? 300 : 240)) * 60000,
      b = new Date(e + m),
      d = '' + ((b.getYear() < 1900) ? b.getYear() + 1900 : b.getYear()) + (((b.getMonth() + 1) < 10) ? "0" + (b.getMonth() + 1) : (b.getMonth() + 1)) + ((b.getDate() < 10) ? "0" + b.getDate() : b.getDate()) + ((b.getHours() < 10) ? "0" + b.getHours() : b.getHours()) + ((b.getMinutes() < 10) ? "0" + b.getMinutes() : b.getMinutes());
    //window.estNowWithYear = d.toString();
    return d.toString();
  })();

});