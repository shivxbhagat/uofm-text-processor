// @author - Shiv Bhagat : https://github.com/shivxbhagat/

"use strict";

document
	.getElementById("generate-button")
	.addEventListener("click", generateEmail);
document.getElementById("clear-button").addEventListener("click", clearData);

//hide back to top when its in the #input-section
window.onscroll = function () {
	if (
		document.body.scrollTop > 100 ||
		document.documentElement.scrollTop > 100
	) {
		document.getElementById("back-to-top").style.display = "block";
	} else {
		document.getElementById("back-to-top").style.display = "none";
	}
};

document.getElementById("back-to-top").addEventListener("click", clearData);

function clearData() {
	document.getElementById("input-textarea").value = "";
	document.getElementById("output-email").innerHTML = "";
	resetVariables();
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
	schoolNames = "",
	emptyStr = "";

function resetVariables() {
	studentNumber = "000000000";
	studentName = "";
	inputText = "";
	coursesData = [];
	schoolVsCourse = [];
	schoolVsCourseFiltered = [];
	courseTable = "";
	schoolCounter = -1;
	hasStudentNumber = false;
	hasStudentName = false;
	emailText = ``;
	schoolNames = "";
	emptyStr = "";
}

function generateEmail() {
	resetVariables();
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

	if (
		studentNumber === "000000000" ||
		studentName === "" ||
		studentNumber === "" ||
		studentNumber.length !== 9
	) {
		alert("Enter valid input text");
		clearData();
		location.reload();
		return;
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

	//write email in new window
	writeEmail(studentNumber, studentName, schoolNames, courseTable, emptyStr);

	//clear after 1.5 minutes
	setTimeout(reload, 90000);
}

function reload() {
	document.getElementById("back-to-top").click();
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
				'<table style = "font-family: Roboto;width: 1000px;height: auto;border-collapse: collapse;overflow-x: auto;text-align: left;"><tr><th colspan="2" style="text-align:left"><b><u>' +
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

		//remove last <br> tag
		outputTable = outputTable.slice(0, -4);
	}

	return outputTable;
}

// used https://evercoder.github.io/clipboard-inspector/ to the html of the email from the original email
function writeEmail(
	studentNumber,
	studentName,
	schoolNames,
	courseTable,
	emptyStr
) {
	if (
		studentNumber !== undefined ||
		studentName !== undefined ||
		schoolNames !== undefined ||
		courseTable !== undefined ||
		emptyStr !== undefined
	) {
		let html = `<html>
		<head>
			<style>
				/* Font Definitions */
				@font-face {
					font-family: "Cambria Math";
					panose-1: 2 4 5 3 5 4 6 3 2 4;
					mso-font-charset: 0;
					mso-generic-font-family: roman;
					mso-font-pitch: variable;
					mso-font-signature: -536869121 1107305727 33554432 0 415 0;
				}
				@font-face {
					font-family: Calibri;
					panose-1: 2 15 5 2 2 2 4 3 2 4;
					mso-font-charset: 0;
					mso-generic-font-family: swiss;
					mso-font-pitch: variable;
					mso-font-signature: -469750017 -1073732485 9 0 511 0;
				}
				/* Style Definitions */
				p.MsoNormal,
				li.MsoNormal,
				div.MsoNormal {
					mso-style-unhide: no;
					mso-style-qformat: yes;
					mso-style-parent: "";
					margin: 0in;
					mso-pagination: widow-orphan;
					font-size: 11pt;
					font-family: "Calibri", sans-serif;
					mso-ascii-font-family: Calibri;
					mso-ascii-theme-font: minor-latin;
					mso-fareast-font-family: Calibri;
					mso-fareast-theme-font: minor-latin;
					mso-hansi-font-family: Calibri;
					mso-hansi-theme-font: minor-latin;
					mso-bidi-font-family: "Times New Roman";
					mso-bidi-theme-font: minor-bidi;
					mso-font-kerning: 1pt;
					mso-ligatures: standardcontextual;
				}
				span.EmailStyle15 {
					mso-style-type: personal;
					mso-style-noshow: yes;
					mso-style-unhide: no;
					mso-ansi-font-size: 11pt;
					mso-bidi-font-size: 11pt;
					font-family: "Calibri", sans-serif;
					mso-ascii-font-family: Calibri;
					mso-ascii-theme-font: minor-latin;
					mso-fareast-font-family: Calibri;
					mso-fareast-theme-font: minor-latin;
					mso-hansi-font-family: Calibri;
					mso-hansi-theme-font: minor-latin;
					mso-bidi-font-family: "Times New Roman";
					mso-bidi-theme-font: minor-bidi;
					color: windowtext;
				}
				.MsoChpDefault {
					mso-style-type: export-only;
					mso-default-props: yes;
					mso-ascii-font-family: Calibri;
					mso-ascii-theme-font: minor-latin;
					mso-fareast-font-family: Calibri;
					mso-fareast-theme-font: minor-latin;
					mso-hansi-font-family: Calibri;
					mso-hansi-theme-font: minor-latin;
					mso-bidi-font-family: "Times New Roman";
					mso-bidi-theme-font: minor-bidi;
				}
				@page WordSection1 {
					size: 8.5in 11in;
					margin: 1in 1in 1in 1in;
					mso-header-margin: 0.5in;
					mso-footer-margin: 0.5in;
					mso-paper-source: 0;
				}
				div.WordSection1 {
					page: WordSection1;
				}
			</style>
		</head>
	
		<body lang="EN-US" style="tab-interval: 0.5in; word-wrap: break-word">
			<!--StartFragment-->
	
			<table
				class="MsoNormalTable"
				border="0"
				cellspacing="0"
				cellpadding="0"
				width="596"
				style="
					width: 447pt;
					border-collapse: collapse;
					mso-yfti-tbllook: 1184;
					mso-padding-alt: 0in 0in 0in 0in;
					font-weight: bold;
				"
			>
				<tr style="mso-yfti-irow: 0; mso-yfti-firstrow: yes; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<a name="_MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>UM Student Number:<span
											style="mso-font-kerning: 0pt"
											><o:p></o:p></span></span></b
							></a>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-font-kerning: 0pt;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>${studentNumber}<o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
				<tr style="mso-yfti-irow: 1; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>Student Name:</span
									></b
								></span
							><span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-ascii-font-family: Calibri;
											mso-fareast-font-family: Calibri;
											mso-hansi-font-family: Calibri;
											mso-bidi-font-family: Calibri;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										><o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>${studentName}<o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
				<tr style="mso-yfti-irow: 2; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>Applicant Term:<o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<span style="mso-bookmark: _MailAutoSig"></span>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										><o:p>${emptyStr}</o:p></span
									></b
								></span
							>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
				<tr style="mso-yfti-irow: 3; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>Program of Application:<o:p
										></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<span style="mso-bookmark: _MailAutoSig"></span>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										><o:p>${emptyStr}</o:p></span
									></b
								></span
							>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
				<tr style="mso-yfti-irow: 4; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>Institution(s):<o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #ddebf7;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>${schoolNames}<o:p></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
				<tr style="mso-yfti-irow: 5; mso-yfti-lastrow: yes; height: 15pt">
					<td
						width="234"
						nowrap
						valign="bottom"
						style="
							width: 175.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
							vertical-align: middle;
						"
					>
						<p class="MsoNormal" style="line-height: 105%">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										>Document Submission Deadline:<o:p
										></o:p></span></b
							></span>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
					<td
						width="362"
						nowrap
						valign="bottom"
						style="
							width: 271.5pt;
							background: #f2f2f2;
							padding: 0in 5.4pt 0in 5.4pt;
							height: 15pt;
						"
					>
						<span style="mso-bookmark: _MailAutoSig"></span>
						<p class="MsoNormal">
							<span style="mso-bookmark: _MailAutoSig"
								><b
									><span
										style="
											mso-fareast-font-family: 'Times New Roman';
											mso-fareast-theme-font: minor-fareast;
											color: black;
											mso-ligatures: none;
											mso-no-proof: yes;
										"
										><o:p>${emptyStr}</o:p></span
									></b
								></span
							>
						</p>
					</td>
					<span style="mso-bookmark: _MailAutoSig"></span>
				</tr>
			</table>
	
			<p class="MsoNormal" style="margin-bottom: 12pt">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							font-size: 1pt;
							mso-fareast-font-family: Calibri;
							color: black;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							color: black;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Our office is evaluating your prior course work as part of
						the application process.</span
					></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
					>
						<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Please read through formatting and submission instructions
						below carefully and provide detailed course outlines for the
						following course(s) completed at the above in</span
					></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-no-proof: yes;
						"
						>stitution(s)
					</span></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>so that we may finalize your transfer credit. Before
						forwarding to us, please rename each file title using the
						unique filename format<b> </b>provided.<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>${courseTable}<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Course information should be submitted as issued or created
						by your previous institution.
						<b>Student created outlines will not be accepted.</b>
						<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><b
						><u
							><span
								lang="EN-CA"
								style="
									mso-fareast-font-family: 'Times New Roman';
									mso-fareast-theme-font: minor-fareast;
									mso-ligatures: none;
									mso-ansi-language: EN-CA;
									mso-no-proof: yes;
								"
								>Course calendar descriptions and transcripts do NOT
								suffice for assessment.</span
							></u
						></b
					></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
					>
						Outlines or syllabi should represent the timeframe you took
						the course, and include the following: <br />
						<br />
						(a) a statement of the course objectives <br />
						(b) a weekly outline of the units studied in the course
						<br />
						(c) name of textbook(s) and list of assigned readings<br />
						(d) length of course and/or credit hours <br />
						(e) assignments and grade distribution<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>(d) lab information, when applicable<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Course syllabi from external English Departments should
						also include information detailing word counts and page
						numbers required for assignments.<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Packaged outlines will not be accepted. Each outline or
						document should be submitted as
						<b>individual attachments </b>electronically to
					</span></span
				><span style="mso-bookmark: _MailAutoSig"></span
				><a href="mailto:evaluations@umanitoba.ca"
					><span style="mso-bookmark: _MailAutoSig"
						><span
							lang="EN-CA"
							style="
								mso-fareast-font-family: 'Times New Roman';
								mso-fareast-theme-font: minor-fareast;
								color: #0563c1;
								mso-ligatures: none;
								mso-ansi-language: EN-CA;
								mso-no-proof: yes;
							"
							>evaluations@umanitoba.ca</span
						></span
					><span style="mso-bookmark: _MailAutoSig"></span></a
				><span style="mso-bookmark: _MailAutoSig"
					><span
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-no-proof: yes;
						"
					>
					</span></span
				><span style="mso-bookmark: _MailAutoSig"
					><b
						><span
							lang="EN-CA"
							style="
								mso-fareast-font-family: 'Times New Roman';
								mso-fareast-theme-font: minor-fareast;
								mso-ligatures: none;
								mso-ansi-language: EN-CA;
								mso-no-proof: yes;
							"
							>- <u>.pdf preferred</u></span
						></b
					></span
				><span style="mso-bookmark: _MailAutoSig"
					><u
						><span
							lang="EN-CA"
							style="
								mso-fareast-font-family: 'Times New Roman';
								mso-fareast-theme-font: minor-fareast;
								mso-ligatures: none;
								mso-ansi-language: EN-CA;
								mso-no-proof: yes;
							"
							>, no .zip or .rar files, please</span
						></u
					></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>. <o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Course information should be submitted in English. If the
						original information has been issued by your institution in
						a language other than English, you must include a copy of
						the original information and the English translation.
						<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><b
						><span
							lang="EN-CA"
							style="
								mso-fareast-font-family: 'Times New Roman';
								mso-fareast-theme-font: minor-fareast;
								mso-ligatures: none;
								mso-ansi-language: EN-CA;
								mso-no-proof: yes;
							"
							>Information submitted for transfer credit assessment is
							subject to the University of Manitoba’s policy on
							Academic Fraud or Misconduct, which includes:<o:p
							></o:p></span></b
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><br />
						&nbsp;&nbsp;&nbsp;&nbsp;
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						•failure to declare attendance at another post-secondary
						institution <br />
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						•presenting falsified academic documentation <br />
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						•encouraging another person to falsify records through
						translation or data changes <br />
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						•presenting falsified or fictitious reference
						documentation<o:p></o:p></span
				></span>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						><o:p>&nbsp;</o:p></span
					></span
				>
			</p>
	
			<p class="MsoNormal">
				<span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>Failure to provide appropriate outlines by specified
						deadlines may render you inadmissible to your program of
						application. For admitted students, failure to provide
						outlines by the specified deadline may make you ineligible
						for transfer credit and program approval will be required.
						Please consult your relevant
					</span></span
				><span style="mso-bookmark: _MailAutoSig"></span
				><a
					href="https://umanitoba.ca/explore/undergraduate-admissions/undergraduate-admission-requirements"
					><span style="mso-bookmark: _MailAutoSig"
						><span
							style="
								mso-fareast-font-family: 'Times New Roman';
								mso-fareast-theme-font: minor-fareast;
								color: #0563c1;
								mso-ligatures: none;
								mso-no-proof: yes;
							"
							>Applicant Information Bulletin</span
						></span
					><span style="mso-bookmark: _MailAutoSig"></span></a
				><span style="mso-bookmark: _MailAutoSig"
					><span
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-no-proof: yes;
						"
					>
					</span></span
				><span style="mso-bookmark: _MailAutoSig"
					><span
						lang="EN-CA"
						style="
							mso-fareast-font-family: 'Times New Roman';
							mso-fareast-theme-font: minor-fareast;
							mso-ligatures: none;
							mso-ansi-language: EN-CA;
							mso-no-proof: yes;
						"
						>for additional information.<o:p></o:p></span
				></span>
			</p>
	
			<!--EndFragment-->
		</body>
	</html>`;

		//suspend as of now
		/*
		let email = window.open("", "_blank", "width=1200,height=800");
		email.document.write(html);

		//close the email-window after 45s
		setTimeout(() => {
			email.close();
		}, 45000);
		*/

		document.getElementById("output-email").innerHTML = html;
	}
}
