document.addEventListener('DOMContentLoaded', function () {
    // Array of quote objects
    const quotes = [
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
            alert('Quote added successfully!');
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
        } else {
            alert('Please fill in both fields.');
        }
    }

    // Attach event listener to show new quote button
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    // Create and display the form for adding new quotes
    createAddQuoteForm();

    // Display a random quote initially
    showRandomQuote();
});
