export let formData
import {dictionary} from "./dictionary.js";
jQuery(() => {
	console.log("Ready to rumble!");

	// Defining global variables
	const studentToggle = $('#isStudentToggle');
	const researchToggle = $('#hasResearchToggle');
	const researchSubmissionToggle = $('#canSubResearchToggle');
	const coAuthorToggle = $('#hasCoAuthorToggle');
	const coAuthorStudentToggle = $('#isCoAuthorStudentToggle');

	// ---------------- FUNCTIONS -------------------------------
	// A collection of functions that execute specific task like hide or show things on the form
	// Student mode (Is this person a student?)
	function studentMode(status) {
		// Declaring variables
		let infoTitle = $('#infoTitle');
		let studentContent = $('#studentCont');
		let otherContent = $('#otherCont');

		if (status === true) {
			infoTitle.html("Student Information");
			studentContent.show();
			otherContent.hide();
			otherContent.find('input[type="text"], textarea').val('');
		} else {
			infoTitle.html("Faculty/Partner Information");
			otherContent.show();
			studentContent.hide();
			studentContent.find('input[type="text"], textarea').val('')
			studentContent.find('input[type="radio"]').prop('checked', false);
		}
	}

	// Research section toggle (Does this person have research and is it ready to submit?)
	function toggleResearchSection(show) {
		let researchCont = $('#researchCont');
		if (show) {
			researchCont.show();
		} else {
			researchCont.hide();
			researchCont.find('input').prop('checked', false);
			researchCont.find('input[type="text"], textarea').val('');
		}
	}

	// Co-Author section toggle (Does this person have co-authors?)
	function toggleCoAuthorship(show) {
		let coAuthorCont = $('#coAuthorCont');
		if (show) {
			coAuthorCont.show();
		} else {
			coAuthorCont.hide();
			coAuthorCont.find('input').prop('checked', false);
			coAuthorCont.find('input[type="text"], textarea').val('');
		}
	}

	// Student Co-Author toggle (If this person has co-authors, are they students?)
	function toggleStudentCoAuthorship(show) {
		let sessPrefCont = $('#sessPrefCont');
		if (show) {
			sessPrefCont.show();
		} else {
			sessPrefCont.hide();
			sessPrefCont.find('input').prop('checked', false);
			sessPrefCont.find('input[type="text"], textarea').val('');
		}
	}

	// Defaults
	studentMode(true);
	toggleResearchSection(false);
	toggleStudentCoAuthorship(false);
	toggleCoAuthorship(false);
	$("#showResult").modal("hide");

	// ------------------  VALIDATION -------------------------
	// Function to validate the form depending on which mode and which inputs are visible and able to be filled out.
	// Modes: isStudent, isSubmittingResearch, hasCoAuthor, coAuthorIsStudent

	// Function that check modes
	// Function to check if user is a student
	function isStudent() {
		return studentToggle.prop('checked');
	}

	// Function to check if user is submitting research
	function isSubmittingResearch() {
		return researchSubmissionToggle.prop('checked');
	}

	// Function to check if there are co-authors
	function hasCoAuthorship() {
		return coAuthorToggle.prop('checked');
	}

	// Function to check if co-author is student
	function isCoAuthorStudent() {
		return coAuthorStudentToggle.prop('checked');
	}

	// Validation function that utilizes mode discovery to determine which inputs need to be validated
	function validateForm() {
		let isValid = true;

		// Functions that compare the provided string against a regular expression to verify that they fit

		// For name validation
		function isValidName(name) {
			const nameRegex = /^\D+$/;
			return nameRegex.test(name);
		}

		// For email validation
		function isValidEmail(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		}

		// For phone number validation
		function isValidPhone(phone) {
			// const phoneRegex = /^[0-9]$/;
			return true
		}

		// Checking if the element has no value
		function isEmpty(element) {
			return element.val().trim() === '';
		}

		//----------------------- COMMON FIELDS ---------------------------------------
		// Validation of the common fields: First name, Last name, Email, and Mobile

		// Variable declarations for common fields
		let fname = $('#firstNameInput');
		let lname = $('#lastNameInput');
		let email = $('#emailInput');
		let phone = $('#phoneInput');

		// Validate common fields
		if (!isValidName(fname.val()) || isEmpty(fname)) {
			fname.addClass('is-invalid');
			isValid = false;
		} else {
			fname.removeClass('is-invalid');
		}

		if (!isValidName(lname.val()) || isEmpty(lname)) {
			lname.addClass('is-invalid');
			isValid = false;
		} else {
			lname.removeClass('is-invalid');
		}

		if (!isValidEmail(email.val()) || isEmpty(email)) {
			email.addClass('is-invalid');
			isValid = false;
		} else {
			email.removeClass('is-invalid');
		}

		if (!isValidPhone(phone.val()) || isEmpty(phone)) {
			phone.addClass('is-invalid');
			isValid = false;
		} else {
			phone.removeClass('is-invalid');
		}

		// ------------------------ STUDENT/OTHER VALIDATION ----------------------
		// Validation of student elements: Student affliation, Area of study, and Student classification

		// Variable declarations
		let studentAffl = $('#academicAfflInput');
		let areaOfStudy = $('#areaOfStudyInput');
		let studentClass = $('#studentClassCont label');

		// Validate student fields
		if (isStudent()) {
			// Validate student-specific fields
			if (isEmpty(studentAffl)) {
				studentAffl.addClass('is-invalid');
				isValid = false;
			} else {
				studentAffl.removeClass('is-invalid');
			}

			if (isEmpty(areaOfStudy)) {
				areaOfStudy.addClass('is-invalid');
				isValid = false;
			} else {
				areaOfStudy.removeClass('is-invalid');
			}

			// Validate student classification
			let studentClassRadio = $('#studentClassCont input[name="classification"]');
			if (studentClassRadio.filter(':checked').length === 0) {
				studentClass.addClass('btn-outline-danger').removeClass('btn-outline-primary');
				isValid = false;
			} else {
				studentClass.removeClass('btn-outline-danger').addClass('btn-outline-primary');
			}
		} else {
			// Validation of other fields for non-students: Other affliation, and Job title

			// Variable declarations
			let otherAffl = $('#otherAfflInput');
			let jobTitle = $('#jobTitleInput');

			// Validate faculty/partner-specific fields
			if (isEmpty(otherAffl)) {
				otherAffl.addClass('is-invalid');
				isValid = false;
			} else {
				otherAffl.removeClass('is-invalid');
			}

			if (isEmpty(jobTitle)) {
				jobTitle.addClass('is-invalid');
				isValid = false;
			} else {
				jobTitle.removeClass('is-invalid');
			}
		}

		// --------------------- RESEARCH VALIDATION ------------------------------
		// Validation of research inputs: Research title, Research abstract, and Area of research

		// Validate research fields if user is submitting research
		if (isSubmittingResearch()) {

			// Defining variables
			let researchTitle = $('#researchTitleInput');
			let researchAbstract = $('#researchAbsInput');
			let areaOfResearch = $('#researchAreaInput')
			let submissionType = $('#subTypeCont label');
			let submissionTypeRadios = $('#subTypeCont input[name="submissionType"]');

			if (submissionTypeRadios.filter(':checked').length === 0) {
				submissionType.removeClass('btn-outline-primary').addClass('btn-outline-danger');
				isValid = false;
			} else {
				submissionType.removeClass('btn-outline-danger').addClass('btn-outline-primary');
			}

			if (isEmpty(researchTitle)) {
				researchTitle.addClass('is-invalid');
				isValid = false;
			} else {
				researchTitle.removeClass('is-invalid');
			}

			if (isEmpty(researchAbstract)) {
				researchAbstract.addClass('is-invalid');
				isValid = false;
			} else {
				researchAbstract.removeClass('is-invalid');
			}

			if (isEmpty(areaOfResearch)) {
				areaOfResearch.addClass('is-invalid');
				isValid = false;
			} else {
				areaOfResearch.removeClass('is-invalid');
			}
		}

		// Validate fields if there is a co-author
		if (hasCoAuthorship()) {
			let coAuthorString = $('#coAuthorInput');
			if (isEmpty(coAuthorString)) {
				coAuthorString.addClass('is-invalid');
				isValid = false;
			} else {
				coAuthorString.removeClass('is-invalid');
			}
		}

		// Validate fields if co-author is a student
		if (isCoAuthorStudent()) {
			let presPref = $('#presPrefCont label');
			let presPrefRadio = $('#presPrefCont input[name="sessionPref"]');
			if (presPrefRadio.filter(':checked').length === 0) {
				presPref.removeClass('btn-outline-primary').addClass('btn-outline-danger');
				isValid = false;
			} else {
				presPref.removeClass('btn-outline-danger').addClass('btn-outline-primary');
			}
		}

		return isValid;
	}

	// Real-time validation
	$('#registration-form input, #registration-form select, #registration-form textarea').on('blur', function () {
		if (!this.checkValidity()) {
			$(this).addClass('is-invalid');
		} else {
			$(this).removeClass('is-invalid');
		}
	});

	// ------------------------- EVENTS ----------------------------------
	// These are the dynamic pieces of the page that are shown/hidden based on the state of various switches in the form

	// Event triggered on student status change
	studentToggle.on("change", function (event) {
		if (event.target.checked) {
			studentMode(true);
			researchToggle.prop('checked', false).trigger('change');
		} else {
			studentMode(false);
			researchToggle.prop('checked', false).trigger('change');
		}
	});

	// Event triggered on if "Other" is selected
	$('#studentClassCont').on("change",'input[type="radio"]', function (event) {
		let style = event.target.id  !== "other" ? 'none' : "block";
		$('#specifyClass').css('display', style);
		if (event.target.id !== 'other') {
			$('#specifyClassInput').val('');
		}
	});

	// Event triggered if research is wanting to be submitted
	researchToggle.on("change", function (event) {
		let canSubmitOptionCont = $('#canSubResearchCont');
		let canSubmitOpt = $('#canSubResearchToggle');
		if (event.target.checked) {
			canSubmitOptionCont.css("display", "block");
		} else {
			canSubmitOptionCont.css("display", "none");
			canSubmitOpt.prop('checked', false).trigger('change');
		}
	});

	// Event triggered if research is ready to be submitted
	researchSubmissionToggle.on("change", function (event) {
		toggleResearchSection(event.target.checked);
		if (!event.target.checked) {
			coAuthorToggle.prop("checked", false).trigger("change");
		}
	});

	// Event triggered if co-author is present
	coAuthorToggle.on("change", function (event) {
		toggleCoAuthorship(event.target.checked);
		if (!event.target.checked) {
			coAuthorStudentToggle.prop("checked", false).trigger("change");
		}
	});

	// Event triggered if co-author is student
	coAuthorStudentToggle.on("change", function (event) {
		toggleStudentCoAuthorship(event.target.checked);
	});

	// ------------------------ FORM SUBMISSION ------------------------------
	// Add actions after the form is validated here. Submit to backend?
	// Function to process form into a JSON object
	function processForm($form) {
		let formData = {};

		$form.find(':input').each(function() {
			const $input = $(this);
			const name = $input.attr('name');

			if (name) {
				if ($input.is(':checkbox')) {
					formData[name] = $input.prop('checked');
				} else if ($input.is(':radio')) {
					if ($input.is(':checked')) {
						formData[name] = $input.val();
					}
				} else {
					const value = $input.val();
					if (value !== '') {
						if (name === "coAuthor") {
							formData[name] = value.split(",").map(item => item.trim());
						} else {
							formData[name] = value;
						}
					}
				}
			}
		});
		console.log(formData);
		return formData;
	}

	// Form submission
	$('#registration-form').on('submit', function (e) {
		e.preventDefault();
		if (validateForm()) {
			console.log("Form passed");
			formData = processForm($(this));

			// Create confirmation message
			let confirmMessage = "";
			for (const [key, value] of Object.entries(formData)) {
				const row = `<tr>
    			<td style='border-right: 1px solid lightgrey; width: 50%; border-bottom: 1px solid lightgray; padding-right: 10px;'><b>${dictionary[key]}</b></td>
    			<td style='padding-left: 10px; border-bottom: 1px solid lightgray;'>&nbsp;${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</td>
 	 			</tr>`;
				confirmMessage += row;
			}
			// Set the HTML content of the modal body
			$('#confirmMessageBody').html(confirmMessage);

			// Show the confirmation modal
			$('#submitFormConfirm').modal('show');

		} else {
			console.log("Form failed");
		}
	});
});