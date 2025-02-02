document.addEventListener('DOMContentLoaded', function () {
    // Load quotes from local storage or use default quotes
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivation" },
        { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
    ];

    // Function to display a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

        // Save the last viewed quote to session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    }

    // Function to create and display the form for adding new quotes
    function createAddQuoteForm() {
        const formContainer = document.getElementById('form-container') || document.createElement('div');
        formContainer.id = 'form-container';
        formContainer.innerHTML = `
            <form id="add-quote-form">
                <input type="text" id="quote-text" placeholder="Enter quote" required>
                <input type="text" id="quote-category" placeholder="Enter category" required>
                <button type="submit">Add Quote</button>
            </form>
        `;
        document.body.appendChild(formContainer);

        const addQuoteForm = document.getElementById('add-quote-form');
        addQuoteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const quoteText = document.getElementById('quote-text').value.trim();
            const quoteCategory = document.getElementById('quote-category').value.trim();

            if (quoteText && quoteCategory) {
                quotes.push({ text: quoteText, category: quoteCategory });
                localStorage.setItem('quotes', JSON.stringify(quotes));
                document.getElementById('quote-text').value = '';
                document.getElementById('quote-category').value = '';
                alert('Quote added successfully!');
            } else {
                alert('Please fill in both fields.');
            }
        });
    }

    // Function to add a new quote
    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            localStorage.setItem('quotes', JSON.stringify(quotes));
            alert('Quote added successfully!');
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
        } else {
            alert('Please fill in both fields.');
        }
    }

    // Function to export quotes to a JSON file
    function exportToJsonFile() {
        const jsonStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Attach event listener to show new quote button
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    // Create and display the form for adding new quotes
    createAddQuoteForm();

    // Display a random quote initially
    showRandomQuote();

    // Restore the last viewed quote from session storage if available
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
    }

    // Event listener for JSON export
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Quotes';
    exportButton.addEventListener('click', exportToJsonFile);
    document.body.appendChild(exportButton);

    // Event listener for JSON import
    const importFileInput = document.createElement('input');
    importFileInput.type = 'file';
    importFileInput.id = 'importFile';
    importFileInput.accept = '.json';
    importFileInput.addEventListener('change', importFromJsonFile);
    document.body.appendChild(importFileInput);
});
