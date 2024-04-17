// @author - Shiv Bhagat : https://github.com/shivxbhagat/

"use strict";

document
	.getElementById("generate-button")
	.addEventListener("click", generateEmail);
document.getElementById("clear-button").addEventListener("click", clearData);

function clearData() {
	document.getElementById("input-textarea").value = "";
	document.getElementById("generated-text").innerHTML = "";
}

let studentNumber = "000000000",
	studentName = "",
	inputText = "",
	coursesData = [],
	schoolVsCourse = [],
	schoolVsCourseFiltered = [],
	courseTable = "",
	schoolCounter = -1,
	hasStudentNumber = false,
	hasStudentName = false,
	emailText = ``,
	schoolNames = "";

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

	//write the school names
	schoolNames = "";
	for (let i = 0; i <= schoolCounter; i++) {
		schoolNames += schoolVsCourseFiltered[i][0][1] + ", ";
	}
	schoolNames = schoolNames.slice(0, -2);

	document.getElementById("generated-text").innerHTML = courseTable;
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
