// @author - Shiv Bhagat : https://github.com/shivxbhagat/

"use strict";

document
	.getElementById("generate-button")
	.addEventListener("click", generateEmail);
document.getElementById("clear-button").addEventListener("click", clearData);
// document.getElementById("copy-button").addEventListener("click", copyText);

function generateText() {
	var inputText = document.getElementById("input-textarea").value;
	// var studentNumber = document.getElementById("student-number-input").value;
	var studentNumber = "001234567";

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

	//check for last school with no courses for outlines
	if (schoolVsCourse[schoolCounter][1] == undefined) {
		schoolCounter--;
	}

	//generate output text
	var outputText = "";

	for (let i = 0; i <= schoolCounter; i++) {
		// console.log(outputText);
		outputText +=
			'<table><tr><th colspan="2"><b><u>' +
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
		outputText += "</table><br>";
	}

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

//driver.js

// let infoBtn = document.getElementById("info-btn");
// infoBtn.addEventListener("click", driver);
// function driver() {
// 	const driver = window.driver.js.driver;

// 	const driverObj = driver({
// 		allowClose: true,

// 		onNextClick: () => {
// 			document.getElementById("student-number-input").value = "001234567";
// 			document.getElementById("input-textarea").value =
// 				"CBC022 - Trinity Western University\nMATH 105\tPRE-CALCULUS MATHEMATICS\tB+\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tB+\t\nCBC007 - University of Victoria\nPOLI 202\tINTRO POLITICAL THEORY\tIP\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tIP\t\nHSTR 314A\tBECOMING VICTORIANS BRITAIN\tIP\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tIP\t\nHSTR 240A\tEURO RENAISSANCE TO FRENCH REV\tIP\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tIP\t\nPOLI 103\tTHE WORLD OF POLITICS\tC+\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tC+\t\nPOLI 101\tINTRO CANADIAN POLITICS\tB+\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tB+\t\nGRS 102\tDISCOVERING THE ANCIENT ROMANS\tA\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tA\t\nPOLI 211\tEURO INTEGRATION & UNION\tIP\tTR 9996\t06/11 INFO REQ (STUDENT)\t0.0\tA\tS\tIP\t\nENGL 366C\tSHAKESPEARE: COMEDY & ROMANCE\tB\tTR 9996\t06/11 INFO REQ (STUDENT)\n";
// 			document.getElementById("generated-text").innerHTML =
// 				'<table><tbody><tr><th colspan="2"><b><u>Trinity Western University</u></b></th></tr><tr><td>MATH 105</td><td>PRE-CALCULUS MATHEMATICS (filename: <b>CBC022 MATH 105 123456789</b>)</td></tr></tbody></table><br><table><tbody><tr><th colspan="2"><b><u>University of Victoria</u></b></th></tr><tr><td>POLI 202</td><td>INTRO POLITICAL THEORY (filename: <b>CBC007 POLI 202 123456789</b>)</td></tr><tr><td>HSTR 314A</td><td>BECOMING VICTORIANS BRITAIN (filename: <b>CBC007 HSTR 314A 123456789</b>)</td></tr><tr><td>HSTR 240A</td><td>EURO RENAISSANCE TO FRENCH REV (filename: <b>CBC007 HSTR 240A 123456789</b>)</td></tr><tr><td>POLI 103</td><td>THE WORLD OF POLITICS (filename: <b>CBC007 POLI 103 123456789</b>)</td></tr><tr><td>POLI 101</td><td>INTRO CANADIAN POLITICS (filename: <b>CBC007 POLI 101 123456789</b>)</td></tr><tr><td>GRS 102</td><td>DISCOVERING THE ANCIENT ROMANS (filename: <b>CBC007 GRS 102 123456789</b>)</td></tr><tr><td>POLI 211</td><td>EURO INTEGRATION &amp; UNION (filename: <b>CBC007 POLI 211 123456789</b>)</td></tr><tr><td>ENGL 366C</td><td>SHAKESPEARE: COMEDY &amp; ROMANCE (filename: <b>CBC007 ENGL 366C 123456789</b>)</td></tr></tbody></table><br>';
// 			driverObj.moveNext();
// 		},

// 		onCloseClick: () => {
// 			clearData();
// 			driverObj.destroy();
// 		},

// 		steps: [
// 			{
// 				element: "#info-btn",
// 				popover: {
// 					title: "Documentation",
// 					description:
// 						"This tool can be used for generating formatted course outlines file names for multiple schools at a time. Click on <b>Next</b> to view steps.",
// 				},
// 			},
// 			{
// 				element: "#student-number-input",
// 				popover: {
// 					title: "Step 1/4",
// 					description:
// 						"Enter the applicants 9 digit student number here",
// 				},
// 			},
// 			{
// 				element: "#input-textarea",
// 				popover: {
// 					title: "Step 2/4",
// 					description:
// 						'Copy and paste the school code and name, to be requested courses data from the aurora\'s trsansfer credit report here.<img src = "./ss.png" style = "height: 100%; width:100%;" ></img> <br>Open the image in new to get a better view of what is to be selected. <br>Sample data is already filled in the text area.',
// 				},
// 			},
// 			{
// 				element: "#generate-button",
// 				popover: {
// 					title: "Step 3/4",
// 					description:
// 						"Click on <b>Generate</b> button to generate the formatted course outlines file names.",
// 				},
// 			},
// 			{
// 				element: "#output-textarea",
// 				popover: {
// 					title: "Step 4/4",
// 					description:
// 						'Formatted course outlines file names will be generated here. <b>Make sure to Copy from bottom of generated text to top (from ")" to first character of School Name or Course Code)</b>, and paste it in the email body. Make sure to click on <b>Match Destination Formatting</b> button after copying the text in the email body.',
// 				},
// 			},

// 			{
// 				element: "#back-to-top-button",
// 				popover: {
// 					title: "Top",
// 					description:
// 						"Click on this button to go back to the top of the page.",
// 				},
// 			},

// 			{
// 				element: "#clear-button",
// 				popover: {
// 					title: "Clear",
// 					description:
// 						"Click on this button to clear the input and output fields. Click on <b>Done</b> to close the documentation and <b>Clear</b> button after getting out of the documentation.",
// 				},
// 			},
// 		],
// 	});

// 	driverObj.drive();
// }

let studentNumber = "000000000",
	studentName = "",
	inputText = "",
	coursesData = [],
	schoolVsCourse = [],
	schoolVsCourseFiltered = [],
	courseTable = "",
	schoolCounter = -1,
	hasStudentNumber = false,
	hasStudentName = false;

function generateEmail() {
	inputText = document.getElementById("input-textarea").value;

	let splitText = inputText.split("\n");

	for (let i = 0; i < splitText.length; i++) {
		//get student #
		if (splitText[i].includes("Student #:") && hasStudentNumber == false) {
			studentNumber = splitText[i].split(":")[1].trim();
			hasStudentNumber = true;
		}
		//get student name
		if (splitText[i].includes("Student Name:") && hasStudentName == false) {
			studentName = splitText[i].split(":")[1].trim();
			hasStudentName = true;
		}
		//get courses data
		if (splitText[i].includes("Courses Pending an Assessment Decision:")) {
			coursesData = splitText.slice(i);
			break;
		}
	}

	//trim courses data
	schoolVsCourse = trimCourseData(coursesData);

	//filter school vs course
	schoolVsCourseFiltered = filterSchoolVsCourse(schoolVsCourse)[0];
	schoolCounter = filterSchoolVsCourse(schoolVsCourse)[1];

	//generate course table
	courseTable = generateCourseTable(
		schoolVsCourseFiltered,
		schoolCounter,
		studentNumber
	);

	// document.getElementById("generated-text").innerHTML = courseTable;

	// now use window.open
}

function trimCourseData(coursesData) {
	let schoolVsCourse = [];
	if (coursesData !== undefined) {
		for (let i = 0; i < coursesData.length; i++) {
			if (
				coursesData[i].includes("Courses Not Awarded Credit:") ||
				coursesData[i].includes("Where sufficient overlap in") ||
				coursesData[i].includes(
					"Courses transferred from external institutions"
				)
			) {
				schoolVsCourse = coursesData.slice(1, i);
				return schoolVsCourse;
			}
		}
	}
}

function filterSchoolVsCourse(schoolVsCourse) {
	var schoolVsCourseFiltered = [];
	var schoolCounter = -1;
	var courseCounter;
	var noCourse;

	if (schoolVsCourse !== undefined) {
		//separate the data and store it in schoolVsCourse array
		for (let i = 0; i < schoolVsCourse.length; i++) {
			if (
				schoolVsCourse[i].includes(" - ") &&
				schoolVsCourse[i].split(" - ")[0].length == 6
			) {
				//-1 check if all TR 9997 in school with no courses for outlines
				if (schoolCounter != -1 && noCourse == true) {
					schoolCounter--;
				}

				schoolCounter++;
				schoolVsCourseFiltered[schoolCounter] = [];
				schoolVsCourseFiltered[schoolCounter][0] = [];
				let school = schoolVsCourse[i].split(" - ");
				schoolVsCourseFiltered[schoolCounter][0][0] = school[0];
				schoolVsCourseFiltered[schoolCounter][0][1] = school[1];

				courseCounter = 1;
				noCourse = true;
			} else if (
				schoolVsCourse[i].includes("Comments:") ||
				schoolVsCourse[i].includes("Attributes:") ||
				schoolVsCourse[i].includes("SENT TO DEPARTMENT") ||
				schoolVsCourse[i] == "" ||
				schoolVsCourse[i].includes("Where") ||
				schoolVsCourse[i].includes("9997") ||
				schoolVsCourse[i].includes("9999") ||
				schoolVsCourse[i].includes("No Credit")
			) {
				continue;
			} else {
				noCourse = false;
				schoolVsCourseFiltered[schoolCounter][courseCounter] = [];

				var course = schoolVsCourse[i].split("\t");
				schoolVsCourseFiltered[schoolCounter][courseCounter][0] =
					course[0];
				schoolVsCourseFiltered[schoolCounter][courseCounter][1] =
					course[1];
				courseCounter++;
			}
		}

		//check for last school with no courses for outlines
		if (schoolVsCourseFiltered[schoolCounter][1] == undefined) {
			schoolCounter--;
		}
	}

	return [schoolVsCourseFiltered, schoolCounter];
}

function generateCourseTable(
	schoolVsCourseFiltered,
	schoolCounter,
	studentNumber
) {
	let outputTable = "";
	if (
		schoolVsCourseFiltered !== undefined &&
		schoolCounter !== undefined &&
		studentNumber !== undefined
	) {
		for (let i = 0; i <= schoolCounter; i++) {
			outputTable +=
				'<table><tr><th colspan="2"><b><u>' +
				schoolVsCourseFiltered[i][0][1] +
				"</u></b></th></tr>"; //school name
			let j = 1;
			while (schoolVsCourseFiltered[i][j] != undefined) {
				outputTable +=
					"<tr><td>" +
					schoolVsCourseFiltered[i][j][0] + //course code
					"</td><td>" +
					schoolVsCourseFiltered[i][j][1] + //course name
					" (filename: <b>" + //filename format
					schoolVsCourseFiltered[i][0][0] +
					" " +
					schoolVsCourseFiltered[i][j][0] +
					" " +
					studentNumber +
					"</b>)</td></tr>";
				j++;
			}
			outputTable += "</table><br>";
		}
	}

	return outputTable;
}
