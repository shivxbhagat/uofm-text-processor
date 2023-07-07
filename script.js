'use strict'

document
  .getElementById("generate-button")
  .addEventListener("click", generateText);
document.getElementById("clear-button").addEventListener("click", clearData);
document.getElementById("copy-button").addEventListener("click", copyText);

function generateText() {



  var inputText = document.getElementById("input-textarea").value;
  var studentNumber = document.getElementById("student-number-input").value;
  var schoolCode = "";
  var schoolName = "";
  var outputText = "";

  if (studentNumber.length != 9) {
    alert("Please enter a valid student number.");
    clearData();
  } else {

  var dataLines = inputText.split("\n");

  //separate school code and name
  let school = dataLines[0].split(" - ");
  schoolCode = school[0];
  schoolName = school[1];

  var allCoursesCode = [];
  var allCoursesName = [];

  //separate courses into arrays
  for (let i = 1; i < dataLines.length; i++) {
    if(dataLines[i].includes("Comments:") || dataLines[i].includes("Attributes:")) continue;
      var courses = dataLines[i].split("\t");
      allCoursesCode.push(courses[0]);
      allCoursesName.push(courses[1]);
    
    
  }

  //generate output text
  outputText = "<table><tr><th colspan=\"2\">" + schoolName + "</th></tr>";
for (let i = 0; i < allCoursesCode.length; i++) {
  outputText +=
    "<tr><td>" +
    allCoursesCode[i] +
    "</td><td>&emsp;&emsp;&emsp;" +
    allCoursesName[i] +
    " (filename: <b>" +
    schoolCode +
    " " +
    allCoursesCode[i] +
    " " +
    studentNumber +
    "</b>)</td></tr>";
}
outputText += "</table>"; 
  //   document.getElementById("output-textarea").value = outputText;
  //change the innerHTML of the output-textarea

  document.getElementById("generated-text").innerHTML = outputText;
  }
}

function clearData() {
  document.getElementById("student-number-input").value = "";
  document.getElementById("input-textarea").value = "";
  document.getElementById("output-textarea").value = "";
}
