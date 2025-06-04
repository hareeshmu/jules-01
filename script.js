// script.js

// Initialize Data Arrays
let userCreditCards = [];
let userRewardPrograms = [];

/**
 * Represents a credit card.
 * @typedef {Object} CreditCard
 * @property {number | string} id - Unique identifier for the card (e.g., timestamp or counter).
 * @property {string} name - The name of the credit card (e.g., 'Chase Sapphire Preferred').
 * @property {string} rewardsProgramName - The name of the associated rewards program.
 * @property {number} pointsBalance - The current points balance on the card (defaults to 0).
 * @property {number} cashbackBalance - The current cashback balance on the card (in dollars, defaults to 0).
 * @property {string} expirationDate - The expiration date of the card (e.g., 'MM/YY').
 */

/**
 * Example of a CreditCard object.
 * This is for illustrative purposes and not part of the active code.
 */
/*
const exampleCreditCard = {
    id: 1,
    name: 'Chase Sapphire Preferred',
    rewardsProgramName: 'Ultimate Rewards',
    pointsBalance: 50000,
    cashbackBalance: 0,
    expirationDate: '12/25'
};
*/

/**
 * Represents a rewards program.
 * @typedef {Object} RewardProgram
 * @property {string} name - The name of the rewards program (e.g., 'Ultimate Rewards').
 * @property {number} pointsToDollarRate - The conversion rate of points to dollars (e.g., 0.01 for 1 cent per point).
 * @property {Array<Object>} spendingCategories - An array of spending categories with their bonus multipliers.
 * @property {string} spendingCategories[].categoryName - The name of the spending category (e.g., 'Travel').
 * @property {number} spendingCategories[].bonusMultiplier - The multiplier for points earned in this category.
 */

/**
 * Example of a RewardProgram object.
 * This is for illustrative purposes and not part of the active code.
 */
/*
const exampleRewardProgram = {
    name: 'Ultimate Rewards',
    pointsToDollarRate: 0.01,
    spendingCategories: [
        { categoryName: 'Travel', bonusMultiplier: 2 },
        { categoryName: 'Dining', bonusMultiplier: 3 },
        { categoryName: 'All Other', bonusMultiplier: 1 }
    ]
};
*/

/**
 * Loads user's credit card and reward program data from localStorage.
 * If data exists, it's parsed and assigned to userCreditCards and userRewardPrograms.
 * Otherwise, the arrays remain empty.
 */
function loadDataFromLocalStorage() {
    const storedCards = localStorage.getItem('userCreditCards');
    if (storedCards) {
        userCreditCards = JSON.parse(storedCards);
    }

    const storedPrograms = localStorage.getItem('userRewardPrograms');
    if (storedPrograms) {
        userRewardPrograms = JSON.parse(storedPrograms);
    }
    console.log('Data loaded from localStorage:', { userCreditCards, userRewardPrograms });
    // Page-specific initializations after loading data
    if (document.getElementById('cardsList')) { // For cards.html
        renderCards();
    }
    if (document.getElementById('rewardsProgramSelect')) { // For cards.html
        populateProgramDropdown('rewardsProgramSelect');
    }
    if (document.getElementById('selectCard')) { // For rewards.html
        populateCardDropdown('selectCard');
    }
    if (document.getElementById('rewardBalancesList')) { // For rewards.html
        renderRewardBalances();
    }
    if (document.getElementById('totalRewardsSummary')) { // For index.html
        displayTotalRewardsSummary();
    }
    if (document.getElementById('monthlySpendingTracker')) { // For index.html
        displayMonthlySpendingTracker();
    }
    if (document.getElementById('programsList')) { // For settings.html
        renderRewardPrograms();
    }
}

/**
 * Saves the current userCreditCards and userRewardPrograms data to localStorage.
 * Data is converted to JSON strings before saving.
 */
