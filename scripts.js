let noteTextElement = document.getElementById("note-text-input");
let noteDateElement = document.getElementById("date-input");

let notesArray = new Array();

//On sites openning gets old notes from local storage, and displays them.
onLoadGetNotesFromLocalStorage();
onLoadAddNotesToSite();

// Disable past dates from date selection.
let minDate = new Date().toISOString().substring(0, 16);
noteDateElement.min = minDate;

function onSaveClicked() {
    let note = {
        text: noteTextElement.value,
        date: noteDateElement.value
    }

    try {
        validateInput(note);
        arrangeInputIntoDisplayFormat(note);
        notesArray.push(note);
        addNoteToSite(note, notesArray.length - 1);
        addNotesToLocalSession();
        cleanInputs()
    }
    catch (e) {
        alert(e.message);
    }
}

function cleanInputs() {
    noteTextElement.value = "";
    noteDateElement.value = "";
}

function validateInput(note) {
    let errorMessage = "Please address the following:\n";
    note.text = note.text.trim(); //Incase user tryed to enter "                ".

    if (note.text == "") {
        errorMessage = errorMessage + "Describe your task.\n";
    }

    if (note.date == "") {
        errorMessage = errorMessage + "Add final date.";
    }
    else {
        //Incase user entered date manually, makes sure he didn't enter past dates.
        let inputDate = new Date(note.date).toISOString().substring(0, 16);
        minDate = new Date().toISOString().substring(0, 16);
        if (inputDate < minDate) {
            errorMessage = errorMessage + "Please choose a time in the future.";
        }
    }

    if (errorMessage != "Please address the following:\n") {
        throw new Error(errorMessage);
    }
}

function arrangeInputIntoDisplayFormat(note) {
    //inculdes user's "enter" into text.
    note.text = note.text.replace(/\r?\n/g, '<br />');

    //organizes date into DD/MM/YYYY format, and lowering the hour to 2nd line.
    let tempStrDate = note.date.substring(0, 10);
    let tempStrDateArray = tempStrDate.split("-");
    tempStrDateArray = tempStrDateArray.reverse();

    let tempStrHour = note.date.substring(11, 16);

    note.date = tempStrDateArray[0] + "/" + tempStrDateArray[1] + "/" + tempStrDateArray[2] + "<br>" + tempStrHour;
}

function addNoteToSite(note, noteIndex) {
    //Creates a new note background, with the note's index number.
    let notesArea = document.getElementById("notes-area");
    let newNote = document.createElement("p");
    newNote.setAttribute("id", noteIndex);
    newNote.setAttribute("class", "note");
    notesArea.append(newNote);

    //Adds a remove button.
    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "glyphicon glyphicon-remove");
    removeButton.setAttribute("onclick", "removeNote(this)");
    newNote.append(removeButton);

    //Adds the note's text area.
    let newNoteText = document.createElement("span");
    newNoteText.setAttribute("class", "note-text");
    newNoteText.innerHTML = note.text;
    newNote.append(newNoteText);

    //Adds the note's date area.
    let newNoteDate = document.createElement("span");
    newNoteDate.setAttribute("class", "note-date");
    newNoteDate.innerHTML = note.date;
    newNote.append(newNoteDate);
}

function addNotesToLocalSession() {
    //Turns notes array into JSON string.
    let strNotesArray = JSON.stringify(notesArray);

    //Saves the JSON format of the notes into local storage.
    localStorage.setItem("notesList", strNotesArray);
}

function onLoadGetNotesFromLocalStorage() {
    //Looking for notes in the local storage, incase there were old notes, adds them to the notes array.
    let strNotesArray = localStorage.getItem("notesList");
    if (strNotesArray != null) {
        notesArray = JSON.parse(strNotesArray);
    }
}

function onLoadAddNotesToSite() {
    //Displaying notes from local storage.
    for (let i = 0; i < notesArray.length; i++) {
        addNoteToSite(notesArray[i], i);
    }
}

function removeNote(removedNoteButton) {
    let notesAreaElement = document.getElementById("notes-area");

    let removedNoteElement = removedNoteButton.parentElement;
    let removedNoteId = +removedNoteElement.id;

    //Removes note from the notes array, and from site.
    notesArray.splice(removedNoteId, 1);
    removedNoteElement.remove();

    //Updates the rest of the notes with the new id, matching the position in the notesArray.
    for (let i = removedNoteId; i < notesArray.length; i++) {
        notesAreaElement.childNodes[i].id = i;
    }

    //Update local session with new array.
    addNotesToLocalSession();
}