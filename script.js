// @author - Shiv Bhagat : https://github.com/shivxbhagat/

"use strict";

document
	.getElementById("generate-button")
	.addEventListener("click", generateText);
document.getElementById("clear-button").addEventListener("click", clearData);
// document.getElementById("copy-button").addEventListener("click", copyText);

function generateText() {
	var inputText = document.getElementById("input-textarea").value;
	var studentNumber = document.getElementById("student-number-input").value;

	var outputText = "";

	//student number check (check for 9 digits as well as not included e in the student number)
	if (studentNumber.length != 9 && studentNumber.includes("e") == false) {
		alert("Please enter a valid student number.");
		clearData();
		location.reload();
	}

	var dataLines = inputText.split("\n");

	var schoolVsCourse = [];
	var schoolCounter = -1;
	var courseCounter;
	var noCourse;

	//separate the data and store it in schoolVsCourse array
	for (let i = 0; i < dataLines.length; i++) {
		if (
			dataLines[i].includes(" - ") &&
			dataLines[i].split(" - ")[0].length == 6
		) {
			//-1 check if all TR 9997 in school with no courses for outlines
			if (schoolCounter != -1 && noCourse == true) {
				schoolCounter--;
			}

			schoolCounter++;
			schoolVsCourse[schoolCounter] = [];
			schoolVsCourse[schoolCounter][0] = [];
			let school = dataLines[i].split(" - ");
			schoolVsCourse[schoolCounter][0][0] = school[0];
			schoolVsCourse[schoolCounter][0][1] = school[1];

			courseCounter = 1;
			noCourse = true;
		} else if (
			dataLines[i].includes("Comments:") ||
			dataLines[i].includes("Attributes:") ||
			dataLines[i].includes("SENT TO DEPARTMENT") ||
			dataLines[i] == "" ||
			dataLines[i].includes("Where") ||
			dataLines[i].includes("9997") ||
			dataLines[i].includes("9999") ||
			dataLines[i].includes("No Credit")
		) {
			continue;
		} else {
			noCourse = false;
			schoolVsCourse[schoolCounter][courseCounter] = [];

			var course = dataLines[i].split("\t");
			schoolVsCourse[schoolCounter][courseCounter][0] = course[0];
			schoolVsCourse[schoolCounter][courseCounter][1] = course[1];
			courseCounter++;
		}
	}

	//generate output text
	var outputText = "<table>";

	for (let i = 0; i <= schoolCounter; i++) {
		// console.log(outputText);
		outputText +=
			'<tr><th colspan="2"><b><u>' +
			schoolVsCourse[i][0][1] +
			"</u></b></th></tr>"; //school name
		let j = 1;
		while (schoolVsCourse[i][j] != undefined) {
			outputText +=
				"<tr><td>" +
				schoolVsCourse[i][j][0] + //course code
				"</td><td>" +
				schoolVsCourse[i][j][1] + //course name
				" (filename: <b>" + //filename format
				schoolVsCourse[i][0][0] +
				" " +
				schoolVsCourse[i][j][0] +
				" " +
				studentNumber +
				"</b>)</td></tr>";
			j++;
		}
	}
	outputText += "</table>";

	//   document.getElementById("output-textarea").value = outputText;
	//change the innerHTML of the output-textarea
	document.getElementById("generated-text").innerHTML = outputText;
}

function clearData() {
	document.getElementById("student-number-input").value = "";
	document.getElementById("input-textarea").value = "";
	// document.getElementById("output-textarea").value = "";
	document.getElementById("generated-text").innerHTML = "";
}