function saveDataToLocalStorage() {
    localStorage.setItem('userCreditCards', JSON.stringify(userCreditCards));
    localStorage.setItem('userRewardPrograms', JSON.stringify(userRewardPrograms));
    console.log('Data saved to localStorage.');
}

/**
 * Renders the user's credit cards to the cardsList div.
 */
function renderCards() {
    const cardsListDiv = document.getElementById('cardsList');
    if (!cardsListDiv) return; // Only run if the cardsList div exists

    cardsListDiv.innerHTML = ''; // Clear existing content

    if (userCreditCards.length === 0) {
        cardsListDiv.innerHTML = '<p>No cards added yet. Add one using the form above!</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'cards-ul'; // For potential styling
    userCreditCards.forEach(card => {
        const li = document.createElement('li');
        li.className = 'card-item'; // For potential styling
        li.innerHTML = `
            <strong>${card.name}</strong><br>
            Program: ${card.rewardsProgramName || 'N/A'}<br>
            Points: ${card.pointsBalance}<br>
            Expires: ${card.expirationDate || 'N/A'}<br>
            <button class="remove-card-btn" data-card-id="${card.id}">Remove</button>
        `;
        ul.appendChild(li);
    });
    cardsListDiv.appendChild(ul);
}


// Event Listeners and Page-Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rewards Tracker script loaded.');
    loadDataFromLocalStorage(); // Load data when the DOM is ready

    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const cardName = document.getElementById('cardName').value;
            const rewardsProgram = document.getElementById('rewardsProgram').value;
            const pointsBalance = parseInt(document.getElementById('pointsBalance').value) || 0;
            const expirationDate = document.getElementById('expirationDate').value;

            const newCard = {
                id: Date.now(), // Simple unique ID
                name: cardName,
                rewardsProgramName: rewardsProgram,
                pointsBalance: pointsBalance,
                cashbackBalance: 0, // Default as per previous structure
                expirationDate: expirationDate
            };

            userCreditCards.push(newCard);
            saveDataToLocalStorage();
            renderCards();
            addCardForm.reset();
        });
    }

    const cardsListDiv = document.getElementById('cardsList');
    if (cardsListDiv) {
        cardsListDiv.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-card-btn')) {
                const cardId = parseInt(event.target.getAttribute('data-card-id'));
                userCreditCards = userCreditCards.filter(card => card.id !== cardId);
                saveDataToLocalStorage();
                renderCards();
            }
        });
    }
/**
 * Populates a select dropdown with user's credit cards.
 * @param {string} selectElementId - The ID of the select element to populate.
 */
function populateCardDropdown(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">-- Select a Card --</option>'; // Default option

    if (userCreditCards.length === 0) {
        selectElement.innerHTML = '<option value="">-- No cards available --</option>';
        return;
    }

    userCreditCards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.id;
        option.textContent = card.name;
        selectElement.appendChild(option);
    });
}

/**
 * Renders the reward balances for each card.
 */
