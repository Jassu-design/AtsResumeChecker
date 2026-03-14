async function checkResume() {
    const fileInput = document.getElementById('resumeFile');
    const jobDescription = document.getElementById('jobDescription').value;
    const btn = document.getElementById('checkBtn');

    // Validation
    if (!fileInput.files[0]) {
        alert('Please upload a resume!');
        return;
    }
    if (!jobDescription) {
        alert('Please paste a job description!');
        return;
    }

    // Show loading
    btn.innerText = 'Checking...';
    btn.disabled = true;

    // Prepare form data
    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);
    formData.append('job_description', jobDescription);

    try {
        const response = await fetch('http://localhost:5000/check-resume', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // Display results
        displayResults(data);

    } catch (error) {
        alert('Error connecting to server. Make sure Flask is running!');
        console.error(error);
    } finally {
        btn.innerText = 'Check ATS Score';
        btn.disabled = false;
    }
}

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    const scoreCircle = document.getElementById('scoreCircle');
    const matchedDiv = document.getElementById('matchedKeywords');
    const missingDiv = document.getElementById('missingKeywords');

    // Show score
    scoreCircle.innerText = data.score + '%';
    scoreCircle.style.background = data.score >= 70 ? '#28a745' :
        data.score >= 40 ? '#ffc107' : '#dc3545';

    // Show matched keywords
    matchedDiv.innerHTML = data.matched_keywords
        .map(k => `<span class="tag matched-tag">${k}</span>`)
        .join('');

    // Show missing keywords
    missingDiv.innerHTML = data.missing_keywords
        .map(k => `<span class="tag missing-tag">${k}</span>`)
        .join('');

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({
        behavior: 'smooth'
    });
}

