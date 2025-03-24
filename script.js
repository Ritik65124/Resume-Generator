document.addEventListener("DOMContentLoaded", function () {
    // Event listener for form changes
    document.getElementById("resumeForm").addEventListener("input", updatePreview);

    // Add education entry
    document.getElementById("addEducation").addEventListener("click", function () {
        addDynamicField("educationList", ["Degree", "School", "Graduation Year"], "removeEducation");
    });

    // Add experience entry
    document.getElementById("addExperience").addEventListener("click", function () {
        addDynamicField("experienceList", ["Job Title", "Company", "Years"], "removeExperience");
    });

    // Remove entry using event delegation
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            event.target.parentElement.remove();
            updatePreview();
        }
    });

    // Download resume as PDF
    document.getElementById("downloadBtn").addEventListener("click", function () {
        const element = document.getElementById("resumePreview");
        element.classList.add("generating-pdf");
        
        setTimeout(() => {
            html2pdf().from(element).save().then(() => {
                element.classList.remove("generating-pdf");
            });
        }, 500);
    });
});

// Function to update the resume preview
function updatePreview() {
    const data = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        summary: document.getElementById("summary").value,
        skills: document.getElementById("skills").value.split(",").map(skill => skill.trim()),
        education: getDynamicFieldData("educationList"),
        experience: getDynamicFieldData("experienceList")
    };

    document.getElementById("resumePreview").innerHTML = `
        <h1>${data.fullName}</h1>
        <p>${data.email} | ${data.phone} | ${data.address}</p>
        <p>${data.summary}</p>

        ${data.education.length > 0 ? `<h2>Education</h2>` + formatDynamicEntries(data.education) : ""}
        ${data.experience.length > 0 ? `<h2>Experience</h2>` + formatDynamicEntries(data.experience) : ""}
        ${data.skills.length > 0 ? `<h2>Skills</h2><p>${data.skills.join(", ")}</p>` : ""}
    `;
}

// Function to add dynamic fields
function addDynamicField(containerId, placeholders, removeClass) {
    const container = document.getElementById(containerId);
    const newEntry = document.createElement("div");
    newEntry.className = "dynamic-entry";
    newEntry.innerHTML = placeholders.map(placeholder => `<input type="text" placeholder="${placeholder}" required>`).join("") +
        `<button type="button" class="remove-btn">×</button>`;
    container.appendChild(newEntry);
    updatePreview();
}

// Function to get values from dynamic fields
function getDynamicFieldData(containerId) {
    return [...document.getElementById(containerId).getElementsByClassName("dynamic-entry")]
        .map(entry => [...entry.getElementsByTagName("input")] 
            .map(input => input.value.trim())
            .filter(value => value)
        ).filter(entry => entry.length);
}

// Function to format dynamic entries
function formatDynamicEntries(entries) {
    return entries.map(entry => `<p>${entry.join(" | ")}</p>`).join("");
}
