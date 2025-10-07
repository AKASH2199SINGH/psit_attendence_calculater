// Initialize Vanta.js animation
VANTA.NET({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x3b82f6, // Blue color for the net
  backgroundColor: 0x070e24, // Dark blue background
  points: 12.00,
  maxDistance: 23.00,
  spacing: 18.00
});

// --- Main Calculator Logic ---

// Get references to all the necessary DOM elements
const totalLecturesEl = document.getElementById('totalLectures');
const totalAbsencesEl = document.getElementById('totalAbsences');
const totalOaaEl = document.getElementById('totalOaa');
const calculateBtn = document.getElementById('calculateBtn');
const resultCard = document.getElementById('resultCard');
const currentPercentageEl = document.getElementById('currentPercentage');
const statusMessageEl = document.getElementById('statusMessage');
const fineMessageEl = document.getElementById('fineMessage');

// Add a click event listener to the calculate button
calculateBtn.addEventListener('click', () => {
    // Get the values from input fields and convert them to numbers
    const totalLectures = parseInt(totalLecturesEl.value);
    const totalAbsences = parseInt(totalAbsencesEl.value);
    const totalOaa = parseInt(totalOaaEl.value);
    const fineThreshold = 90;
    const finePerPercent = 400;

    // --- Input Validation ---
    if (isNaN(totalLectures) || isNaN(totalAbsences) || isNaN(totalOaa)) {
        showError("Please fill in all fields with numbers.");
        return;
    }
    if (totalLectures < 0 || totalAbsences < 0 || totalOaa < 0) {
        showError("Values cannot be negative.");
        return;
    }
    if (totalOaa > totalAbsences) {
        showError("Total OAA cannot be more than Total Absent + OAA.");
        return;
    }
    if (totalAbsences > totalLectures) {
         showError("Total Absences cannot be more than Total Lectures.");
        return;
    }

    // --- Calculation Logic based on formula: 100-(((Total Absent-Total OAA)/Total Lecture)*100) ---
    let currentPercentage = 0;
    if (totalLectures > 0) {
        const actualAbsences = totalAbsences - totalOaa;
        currentPercentage = 100 - ((actualAbsences / totalLectures) * 100);
    } else {
         currentPercentage = 100; // If no lectures, attendance is 100%
    }

    // Display the current percentage
    currentPercentageEl.textContent = `${currentPercentage.toFixed(2)}%`;

    // Remove previous status styles
    resultCard.classList.remove('border-green-500', 'border-red-500', 'border-yellow-500', 'dark:border-green-400', 'dark:border-red-400', 'dark:border-yellow-400');
    statusMessageEl.classList.remove('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-300', 'bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-300');

    // --- Determine Status and Fine ---
    if (currentPercentage >= fineThreshold) {
        // User is in the SAFE ZONE
        resultCard.classList.add('border-green-500', 'dark:border-green-400');
        statusMessageEl.textContent = "You're Safe";
        statusMessageEl.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-300');
        fineMessageEl.textContent = "No fine applicable. Keep it up!";

    } else {
        // User is in the DANGER ZONE
        resultCard.classList.add('border-red-500', 'dark:border-red-400');
        statusMessageEl.textContent = "Fine Applicable";
        statusMessageEl.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-300');
        
        // Calculate the fine
        const percentageDeficit = fineThreshold - currentPercentage;
        const fineAmount = Math.ceil(percentageDeficit) * finePerPercent;

        // Format fine amount for display
        const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
        fineMessageEl.innerHTML = `Fine Amount: <span class="text-red-500 dark:text-red-400 font-bold">${formatter.format(fineAmount)}</span>`;
    }
    
    // Make the result card visible
    resultCard.classList.remove('hidden');
});

// Helper function to show error messages
function showError(message) {
    resultCard.classList.remove('hidden', 'border-green-500', 'border-red-500', 'dark:border-green-400', 'dark:border-red-400');
    statusMessageEl.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'dark:bg-green-900', 'dark:text-green-300', 'dark:bg-red-900', 'dark:text-red-300');
    
    resultCard.classList.add('border-yellow-500', 'dark:border-yellow-400');
    currentPercentageEl.textContent = 'Oops!';
    statusMessageEl.textContent = 'Invalid Input';
    statusMessageEl.classList.add('bg-yellow-100', 'text-yellow-800', 'dark:bg-yellow-900', 'dark:text-yellow-300');
    fineMessageEl.textContent = message;
}