function renderRewardBalances() {
    const rewardBalancesListDiv = document.getElementById('rewardBalancesList');
    if (!rewardBalancesListDiv) return;

    rewardBalancesListDiv.innerHTML = '';

    if (userCreditCards.length === 0) {
        rewardBalancesListDiv.innerHTML = '<p>No cards available to show balances. Please add a card first.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'balances-ul'; // For potential styling
    userCreditCards.forEach(card => {
        const li = document.createElement('li');
        li.className = 'balance-item'; // For potential styling
        li.innerHTML = `
            <strong>${card.name}</strong><br>
            Points Balance: ${card.pointsBalance}<br>
            Cashback Balance: $${card.cashbackBalance.toFixed(2)}
        `;
        ul.appendChild(li);
    });
    rewardBalancesListDiv.appendChild(ul);
}


// Event Listeners and Page-Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rewards Tracker script loaded.');
    loadDataFromLocalStorage(); // Load data when the DOM is ready

    // For cards.html
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const cardName = document.getElementById('cardName').value;
            const rewardsProgram = document.getElementById('rewardsProgram').value;
            const pointsBalance = parseInt(document.getElementById('pointsBalance').value) || 0;
            const expirationDate = document.getElementById('expirationDate').value;

            const newCard = {
                id: Date.now(), // Simple unique ID
                name: cardName,
                rewardsProgramName: rewardsProgram,
                pointsBalance: pointsBalance,
                cashbackBalance: 0, // Default as per previous structure
                expirationDate: expirationDate
            };

            userCreditCards.push(newCard);
            saveDataToLocalStorage();
            renderCards(); // Update card list on cards.html
            addCardForm.reset();
        });
    }

    const cardsListDiv = document.getElementById('cardsList');
    if (cardsListDiv) {
        cardsListDiv.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-card-btn')) {
                const cardId = parseInt(event.target.getAttribute('data-card-id'));
                userCreditCards = userCreditCards.filter(card => card.id !== cardId);
                saveDataToLocalStorage();
                renderCards(); // Update card list on cards.html
            }
        });
    }

    // For rewards.html
    const logSpendingForm = document.getElementById('logSpendingForm');
    if (logSpendingForm) {
        logSpendingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const selectedCardId = document.getElementById('selectCard').value;
            // const spendingCategory = document.getElementById('spendingCategory').value; // For future use
            const amountSpent = parseFloat(document.getElementById('amountSpent').value);

            if (!selectedCardId) {
                alert('Please select a card.');
                return;
            }
            if (isNaN(amountSpent) || amountSpent <= 0) {
                alert('Please enter a valid amount.');
                return;
            }

            const cardIndex = userCreditCards.findIndex(card => card.id == selectedCardId);
            if (cardIndex === -1) {
                alert('Selected card not found.');
                return;
            }

            // Basic reward calculation (1 point per dollar)
            // This will be enhanced later with RewardProgram integration
            userCreditCards[cardIndex].pointsBalance += Math.floor(amountSpent); // Assuming points are integers

            saveDataToLocalStorage();
            renderRewardBalances(); // Update balances display on rewards.html
            // Optionally, repopulate dropdown if card details changed that affect it (not in this case)
            // populateCardDropdown('selectCard');
            logSpendingForm.reset();
             // Re-set the default option for the select element
            document.getElementById('selectCard').value = "";
        });
    }

/**
 * Displays the total rewards summary (points and cashback) on the dashboard.
 */
function displayTotalRewardsSummary() {
    const summaryDiv = document.getElementById('totalRewardsSummary');
    if (!summaryDiv) return; // Only run if on index.html

    if (userCreditCards.length === 0) {
        summaryDiv.innerHTML = '<p>No cards added yet. Add some cards to see your rewards summary.</p>';
        return;
    }

    let totalPoints = 0;
    let totalCashback = 0;

    userCreditCards.forEach(card => {
        totalPoints += card.pointsBalance || 0;
        totalCashback += card.cashbackBalance || 0;
    });

    summaryDiv.innerHTML = `
        <p>Total Estimated Points: <strong>${totalPoints}</strong></p>
        <p>Total Estimated Cashback: <strong>$${totalCashback.toFixed(2)}</strong></p>
    `;
}

/**
 * Displays a placeholder for the monthly spending tracker on the dashboard.
 */
function displayMonthlySpendingTracker() {
    const trackerDiv = document.getElementById('monthlySpendingTracker');
    if (!trackerDiv) return; // Only run if on index.html

    let totalPointsValue = 0;
    if (userCreditCards.length > 0) {
        userCreditCards.forEach(card => {
            totalPointsValue += card.pointsBalance || 0;
        });
    }

    trackerDiv.innerHTML = `<p>Detailed spending tracking by category coming soon. Current total points balance across all cards: <strong>${totalPointsValue}</strong></p>`;
}


