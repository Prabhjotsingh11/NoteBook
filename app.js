let newnote = document.getElementById("addTxt");
let submitBtn = document.getElementById("submitBtn");

function clearInputBox() {
  newnote.value = "";
}

async function sendNoteToBackend() {
  const urlpost = "http://localhost:8000/takenote";
  const dataToSend = {
    notes: newnote.value
  };

  try {
    await fetch(urlpost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });
    render();
    clearInputBox();
  } catch (error) {
    console.log(error);
  }
}


submitBtn.addEventListener("click", sendNoteToBackend);

async function render() {
  const urlget = "http://localhost:8000/getAll";

  try {
    const allnotes = await fetch(urlget);
    const data = await allnotes.json();
    let html = "";
    data.forEach(note => {
      html += `<form class="card horizontal-card">
                <p id='updnote${note._id}' class="card-text">${note.notes}</p>
                <div class="button-group">
                  <img src="bin.png" class="delete-btn" data-dlt="${note._id}">
                  <img src="pen.png" class="edit-btn" data-edit="${note._id}">
                  <button type='button' class="btn update-btn" data-upd="${note._id}">${note.status}</button>
                </div>
              </form>`;
    });
    

    let notesElm = document.getElementById("notes");
    if (data.length != 0) {
      notesElm.innerHTML = html;
    } else {
      notesElm.innerHTML = `Do Something to Create a list!`;
    }

    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(deleteBtn => {
      deleteBtn.addEventListener("click", async () => {
        const id = deleteBtn.getAttribute("data-dlt");
        // console.log(id);
        const url = `/deletenote/${id}`;

        try {
          await fetch(url, {
            method: "DELETE"
          });
          render();
        } 
        catch (error) {
          console.log(error);
        }
      });
    });

    const updateBtns = document.querySelectorAll(".update-btn");
    updateBtns.forEach(updateBtn => {
      updateBtn.addEventListener("click", async () => {
        const id = updateBtn.getAttribute(`data-upd`);
        const url = `/updatestatus/${id}`;
        // const noteElement = document.getElementById(`updnote${id}`);
        // noteElement.style.textDecoration = "line-through";
        try {
          await fetch(url, {
            method: "PATCH"
          });
          // updateBtn.style.backgroundColor = "green";
          render();
        } catch (error) {
          console.log(error);
        }
      });
    });

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(editBtn => {
      editBtn.addEventListener("click", async () => {
        const id = editBtn.getAttribute(`data-edit`);
        const oldnote = document.getElementById(`updnote` + id);

        const textarea = document.createElement("textarea");
        textarea.value = oldnote.textContent;
        oldnote.replaceWith(textarea);


        textarea.addEventListener("blur", async () => {
          const updnote = textarea.value;

          const urlpost = `/updatenote/${id}`;
          const dataToSend = {
            notes: updnote
          };

          try {
            await fetch(urlpost, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(dataToSend)
            });
            render();
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

render();
