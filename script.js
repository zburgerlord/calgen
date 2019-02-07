

const MWBUTTON = document.getElementById("MW-button");
const TRBUTTON = document.getElementById("TR-button");
const FRIBUTTON = document.getElementById("FRI-button");
const SATBUTTON = document.getElementById("SAT-button");


var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function mwSched() {

  //get the dates and blank out the table (in case they are doing more than one without refreshing the page)
  document.getElementById("docx").innerHTML = "";
  var semStart = document.getElementById("semStartDate").valueAsDate;
  var semEnd = document.getElementById("semEndDate").valueAsDate;

  //make sure they chose a date and that the dates aren't backwards
  if (semStart == null || semEnd == null) {
    alert("You will need to select both start and end dates to create the document.");

  }

  if (semStart.getTime() > semEnd.getTime()) {
    alert("The Semester End Date cannot be before the Semester Start Date.")
  }

  else {

  //fix the timezone problem to prevent the first date being the day before the one actually selected
  semStart.setHours((semStart.getHours()) + (semStart.getTimezoneOffset() / 60));

  //get the dates as numbers
  var datEnd = semEnd.getTime();
  var datStar = semStart.getTime();
  var allRays = [datStar]

  // get all the dates in the range into an array as numbers
  while (datStar <= datEnd) {
    datStar += (1000 * 60 * 60 * 24);
    allRays.push(datStar);
  }

  //change array back to dates and filter chosen dates into prinRays array
  const datRays = allRays.map(x => new Date(x));

  function pullDays (value) {
    return new Date(value).getDay() == 1 || new Date(value).getDay() == 3;

  }
  var prinRays = datRays.filter(pullDays);


console.log(Math.ceil(prinRays.length/2) + " weeks");




//hide the div with the table before writing stuff to it
  document.getElementById("docx").classList.add("hide");

//make table
  var docxDiv = document.getElementById("docx");
  var newTab = document.createElement("table");
  var firsRow = document.createElement("tr");


  //create first row (headings) and add the text and set scope (for accessibility)
  var firsCell1 = document.createElement("th");
  firsCell1.classList.add("row-primo");
  firsCell1.setAttribute("scope", "col");
  var firsCell2 = document.createElement("th");
  firsCell2.classList.add("row-primo");
  firsCell2.setAttribute("scope", "col");
  var firsCell3 = document.createElement("th");
  firsCell3.classList.add("row-primo");
  firsCell3.setAttribute("scope", "col");
  var firsrowText1 = document.createTextNode("Week #");
  var firsrowText2 = document.createTextNode("Class 1");
  var firsrowText3 = document.createTextNode("Class 2");


  docxDiv.appendChild(newTab);
  newTab.appendChild(firsRow);
  firsRow.appendChild(firsCell1);
  firsRow.appendChild(firsCell2);
  firsRow.appendChild(firsCell3);
  firsCell1.appendChild(firsrowText1);
  firsCell2.appendChild(firsrowText2);
  firsCell3.appendChild(firsrowText3);


  newTab.setAttribute("border", "2");

  //generate weeks and dates cells using the prinRays array to populate


  var count = 1
  var week = 1

//put a blank cell if Monday of a week is after the start date
//also put a blank cell if end date is before a Wednesday
  if (1 < semStart.getDay() <= 3 && semStart.getDay() !== 1) {

      var row = document.createElement("tr");
      var col1 = document.createElement("td");
      var col2 = document.createElement("td");
      var col3 = document.createElement("td");
      var newLine = document.createElement("br");
      var weekText1 = document.createTextNode("Week " + week);
      var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
      var col3Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
      var nullSpot = document.createTextNode("  ");

      if (prinRays[count] == undefined) {
        var col3Text = document.createTextNode("  ");
      }

      newTab.appendChild(row);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      col1.appendChild(weekText1);
      col1.appendChild(newLine);
      col1.appendChild(weekText2);
      col2.appendChild(nullSpot);
      col3.appendChild(col3Text);

      count = count + 1;
      week++
    }

//write the dates and cells
  while (count <= prinRays.length) {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var col3 = document.createElement("td");
    var newLine = document.createElement("br");
    var weekText1 = document.createTextNode("Week " + week);
    var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
    var col2Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
    var col3Text = document.createTextNode(weekday[new Date(prinRays[count]).getDay()] + " " + ((new Date(prinRays[count]).getMonth()) + 1) + "/" + (new Date(prinRays[count]).getDate()));
    var nullSpot = document.createTextNode("  ");

    if (prinRays[count] == undefined) {
      var col3Text = document.createTextNode("  ");
    }

    newTab.appendChild(row);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    col1.appendChild(weekText1);
    col1.appendChild(newLine);
    col1.appendChild(weekText2);
    col2.appendChild(col2Text);
    col3.appendChild(col3Text);



    count = count + 2;
    week++
  }

//make table into Word doc
  var html, link, blob, url, css;
  css = (
     '<style>' +
     '@page docx{size: 11.0in 8.5in;mso-page-orientation: portrait;}' +
     'div.docx {page: docx;}' +
     'table{width: 100%;border-collapse:collapse;white-space: no-wrap;}td{border:1px gray solid;width:5em;padding:2px;}'+
     '</style>'
   );

   html = window.docx.innerHTML;
   blob = new Blob(['\ufeff', css + html], {
     type: 'application/msword'
   });
   url = URL.createObjectURL(blob);
   link = document.createElement('A');
   link.href = url;
   // Set default file name.
   // Word will append file extension - do not add an extension here.
   link.download = 'MW Course Calendar';
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
   		else link.click();  // other browsers
   document.body.removeChild(link);


 }

}



