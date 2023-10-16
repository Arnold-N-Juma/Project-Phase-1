const bookList = document.getElementById("bookList");

// Function to loan a book

const bookData = {
  books: []
};

function loadBooks() {
  fetch('http://localhost:3000/books') 
      .then(response => response.json())
      .then(data => {
          // Update the bookData object with the loaded data.
          bookData.books = data;
          displayBooks(bookData.books);
      })
      .catch(error => {
          console.error('Error loading book data:', error);
      });
}

// Function to save the updated book data back to db.json.
function saveBooks(id) {
  const selectedBook = document.querySelector(`#bookList li[data-id="${id}"]`);
  fetch(`http://localhost:3000/books`, {
      method: 'PUT', // Using PUT to update the data on the server
      body: JSON.stringify(bookData.books),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (response.ok) {
          console.log('Book data updated successfully.');
      } else {
          console.error('Error updating book data:', response.statusText);
      }
  })
  .catch(error => {
      console.error('Error updating book data:', error);
  });
}

// Function to loan a book
function loanBook(id) {
  const selectedBook = document.querySelector(`#bookList li[data-id="${id}"]`);

  if (selectedBook) {
    if (selectedBook) {
      const availableElement = selectedBook.querySelector(".available");
      let available = parseInt(availableElement.innerText);

      if (available > 0) {
          available -= 1;
          availableElement.innerText = available; // Update the displayed available count
          // After updating the book data, this will save it to the server
          saveBooks();
      } else {
          alert("No more books available to loan.");
      }
  }
}
}

// Event listener for loaning a book
bookList.addEventListener('click', (event) => {
  if (event.target.classList.contains('loan-button')) {
      const selectedBook = event.target.closest('li');
      const bookId = selectedBook.dataset.id;
      loanBook(bookId);
  }
});

// Function to display the book list
function displayBooks(books) {
    // Clear the current book list
    bookList.innerHTML = '';

    books.forEach(book => {
        const li = document.createElement("li");
        li.dataset.id = book.id;
        li.innerHTML = `
            <strong>ID:</strong> ${book.id}<br> 
            <strong>Title:</strong> ${book.title}<br> 
            <strong>Subtitle:</strong> ${book.subtitle}<br>
            <strong>Author:</strong> ${book.author}<br>
            <strong>Published:</strong> ${new Date(book.published).toDateString()}<br>
            <strong>Pages:</strong> ${book.pages}<br>
            <strong>Available:</strong> <span class="available">${book.available}</span><br>
            <strong>Description:</strong> ${book.description}<br>
            <a href="${book.website}" target="_blank">Website</a><br>
            <button class="loan-button">Loan</button>
        `;

        bookList.appendChild(li);
    });
}

// Initial call to load and display books
loadBooks(); // Call this function to load and display books
