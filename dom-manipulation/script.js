document.addEventListener('DOMContentLoaded', async function () {
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
        addQuoteForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const quoteText = document.getElementById('quote-text').value.trim();
            const quoteCategory = document.getElementById('quote-category').value.trim();

            if (quoteText && quoteCategory) {
                quotes.push({ text: quoteText, category: quoteCategory });
                localStorage.setItem('quotes', JSON.stringify(quotes));
                populateCategories();
                document.getElementById('quote-text').value = '';
                document.getElementById('quote-category').value = '';
                alert('Quote added successfully!');
                await syncQuotes(); // Sync quotes after adding a new one
            } else {
                alert('Please fill in both fields.');
            }
        });
    }

    // Function to add a new quote
    async function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            localStorage.setItem('quotes', JSON.stringify(quotes));
            populateCategories();
            alert('Quote added successfully!');
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            await syncQuotes(); // Sync quotes after adding a new one
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
    async function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = async function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            populateCategories();
            alert('Quotes imported successfully!');
            await syncQuotes(); // Sync quotes after importing new ones
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Function to populate categories dynamically
    function populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Restore the last selected category filter from local storage
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
            filterQuotes();
        }
    }

    // Function to filter quotes based on the selected category
    function filterQuotes() {
        const selectedCategory = document.getElementById('categoryFilter').value;
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
        } else {
            quoteDisplay.innerHTML = "No quotes available for the selected category.";
        }

        // Save the selected category filter to local storage
        localStorage.setItem('lastSelectedCategory', selectedCategory);
    }

    // Function to sync quotes with the server
    async function syncQuotes() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quotes)
            });
            const data = await response.json();
            console.log('Quotes synced with server:', data);
            await fetchQuotesFromServer(); // Fetch updates from server after syncing
        } catch (error) {
            console.error('Error syncing with server:', error);
        }
    }

    // Function to fetch quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            resolveConflicts(serverQuotes);
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
        }
    }

    // Function to resolve conflicts by taking the server's data precedence
    function resolveConflicts(serverQuotes) {
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const combinedQuotes = [...serverQuotes, ...localQuotes];
        const uniqueCombinedQuotes = combinedQuotes.filter((quote, index, self) =>
            index === self.findIndex(q => q.text === quote.text)
        );
        localStorage.setItem('quotes', JSON.stringify(uniqueCombinedQuotes));
        populateCategories();
        alert('Conflicts resolved. Data synchronized with server.');
    }

    // Attach event listener to show new quote button
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    // Create and display the form for adding new quotes
    createAddQuoteForm();

    // Populate category filter dropdown
    populateCategories();

    // Display a random quote initially
    showRandomQuote();

    // Restore the last viewed quote from session storage if available
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
    }

    // Event listener for JSON export
    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);
});