function trSched() {

  //get the dates and blank out the table (in case they are doing more than one without refreshing the page)
  document.getElementById("docx").innerHTML = "";
  var semStart = document.getElementById("semStartDate").valueAsDate;
  var semEnd = document.getElementById("semEndDate").valueAsDate;

  //make sure they chose a date and that the dates aren't backwards
  if (semStart == null || semEnd == null) {
    alert("You will need to select both start and end dates to create the document.");

  }

  if (semStart.getTime() > semEnd.getTime()) {
    alert("The Semester End Date cannot be before the Semester Start Date.")
  }

  else {

  //fix the timezone problem to prevent the first date being the day before the one actually selected
  semStart.setHours((semStart.getHours()) + (semStart.getTimezoneOffset() / 60));

  //get the dates as numbers
  var datEnd = semEnd.getTime();
  var datStar = semStart.getTime();
  var allRays = [datStar]

  // get all the dates in the range into an array as numbers
  while (datStar <= datEnd) {
    datStar += (1000 * 60 * 60 * 24);
    allRays.push(datStar);
  }

  //change array back to dates and filter chosen dates into prinRays array
  const datRays = allRays.map(x => new Date(x));

  function pullDays (value) {
    return new Date(value).getDay() == 2 || new Date(value).getDay() == 4;

  }
  var prinRays = datRays.filter(pullDays);

console.log(prinRays[0]);

console.log(Math.ceil(prinRays.length/2) + " weeks");




//hide the div with the table before writing stuff to it
  document.getElementById("docx").classList.add("hide");

//make table
  var docxDiv = document.getElementById("docx");
  var newTab = document.createElement("table");
  var firsRow = document.createElement("tr");


  //create first row (headings) and add the text and set scope (for accessibility)
  var firsCell1 = document.createElement("th");
  firsCell1.classList.add("row-primo");
  firsCell1.setAttribute("scope", "col");
  var firsCell2 = document.createElement("th");
  firsCell2.classList.add("row-primo");
  firsCell2.setAttribute("scope", "col");
  var firsCell3 = document.createElement("th");
  firsCell3.classList.add("row-primo");
  firsCell3.setAttribute("scope", "col");
  var firsrowText1 = document.createTextNode("Week #");
  var firsrowText2 = document.createTextNode("Class 1");
  var firsrowText3 = document.createTextNode("Class 2");


  docxDiv.appendChild(newTab);
  newTab.appendChild(firsRow);
  firsRow.appendChild(firsCell1);
  firsRow.appendChild(firsCell2);
  firsRow.appendChild(firsCell3);
  firsCell1.appendChild(firsrowText1);
  firsCell2.appendChild(firsrowText2);
  firsCell3.appendChild(firsrowText3);


  newTab.setAttribute("border", "2");

  //generate weeks and dates cells using the prinRays array to populate


  var count = 1
  var week = 1

//put a blank cell if day of a week is after the start date
//also put a blank cell if end date is before a Thursday
  if (1 < semStart.getDay() <= 4 && semStart.getDay() !== 2 && semStart.getDay() !== 1) {

      var row = document.createElement("tr");
      var col1 = document.createElement("td");
      var col2 = document.createElement("td");
      var col3 = document.createElement("td");
      var newLine = document.createElement("br");
      var weekText1 = document.createTextNode("Week " + week);
      var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
      var col3Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
      var nullSpot = document.createTextNode("  ");

      if (prinRays[count] == undefined) {
        var col3Text = document.createTextNode("  ");
      }

      newTab.appendChild(row);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      col1.appendChild(weekText1);
      col1.appendChild(newLine);
      col1.appendChild(weekText2);
      col2.appendChild(nullSpot);
      col3.appendChild(col3Text);

      count = count + 1;
      week++
    }

//write the dates and cells
  while (count <= prinRays.length) {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var col3 = document.createElement("td");
    var newLine = document.createElement("br");
    var weekText1 = document.createTextNode("Week " + week);
    var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
    var col2Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
    var col3Text = document.createTextNode(weekday[new Date(prinRays[count]).getDay()] + " " + ((new Date(prinRays[count]).getMonth()) + 1) + "/" + (new Date(prinRays[count]).getDate()));
    var nullSpot = document.createTextNode("  ");

    if (prinRays[count] == undefined) {
      var col3Text = document.createTextNode("  ");
    }

    newTab.appendChild(row);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    col1.appendChild(weekText1);
    col1.appendChild(newLine);
    col1.appendChild(weekText2);
    col2.appendChild(col2Text);
    col3.appendChild(col3Text);



    count = count + 2;
    week++
  }

//make table into Word doc
  var html, link, blob, url, css;
  css = (
     '<style>' +
     '@page docx{size: 11.0in 8.5in;mso-page-orientation: portrait;}' +
     'div.docx {page: docx;}' +
     'table{width: 100%;border-collapse:collapse;white-space: no-wrap;}td{border:1px gray solid;width:5em;padding:2px;}'+
     '</style>'
   );

   html = window.docx.innerHTML;
   blob = new Blob(['\ufeff', css + html], {
     type: 'application/msword'
   });
   url = URL.createObjectURL(blob);
   link = document.createElement('A');
   link.href = url;
   // Set default file name.
   // Word will append file extension - do not add an extension here.
   link.download = 'TR Course Calendar';
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
   		else link.click();  // other browsers
   document.body.removeChild(link);


 }


}