// Event Listeners and Page-Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rewards Tracker script loaded.');
    loadDataFromLocalStorage(); // Load data when the DOM is ready

    // For cards.html
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const cardName = document.getElementById('cardName').value;
            const rewardsProgram = document.getElementById('rewardsProgram').value;
            const pointsBalance = parseInt(document.getElementById('pointsBalance').value) || 0;
            const expirationDate = document.getElementById('expirationDate').value;

            const newCard = {
                id: Date.now(), // Simple unique ID
                name: cardName,
                rewardsProgramName: rewardsProgram,
                pointsBalance: pointsBalance,
                cashbackBalance: 0, // Default as per previous structure
                expirationDate: expirationDate
            };

            userCreditCards.push(newCard);
            saveDataToLocalStorage();
            renderCards(); // Update card list on cards.html
            addCardForm.reset();
            // If on index.html, update dashboard summaries too
            if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
            if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
        });
    }

    const cardsListDiv = document.getElementById('cardsList');
    if (cardsListDiv) {
        cardsListDiv.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-card-btn')) {
                const cardId = parseInt(event.target.getAttribute('data-card-id'));
                userCreditCards = userCreditCards.filter(card => card.id !== cardId);
                saveDataToLocalStorage();
                renderCards(); // Update card list on cards.html
                // If on index.html, update dashboard summaries too
                if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
                if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
                 // If on rewards.html, update its views
                if (document.getElementById('selectCard')) populateCardDropdown('selectCard');
                if (document.getElementById('rewardBalancesList')) renderRewardBalances();
            }
        });
    }

    // For rewards.html
    const logSpendingForm = document.getElementById('logSpendingForm');
    if (logSpendingForm) {
        logSpendingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const selectedCardId = document.getElementById('selectCard').value;
            // const spendingCategory = document.getElementById('spendingCategory').value; // For future use
            const amountSpent = parseFloat(document.getElementById('amountSpent').value);

            if (!selectedCardId) {
                alert('Please select a card.');
                return;
            }
            if (isNaN(amountSpent) || amountSpent <= 0) {
                alert('Please enter a valid amount.');
                return;
            }

            const cardIndex = userCreditCards.findIndex(card => card.id == selectedCardId);
            if (cardIndex === -1) {
                alert('Selected card not found.');
                return;
            }

            // Basic reward calculation (1 point per dollar)
            userCreditCards[cardIndex].pointsBalance += Math.floor(amountSpent);

            saveDataToLocalStorage();
            renderRewardBalances(); // Update balances display on rewards.html
            logSpendingForm.reset();
            document.getElementById('selectCard').value = "";
            // If on index.html, update dashboard summaries too
            if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
            if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
        });
    }

/**
 * Renders the list of reward programs and their management forms.
 */
function renderRewardPrograms() {
    const programsListDiv = document.getElementById('programsList');
    if (!programsListDiv) return; // Only run if on settings.html

    programsListDiv.innerHTML = ''; // Clear existing content

    if (userRewardPrograms.length === 0) {
        programsListDiv.innerHTML = '<p>No reward programs defined yet. Add one using the form above.</p>';
        return;
    }

    userRewardPrograms.forEach(program => {
        const programDiv = document.createElement('div');
        programDiv.className = 'program-item'; // For styling
        programDiv.innerHTML = `
            <h3>${program.name}</h3>
            <p>Points to Dollar Rate: ${program.pointsToDollarRate}</p>
            <h4>Spending Categories:</h4>
            <ul id="categoriesFor-${program.name.replace(/\s+/g, '')}">
                ${program.spendingCategories.map(cat => `<li>${cat.categoryName}: ${cat.bonusMultiplier}x <button class="delete-category-btn" data-program-name="${program.name}" data-category-name="${cat.categoryName}">Delete</button></li>`).join('') || '<li>No categories added yet.</li>'}
            </ul>
            <form class="addCategoryForm">
                <input type="hidden" name="programName" value="${program.name}">
                <input type="text" class="newCategoryName" placeholder="Category Name" required>
                <input type="number" class="newBonusMultiplier" placeholder="Multiplier" step="0.1" value="1" required>
                <button type="submit">Add Category</button>
            </form>
            <button class="delete-program-btn" data-program-name="${program.name}">Delete Program</button>
            <hr>
        `;
        programsListDiv.appendChild(programDiv);
    });
}


