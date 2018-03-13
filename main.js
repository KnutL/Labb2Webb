window.addEventListener('load', function(event)
{
    const url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let numberOfTries = 0;
    let key = "";
    let statusDiv = document.getElementById('statusDiv');
    let addBookForm = document.getElementById('addBook')
    .addEventListener('submit', addBook);
    let fetchBookBtn = document.getElementById('fetchBookBtn')
    .addEventListener('click', fetchBooks);

    //TEST BUTTONS
    let getKeyBtn = document.getElementById('getKeyBtn')
    .addEventListener('click', getRequestKey);
    let getLocalStorage = this.document.getElementById('getLocalStorage')
    .addEventListener('click', getLocalStorageKey);

    // Funktion för att lägga till böcker

    function addBook(e){
      e.preventDefault();
      let bookTitle = document.getElementById('addBookTitle').value;
      let bookAuthor = document.getElementById('addAuthor').value;
      console.log(bookAuthor + bookTitle);
      let request = new Request(url + 'op=insert&key=' + key + '&title=' + bookTitle + '&author=' + bookAuthor, { method: 'POST'});
      fetch(request)
      .then(response => response.json())
      .then(function(data){
          if(data.status === "success" && numberOfTries < 10){
          operationFinished(data);
      }
      else if(data.status !== "success" && numberOfTries < 10){
          numberOfTries++;
          console.log(data.status + ": failed attempts " + numberOfTries + "/10");
          return addBook(e);
      }
      else if(numberOfTries >= 10){
          operationFailed(data);
      }
      })
      .catch(function (error){
          console.log(error);
      }
      )}
    // För att se alla böcker
    function fetchBooks(){
        let request = new Request(url + 'op=select&key=' + key);

        fetch(request)
        .then(response => response.json())
        .then(data => {
            let bookListDiv = '<h3>Books:</h3>';
            console.log('Data: ' , data);
            data.data.forEach(function(book){
                bookListDiv += `
                    <ul>
                        <li>ID: ${book.id}</li>
                        <li>Title: ${book.title}</li>
                        <li>Author: ${book.author}</li>
                    </ul>`;
            });
            statusDiv.innerText = data.status;
            document.getElementById('bookListDiv').innerHTML = bookListDiv;
        })
    }

    //Få Key
    function getRequestKey(){
        let request = new Request(url + "requestKey");

        fetch(request)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            key = data.key;
            localStorage.setItem('LocalStorageKey', key);
            console.log("Key is: " + key);
        })
    }
    //Local Storage
    function getLocalStorageKey(){
        console.log(localStorage);
    }

    //When an operation finishes
    function operationFinished(data){
        numberOfTries++;
        temp = numberOfTries;
        numberOfTries = 0
        return statusDiv.innerHTML = data.status + "</br>Operation finished after " + temp + " tries.";
    }

    //When an operation fails
    function operationFailed(data){
        temp = numberOfTries;
        numberOfTries = 0;
        console.log("connection failure " + data.status + ": reached maximum attempts: " + temp + "/10");
        return statusDiv.innerHTML = data.status + "</br>Operation failed after " + temp + " tries.</br>" + data.message;
    }

});
