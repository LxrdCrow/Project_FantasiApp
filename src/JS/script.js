import axios from "axios";
import _ from "lodash";
import _get from 'lodash.get';
import '/src/CSS/style.css'; 

document.addEventListener('DOMContentLoaded', function() {
    const buttonClick = document.getElementById('searchBtn');
    const categoryInput = document.getElementById('category');
    
    buttonClick.addEventListener('click', fetchBooks);
    
    
    // event listener for "Enter"
    categoryInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            fetchBooks();
        }
    });
});

// Loader creation
function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 
}

function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}

// WEB API for Open Library
async function fetchBooks() {
    const categoryInput = document.getElementById('category');
    const category = categoryInput.value.trim(); 

    if (!category) {
        // error message for no input
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `<p class="error-message">Please enter a search category</p>`;
        return;
    }

    const url = `https://openlibrary.org/subjects/${category}.json`;
    
    showLoader(); // Loader starts

    try {
        const response = await axios.get(url);
        const books = _.get(response, 'data.works', []);

        if (books.length === 0) {
            // error message for no results
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = `<p class="error-message">No results found for "${category}"</p>`;
        } else {
            displayBooks(books);
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `<p class="error-message">Error fetching data. Please try again later.</p>`;
    } finally {
        hideLoader(); // Loader ends
    }
}

function displayBooks(books) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
      console.error('Element with id "results" not found');
      return;
    }

    resultsContainer.innerHTML = ''; 

    // Creation of each book element 
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book';
        bookElement.innerHTML = `
          <h2 class="book-title" data-key="${book.key}">${book.title}</h2>
          <p class="author">Author: ${book.authors.map(author => author.name).join(', ')}</p>
        `;
        
        if (book.cover_id) {
          const coverImage = document.createElement('img');
          coverImage.src = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
          coverImage.alt = book.title;
          bookElement.appendChild(coverImage);
        }
    
        resultsContainer.appendChild(bookElement);

        const bookTitle = bookElement.querySelector('.book-title');
        bookTitle.addEventListener('click', () => fetchBookDescription(book.key));
    });

    const extraSpace = document.createElement('div');
    extraSpace.className = 'extra-space';
    resultsContainer.appendChild(extraSpace);
}

async function fetchBookDescription(bookKey) {
    const url = `https://openlibrary.org${bookKey}.json`;

    try {
        const response = await axios.get(url);
        let description = _.get(response, 'data.description', 'Description not available');

        // Find element corresponding to the book and add description
        const bookElement = document.querySelector(`[data-key="${bookKey}"]`).parentElement;
        const existingDescription = bookElement.querySelector('.description');
        if (!existingDescription) {
            const descriptionElement = document.createElement('p');
            descriptionElement.className = 'description';
            descriptionElement.textContent = typeof description === 'string' ? description : description.value;
            bookElement.appendChild(descriptionElement);
        }
    } catch (error) {
        console.error("Error fetching book description:", error);
    }
}



      
    
    
  


  

    
