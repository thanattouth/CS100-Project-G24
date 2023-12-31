
const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const namesPattern = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");
  document.getElementById("show1").innerHTML = fullnameInput.value; //add show your text after input

  if (namesPattern.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^[4-6][0-9]\d{8}$/; // add more validate student ID
  const errorElement = document.getElementById("studentIDError");
  document.getElementById("show2").innerHTML = studentIDInput.value; //add show your text after input

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter your 10-digit Student ID.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");
  document.getElementById("show3").innerHTML = emailInput.value; //add show your text after input

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate WorkTitle
function validateWorkTitle() {  
  const workType = document.getElementById("workTitle");
  const WorkTypePattern = /^[a-zA-Z]+$/;
  const errorElement = document.getElementById("workError");
  document.getElementById("show4").innerHTML = workType.value; //add show your text after input

  if (!WorkTypePattern.test(workType.value)) {
    errorElement.textContent = "Please enter your work with a letter";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
  validateWorkTitle(); // call validateWorkTitle here
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail() || !validateWorkTitle()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };

  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document.getElementById("studentID").addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("workTitle").addEventListener("input", validateWorkTitle); // add Event Listener here

// addEventListener - input event to validate value for submit show
document.getElementById("fullname").addEventListener("input", function() {
  const submitShowDiv = document.querySelector(".submit-show");

  if (this.value.trim() !== "") {
    submitShowDiv.style.display = "block";
  } else {
    submitShowDiv.style.display = "none";
  }
});

document.getElementById("studentID").addEventListener("input", function() {
  const submitShowDiv = document.querySelector(".submit-show");

  if (this.value.trim() !== "") {
    submitShowDiv.style.display = "block";
  } else {
    submitShowDiv.style.display = "none";
  }
});

document.getElementById("email").addEventListener("input", function() {
  const submitShowDiv = document.querySelector(".submit-show");

  if (this.value.trim() !== "") {
    submitShowDiv.style.display = "block";
  } else {
    submitShowDiv.style.display = "none";
  }
});

document.getElementById("workTitle").addEventListener("input", function() {
  const submitShowDiv = document.querySelector(".submit-show");

  if (this.value.trim() !== "") {
    submitShowDiv.style.display = "block";
  } else {
    submitShowDiv.style.display = "none";
  }
});