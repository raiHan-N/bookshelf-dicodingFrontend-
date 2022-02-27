const EVENT_SAVE = "saved-book";
const BOOK_KEY = "booksShelf";
 

function saveStorageData() {
    if(isStorageAvailable()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOK_KEY, parsed);
        document.dispatchEvent(new Event(EVENT_SAVE));
    }
}


function isStorageAvailable() {
  if(typeof(Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
  }
  return true;
}

document.addEventListener(EVENT_SAVE, function() {
    console.log(localStorage.getItem(BOOK_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOK_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
   
   
    document.dispatchEvent(new Event(RELOAD_RENDER));
}