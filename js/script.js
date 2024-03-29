const books = [];
const RELOAD_RENDER = 'render-book';

const readedBook = 'completeBookList';
const unreadedBook = 'uncompleteBookList';

document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('inputData');
    const searchingBook = document.getElementById('search-button');                                                                                                        
    
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    searchingBook.addEventListener('click', function (event) {
        event.preventDefault();
        bookSearch();
        alert('Untuk kembali ke halaman utama, silahkan refresh browser');
      });

    loadDataFromStorage();
    
});

function addBook() {
    const unreadedBookShelf = document.getElementById(unreadedBook);
    const readedBookShelf = document.getElementById(readedBook);
    
    const generateID = generateId();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const check = document.getElementById('check').checked;

    
    const booksItem = makeBook(generateID, title, author, year, check);
    const bookObject = generateBookObject(generateID, title, author, year, check);
    books.push(bookObject);

    if(check) {
        readedBookShelf.append(booksItem);
        alert('Data berhasil disimpan ke rak Buku (Selesai dibaca)');
    } else {
        unreadedBookShelf.append(booksItem);
        alert('Data berhasil disimpan ke rak Buku (Belum selesai dibaca)');
    }

    saveStorageData();

    document.dispatchEvent(new Event(RELOAD_RENDER));
}

function generateId() {
    return +new Date;
}

function generateBookObject(id, title, author, year, check) {
    return {
        id,
        title,
        author,
        year,
        check

    }
}

document.addEventListener(RELOAD_RENDER ,  function(){
    // console.log(books);

    const completeBookList = document.getElementById('completeBookList');
    completeBookList.innerHTML = '';

    const uncompleteBookList = document.getElementById('uncompleteBookList');
    uncompleteBookList.innerHTML = '';

    for(bookItem of books){
        const bookElement = makeBook(bookItem);

        if(bookItem.check){
            completeBookList.append(bookElement);
        } else {
            uncompleteBookList.append(bookElement);
        }
        
    }
});

function makeBook(bookObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;
 
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner')
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('list-item')
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    const bookAction = document.createElement('div');
    bookAction.classList.add('action');

    if(bookObject.check){
 
        const readedButton = document.createElement('button');
        const textReadedButton = document.createTextNode('Belum Selesai baca');
        readedButton.classList.add('undo-button');
        readedButton.appendChild(textReadedButton);
        readedButton.addEventListener('click', function () {
            uncompleteReaded(bookObject.id);
            alert('Data buku berhasil dipindahkan ke rak (Selesai dibaca)');
        });
   
        const trashButton = document.createElement('button');
        const textTrashButton = document.createTextNode('Hapus')
        trashButton.classList.add('trash-button');
        trashButton.appendChild(textTrashButton);
        trashButton.addEventListener('click', function () {
            removeBook(bookObject.id);
            alert('Data buku berhasil dihapus');
        });
   
        container.append(readedButton, trashButton);
    } else {
   
   
        const undoReadedButton = document.createElement('button');
        const textUndoReadButton = document.createTextNode('Selesai Baca');
        undoReadedButton.classList.add('check-button');
        undoReadedButton.appendChild(textUndoReadButton);
        undoReadedButton.addEventListener('click', function () {
            completeReaded(bookObject.id);
            alert('Data buku berhasil dipindahkan ke rak (Belum selesai dibaca)');
        });

        const trashButton = document.createElement('button');
        const textTrashButton = document.createTextNode('Hapus')
        trashButton.classList.add('trash-button');
        trashButton.appendChild(textTrashButton);
        trashButton.addEventListener('click', function () {
                    removeBook(bookObject.id);
                    alert('Data buku berhasil dihapus');
        });
   
        container.append(undoReadedButton, trashButton);
    }

   return container;
}

function completeReaded(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.check = true;

    saveStorageData();

    document.dispatchEvent(new Event(RELOAD_RENDER));
 }


 function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
  }


  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
   
    saveStorageData();

    document.dispatchEvent(new Event(RELOAD_RENDER));
  }
   
   
  function uncompleteReaded(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
    bookTarget.check = false;

    saveStorageData();

    document.dispatchEvent(new Event(RELOAD_RENDER));
  }


  function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
 }
 
 function bookSearch() {  
    const bookSearch = document.getElementById('searchBook');  
    const filter = bookSearch.value.toUpperCase();
    const books = document.querySelectorAll('div,.bookShelf > .book-list > .list-item');

    for (let i = 0; i < books.length; i++) {
        valueText = books[i].textContent || books[i].innerText;
        if (valueText.toUpperCase().indexOf(filter) > -1) {
            books[i].style.display = '';
        } else {
            books[i].style.display = 'none';
        }
    }
}