// Event Listeners and Page-Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rewards Tracker script loaded.');
    loadDataFromLocalStorage(); // Load data when the DOM is ready

    // For cards.html
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const cardName = document.getElementById('cardName').value;
            const rewardsProgramName = document.getElementById('rewardsProgramSelect').value; // Updated to use select
            const pointsBalance = parseInt(document.getElementById('pointsBalance').value) || 0;
            const expirationDate = document.getElementById('expirationDate').value;

            if (!rewardsProgramName) {
                alert('Please select a rewards program.');
                return;
            }

            const newCard = {
                id: Date.now(),
                name: cardName,
                rewardsProgramName: rewardsProgramName,
                pointsBalance: pointsBalance,
                cashbackBalance: 0,
                expirationDate: expirationDate
            };

            userCreditCards.push(newCard);
            saveDataToLocalStorage();
            renderCards();
            addCardForm.reset();
            if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
            if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
            // If on rewards.html, update its card dropdown
            if (document.getElementById('selectCard')) populateCardDropdown('selectCard');
        });
    }

    const cardsListDiv = document.getElementById('cardsList');
    if (cardsListDiv) {
        cardsListDiv.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-card-btn')) {
                const cardId = parseInt(event.target.getAttribute('data-card-id'));
                userCreditCards = userCreditCards.filter(card => card.id !== cardId);
                saveDataToLocalStorage();
                renderCards();
                if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
                if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
                if (document.getElementById('selectCard')) populateCardDropdown('selectCard');
                if (document.getElementById('rewardBalancesList')) renderRewardBalances();
            }
        });
    }

    // For rewards.html
    const logSpendingForm = document.getElementById('logSpendingForm');
    if (logSpendingForm) {
        logSpendingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedCardId = document.getElementById('selectCard').value;
            const spendingCategoryValue = document.getElementById('spendingCategory').value; // User input category
            const amountSpent = parseFloat(document.getElementById('amountSpent').value);

            if (!selectedCardId) { alert('Please select a card.'); return; }
            if (isNaN(amountSpent) || amountSpent <= 0) { alert('Please enter a valid amount.'); return; }

            const cardIndex = userCreditCards.findIndex(card => card.id == selectedCardId);
            if (cardIndex === -1) { alert('Selected card not found.'); return; }

            const card = userCreditCards[cardIndex];
            let pointsEarned = Math.floor(amountSpent); // Default 1 point per dollar

            // Attempt to find the program and apply bonus
            const program = userRewardPrograms.find(p => p.name === card.rewardsProgramName);
            if (program) {
                const categoryRule = program.spendingCategories.find(cat => cat.categoryName.toLowerCase() === spendingCategoryValue.toLowerCase());
                if (categoryRule) {
                    pointsEarned = Math.floor(amountSpent * categoryRule.bonusMultiplier);
                }
            }

            card.pointsBalance += pointsEarned;

            saveDataToLocalStorage();
            renderRewardBalances();
            logSpendingForm.reset();
            document.getElementById('selectCard').value = "";
            if (document.getElementById('totalRewardsSummary')) displayTotalRewardsSummary();
            if (document.getElementById('monthlySpendingTracker')) displayMonthlySpendingTracker();
        });
    }

    // For settings.html
    const addProgramForm = document.getElementById('addProgramForm');
    if (addProgramForm) {
        addProgramForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const programName = document.getElementById('programName').value.trim();
            const pointsToDollarRate = parseFloat(document.getElementById('pointsToDollarRate').value);

            if (!programName || isNaN(pointsToDollarRate)) {
                alert('Please enter valid program details.');
                return;
            }
            if (userRewardPrograms.some(p => p.name.toLowerCase() === programName.toLowerCase())) {
                alert('A program with this name already exists.');
                return;
            }

            const newProgram = {
                name: programName,
                pointsToDollarRate: pointsToDollarRate,
                spendingCategories: []
            };
            userRewardPrograms.push(newProgram);
            saveDataToLocalStorage();
            renderRewardPrograms();
            addProgramForm.reset();
        });
    }

    const programsListDiv = document.getElementById('programsList');
    if (programsListDiv) {
        programsListDiv.addEventListener('click', function(event) {
            // Handle Delete Program
            if (event.target.classList.contains('delete-program-btn')) {
                const programNameToDelete = event.target.getAttribute('data-program-name');
                userRewardPrograms = userRewardPrograms.filter(p => p.name !== programNameToDelete);
                saveDataToLocalStorage();
                renderRewardPrograms();
                // Also update card dropdowns as a program might have been removed
                if (document.getElementById('selectCard')) populateCardDropdown('selectCard');
                // If a program was deleted, the dropdown on cards.html might need an update too
                if (document.getElementById('rewardsProgramSelect')) populateProgramDropdown('rewardsProgramSelect');
            }

            // Handle Delete Category
            if (event.target.classList.contains('delete-category-btn')) {
                const programName = event.target.getAttribute('data-program-name');
                const categoryNameToDelete = event.target.getAttribute('data-category-name');
                const programIndex = userRewardPrograms.findIndex(p => p.name === programName);
                if (programIndex !== -1) {
                    userRewardPrograms[programIndex].spendingCategories = userRewardPrograms[programIndex].spendingCategories.filter(
                        cat => cat.categoryName !== categoryNameToDelete
                    );
                    saveDataToLocalStorage();
                    renderRewardPrograms();
                }
            }
        });

        programsListDiv.addEventListener('submit', function(event) {
            // Handle Add Category Form Submission
            if (event.target.classList.contains('addCategoryForm')) {
                event.preventDefault();
                const form = event.target;
                const programName = form.querySelector('input[name="programName"]').value;
                const categoryName = form.querySelector('.newCategoryName').value.trim();
                const bonusMultiplier = parseFloat(form.querySelector('.newBonusMultiplier').value);

                if (!categoryName || isNaN(bonusMultiplier) || bonusMultiplier <= 0) {
                    alert('Please enter valid category details.');
                    return;
                }

                const programIndex = userRewardPrograms.findIndex(p => p.name === programName);
                if (programIndex !== -1) {
                    if (userRewardPrograms[programIndex].spendingCategories.some(c => c.categoryName.toLowerCase() === categoryName.toLowerCase())) {
                        alert('This category already exists for this program.');
                        return;
                    }
                    userRewardPrograms[programIndex].spendingCategories.push({ categoryName, bonusMultiplier });
                    saveDataToLocalStorage();
                    renderRewardPrograms();
                    form.reset();
                } else {
                    alert('Program not found. This should not happen.');
                }
            }
        });
    }
/**
 * Populates a select dropdown with available reward programs.
 * @param {string} selectElementId - The ID of the select element to populate.
 */
function populateProgramDropdown(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Preserve the first option if it's a placeholder (e.g., "-- Select a Program --")
    const firstOption = selectElement.options[0] && selectElement.options[0].value === "" ? selectElement.options[0] : null;
    selectElement.innerHTML = ''; // Clear existing options
    if (firstOption) {
        selectElement.appendChild(firstOption); // Add back the placeholder
    }


    if (userRewardPrograms.length === 0) {
        if (!firstOption || selectElement.options.length === 0) { // Avoid duplicate "No programs" if placeholder exists
             const defaultOption = document.createElement('option');
             defaultOption.value = "";
             defaultOption.textContent = "-- No programs defined --";
             selectElement.appendChild(defaultOption);
        }
        return;
    }

    userRewardPrograms.forEach(program => {
        const option = document.createElement('option');
        option.value = program.name;
        option.textContent = program.name;
        selectElement.appendChild(option);
    });
}

    // Future interactions and logic will go here for other pages.
});
