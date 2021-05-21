const { json } = require("express");

const loadBooks = () => {
    //fetching the server url
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://localhost:8000/public/api/books', false);
    xhttp.send()

    const books = JSON.parse(xhttp.responseText);

    for(let book of books) {
        const bookList = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${book.isbn}</h6>

                        <div>Author: ${book.author}</div>
                        <div>Publisher: ${book.publisher}</div>
                        <div>Number Of Pages: ${book.numOfPages}</div>

                        <hr>

                        <button type="button" class="btn btn-danger">Delete</button>
                        <button types="button" class="btn btn-primary" data-toggle="modal"
                            data-target="#editBookModal" onClick="setEditModal(${book.isbn})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `
        document.getElementById('books').innerHTML += bookList;
    };
};
loadBooks();

const deleteBooks = (isbn) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `http://localhost:8000/books/:${isbn}`, true);
    xhttp.send();

    //reload the page for update
    location.reload();
};

//edit button
const setEditModal = (isbn) => {
    const xhttp = XMLHttpRequest();
    xhttp.open('GET', `http://localhost:8000/books/:${isbn}`, false);
    xhttp.send();

    const book = json.parse(xhttp.responseText);

    const {
        title,
        author,
        publisher,
        publishDate,
        numOfPages
    } = book;

   document.getElementById('isbn').value = isbn;
   document.getElementById('title').value = title;
   document.getElementById('author').value = author;
   document.getElementById('publisher').value = publisher;
   document.getElementById('publishDate').value = publishDate;
   document.getElementById('numOfPages').value = numOfPages;

   //setting the action url for the book
   document.getElementById('editForm').action = `http://localhost:8000/books/${isbn}`;
}