function friSched() {

  //get the dates and blank out the table (in case they are doing more than one without refreshing the page)
  document.getElementById("docx").innerHTML = "";
  var semStart = document.getElementById("semStartDate").valueAsDate;
  var semEnd = document.getElementById("semEndDate").valueAsDate;

  //make sure they chose a date and that the dates aren't backwards
  if (semStart == null || semEnd == null) {
    alert("You will need to select both start and end dates to create the document.");

  }

  if (semStart.getTime() > semEnd.getTime()) {
    alert("The Semester End Date cannot be before the Semester Start Date.")
  }

  else {

  //fix the timezone problem to prevent the first date being the day before the one actually selected
  semStart.setHours((semStart.getHours()) + (semStart.getTimezoneOffset() / 60));

  //get the dates as numbers
  var datEnd = semEnd.getTime();
  var datStar = semStart.getTime();
  var allRays = [datStar]

  // get all the dates in the range into an array as numbers
  while (datStar <= datEnd) {
    datStar += (1000 * 60 * 60 * 24);
    allRays.push(datStar);
  }

  //change array back to dates and filter chosen dates into prinRays array
  const datRays = allRays.map(x => new Date(x));

  function pullDays (value) {
    return new Date(value).getDay() == 5;

  }
  var prinRays = datRays.filter(pullDays);


console.log(Math.ceil(prinRays.length) + " weeks");




//hide the div with the table before writing stuff to it
  document.getElementById("docx").classList.add("hide");

//make table
  var docxDiv = document.getElementById("docx");
  var newTab = document.createElement("table");
  var firsRow = document.createElement("tr");


  //create first row (headings) and add the text and set scope (for accessibility)
  var firsCell1 = document.createElement("th");
  firsCell1.classList.add("row-primo");
  firsCell1.setAttribute("scope", "col");
  var firsCell2 = document.createElement("th");
  firsCell2.classList.add("row-primo");
  firsCell2.setAttribute("scope", "col");

  var firsrowText1 = document.createTextNode("Week #");
  var firsrowText2 = document.createTextNode("Class meeting");



  docxDiv.appendChild(newTab);
  newTab.appendChild(firsRow);
  firsRow.appendChild(firsCell1);
  firsRow.appendChild(firsCell2);
  firsCell1.appendChild(firsrowText1);
  firsCell2.appendChild(firsrowText2);



  newTab.setAttribute("border", "2");

  //generate weeks and dates cells using the prinRays array to populate
  var count = 1
  var week = 1


//create and write the dates and cells
  while (count <= prinRays.length) {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var newLine = document.createElement("br");
    var weekText1 = document.createTextNode("Week " + week);
    var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
    var col2Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
    var nullSpot = document.createTextNode("  ");

    newTab.appendChild(row);
    row.appendChild(col1);
    row.appendChild(col2);
    col1.appendChild(weekText1);
    col1.appendChild(newLine);
    col1.appendChild(weekText2);
    col2.appendChild(col2Text);

    count = count + 1;
    week++
  }

//make table into Word doc
  var html, link, blob, url, css;
  css = (
     '<style>' +
     '@page docx{size: 11.0in 8.5in;mso-page-orientation: portrait;}' +
     'div.docx {page: docx;}' +
     'table{width: 100%;border-collapse:collapse;white-space: no-wrap;}td{border:1px gray solid;width:5em;padding:2px;}'+
     '</style>'
   );

   html = window.docx.innerHTML;
   blob = new Blob(['\ufeff', css + html], {
     type: 'application/msword'
   });
   url = URL.createObjectURL(blob);
   link = document.createElement('A');
   link.href = url;
   // Set default file name.
   // Word will append file extension - do not add an extension here.
   link.download = 'FRI Course Calendar';
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
   		else link.click();  // other browsers
   document.body.removeChild(link);


 }


}


