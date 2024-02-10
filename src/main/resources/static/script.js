document.addEventListener('DOMContentLoaded', function() {
    const addBookButton = document.getElementById('addBook');
    const editBookButton = document.getElementById('editBook');
    const deleteBookButton = document.getElementById('deleteBook');
    const bookTitleInput = document.getElementById('bookTitleInput');
    const bookAuthorInput = document.getElementById('bookAuthorInput');
    const bookPagesInput = document.getElementById('bookPagesInput');
    const editBookSelect = document.getElementById('editBookSelect');
    const editTitleInput = document.getElementById('editTitleInput');
    const editAuthorInput = document.getElementById('editAuthorInput');
    const editPagesInput = document.getElementById('editPagesInput');
    const deleteBookSelect = document.getElementById('deleteBookSelect');
    const currentBookDetails = document.getElementById('currentBookDetails');
    const booksTable = document.getElementById('booksTable');

    // Define the books variable in the global scope
    let books = [];

    // Function to fetch book data from backend
    async function fetchBooks() {
        try {
            const response = await fetch('http://localhost:8000/books'); // Assuming your backend endpoint to fetch books data is '/books'
            if (!response.ok) {
                throw new Error('Failed to fetch books data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    // Populate select elements with book data
    async function populateSelects() {
        const books = await fetchBooks();
        deleteBookSelect.innerHTML = '';
        books.forEach(book => {
            const optionEdit = document.createElement('option');
            optionEdit.value = book.id;
            optionEdit.textContent = book.title;
            editBookSelect.appendChild(optionEdit);

            const optionDelete = document.createElement('option');
            optionDelete.value = book.title;
            optionDelete.textContent = book.title;
            deleteBookSelect.appendChild(optionDelete);
        });
    }

    // Display current book details
    function displayCurrentBookDetails(bookId) {
        const book = books.find(b => b.id === parseInt(bookId));
        if (book) {
            currentBookDetails.innerHTML = `
                <h3>Current Book Details</h3>
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
            `;
        } else {
            currentBookDetails.innerHTML = '';
        }
    }

    // Add new book
    addBookButton.addEventListener('click', async () => {
        const title = bookTitleInput.value.trim();
        const author = bookAuthorInput.value.trim();
        const pages = parseInt(bookPagesInput.value);

        if (title === '' || author === '' || isNaN(pages)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const newBook = {
            title,
            author,
            pages
        };

        try {
            const response = await fetch('http://localhost:8000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBook)
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            // Clear input fields
            bookTitleInput.value = '';
            bookAuthorInput.value = '';
            bookPagesInput.value = '';

            // Refresh book data and UI
            await populateSelects();
            await displayAllBooks();
            console.log('Book added successfully');
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book');
        }
    });

    // Edit existing book
    // Edit existing book
editBookButton.addEventListener('click', async () => {
    const selectedBookId = parseInt(editBookSelect.value);
    const newTitle = editTitleInput.value.trim();
    const newAuthor = editAuthorInput.value.trim();
    const newPages = parseInt(editPagesInput.value);

    if (selectedBookId === 0 || newTitle === '' || newAuthor === '' || isNaN(newPages)) {
        alert('Please select a book and fill in all fields correctly.');
        return;
    }

    const updatedBook = {
        id: selectedBookId, // Make sure to include the correct ID
        title: newTitle,
        author: newAuthor,
        pages: newPages
    };

    try {
        const response = await fetch(`http://localhost:8000/books/${selectedBookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });

        if (!response.ok) {
            throw new Error('Failed to update book');
        }

        // Clear input fields
        editTitleInput.value = '';
        editAuthorInput.value = '';
        editPagesInput.value = '';

        // Refresh book data and UI
        await populateSelects();
        await displayAllBooks();
        console.log('Book updated successfully');
    } catch (error) {
        console.error('Error updating book:', error);
        alert('Failed to update book');
    }
});


    // Delete book
    deleteBookButton.addEventListener('click', async () => {
        const selectedBookName = deleteBookSelect.value.trim();

        if (selectedBookName === '') {
            alert('Please select a book to delete.');
            return;
        }

        try {
            // Remove the deleted book from the local array
            deleteBookFromLocalArray(selectedBookName);

            // Refresh UI without waiting for server response
            await displayAllBooks();

            // Find the book ID by its name from the fetched books
            const bookToDelete = books.find(book => book.title === selectedBookName);

            // Check if the book with the selected name exists
            if (!bookToDelete) {
                throw new Error('Book not found');
            }

            const response = await fetch(`http://localhost:8000/books/${bookToDelete.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete book: ${response.statusText}`);
            }

            // Refresh select elements after successful deletion
            await populateSelects();

            console.log('Book deleted successfully');
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book. Please check server logs for more information.');
        }
    });

    // Function to delete a book from the local array by name
    function deleteBookFromLocalArray(bookName) {
        books = books.filter(book => book.title !== bookName);
    }

    // Event listener for selecting a book to edit
    editBookSelect.addEventListener('change', () => {
        const selectedBookId = editBookSelect.value;
        displayCurrentBookDetails(selectedBookId);
    });

    // Function to display all books in a table format
    async function displayAllBooks() {
        // Clear previous content
        booksTable.innerHTML = '';

        // Fetch books from the backend
        const fetchedBooks = await fetchBooks();
        books = fetchedBooks;

        // Create table header row
        const tableHeaderRow = document.createElement('tr');
        tableHeaderRow.innerHTML = `
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
        `;
        booksTable.appendChild(tableHeaderRow);

        // Iterate through each book and create table rows to display their details
        books.forEach(book => {
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.pages}</td>
            `;
            booksTable.appendChild(tableRow);
        });
    }

    // Call the function to display all books initially
    displayAllBooks();

    // Initialize
    populateSelects();

    const recordButton = document.getElementById('recordButton'); // Get the record button element

    // Function to send data to backend
   function sendDataToBackend() {
        const backendUrl = 'http://localhost:8000/saveBooks'; // Example backend URL

        // Example fetch API request to send books array to backend
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(books)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send books data to backend');
            }
            console.log('Books data sent successfully to backend');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Event listener for clicking the record button
    recordButton.addEventListener('click', () => {
        // Call the function to send data to backend
        sendDataToBackend();
    });
    // Function to prompt user before closing the application and send data to backend
    function promptBeforeClosing() {
        // Prompt the user with a confirmation dialog before closing
        const confirmationMessage = 'Are you sure you want to leave? Your changes may not be saved.';
        if (books.length > 0 && !confirm(confirmationMessage)) {
            return;
        }

        // Send data to backend when closing
        sendDataToBackend();
    }

    // Call the function to prompt user before closing
    window.addEventListener('beforeunload', promptBeforeClosing);
});