function satSched() {

  //get the dates and blank out the table (in case they are doing more than one without refreshing the page)
  document.getElementById("docx").innerHTML = "";
  var semStart = document.getElementById("semStartDate").valueAsDate;
  var semEnd = document.getElementById("semEndDate").valueAsDate;

  //make sure they chose a date and that the dates aren't backwards
  if (semStart == null || semEnd == null) {
    alert("You will need to select both start and end dates to create the document.");

  }

  if (semStart.getTime() > semEnd.getTime()) {
    alert("The Semester End Date cannot be before the Semester Start Date.")
  }

  else {

  //fix the timezone problem to prevent the first date being the day before the one actually selected
  semStart.setHours((semStart.getHours()) + (semStart.getTimezoneOffset() / 60));

  //get the dates as numbers
  var datEnd = semEnd.getTime();
  var datStar = semStart.getTime();
  var allRays = [datStar]

  // get all the dates in the range into an array as numbers
  while (datStar <= datEnd) {
    datStar += (1000 * 60 * 60 * 24);
    allRays.push(datStar);
  }

  //change array back to dates and filter chosen dates into prinRays array
  const datRays = allRays.map(x => new Date(x));

  function pullDays (value) {
    return new Date(value).getDay() == 6;

  }
  var prinRays = datRays.filter(pullDays);


console.log(Math.ceil(prinRays.length) + " weeks");




//hide the div with the table before writing stuff to it
  document.getElementById("docx").classList.add("hide");

//make table
  var docxDiv = document.getElementById("docx");
  var newTab = document.createElement("table");
  var firsRow = document.createElement("tr");


  //create first row (headings) and add the text and set scope (for accessibility)
  var firsCell1 = document.createElement("th");
  firsCell1.classList.add("row-primo");
  firsCell1.setAttribute("scope", "col");
  var firsCell2 = document.createElement("th");
  firsCell2.classList.add("row-primo");
  firsCell2.setAttribute("scope", "col");

  var firsrowText1 = document.createTextNode("Week #");
  var firsrowText2 = document.createTextNode("Class meeting");



  docxDiv.appendChild(newTab);
  newTab.appendChild(firsRow);
  firsRow.appendChild(firsCell1);
  firsRow.appendChild(firsCell2);
  firsCell1.appendChild(firsrowText1);
  firsCell2.appendChild(firsrowText2);



  newTab.setAttribute("border", "2");

  //generate weeks and dates cells using the prinRays array to populate
  var count = 1
  var week = 1


//create and write the dates and cells
  while (count <= prinRays.length) {
    var row = document.createElement("tr");
    var col1 = document.createElement("td");
    var col2 = document.createElement("td");
    var newLine = document.createElement("br");
    var weekText1 = document.createTextNode("Week " + week);
    var weekText2 = document.createTextNode("(week of " + month[(prinRays[count - 1]).getMonth()] + " " + (prinRays[count - 1]).getDate() + ")");
    var col2Text = document.createTextNode(weekday[prinRays[count - 1].getDay()] + " " + ((prinRays[count - 1]).getMonth() + 1) + "/" + (prinRays[count - 1]).getDate());
    var nullSpot = document.createTextNode("  ");

    newTab.appendChild(row);
    row.appendChild(col1);
    row.appendChild(col2);
    col1.appendChild(weekText1);
    col1.appendChild(newLine);
    col1.appendChild(weekText2);
    col2.appendChild(col2Text);

    count = count + 1;
    week++
  }

//make table into Word doc
  var html, link, blob, url, css;
  css = (
     '<style>' +
     '@page docx{size: 11.0in 8.5in;mso-page-orientation: portrait;}' +
     'div.docx {page: docx;}' +
     'table{width: 100%;border-collapse:collapse;white-space: no-wrap;}td{border:1px gray solid;width:5em;padding:2px;}'+
     '</style>'
   );

   html = window.docx.innerHTML;
   blob = new Blob(['\ufeff', css + html], {
     type: 'application/msword'
   });
   url = URL.createObjectURL(blob);
   link = document.createElement('A');
   link.href = url;
   // Set default file name.
   // Word will append file extension - do not add an extension here.
   link.download = 'SAT Course Calendar';
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
      else link.click();  // other browsers
   document.body.removeChild(link);


 }

}

MWBUTTON.addEventListener("click", mwSched, false);
TRBUTTON.addEventListener("click", trSched, false);
FRIBUTTON.addEventListener("click", friSched, false);
SATBUTTON.addEventListener("click", satSched, false);
