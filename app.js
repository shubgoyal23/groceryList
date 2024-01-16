const alertMsg = document.querySelector(".alert");
const input = document.querySelector("#input");
const form = document.querySelector("#form");
const listContainer = document.querySelector(".list");
const clear = document.querySelector(".clear");

let editFlag = false;
let ID;

window.addEventListener("DOMContentLoaded", ()=>{
  items = getlocalStorage()
  items.map((item) => {
    addOldItemToList(item.value, item.id)
  })
})

function formSubmitHandler(event) {
  event.preventDefault();
  if (!input.value) {
    return displayAlert("Enter Valid Input", "red");
  }
  
  addItemToList(input.value);
}

function displayAlert(message, method) {
  alertMsg.classList.remove("hidden");
  alertMsg.classList.add(method);
  alertMsg.innerHTML = `<p>${message}</p>`;
  setTimeout(() => {
    alertMsg.classList.remove(method);
    alertMsg.classList.add("hidden");
  }, 1000);
}

function addItemToList(item) {
  if (editFlag) {
    document.getElementById(ID).firstChild.lastChild.innerText = item;
    document.querySelector(".input-container button").innerText = "Add item";
    editFlag = false;
    input.value = "";
    displayAlert("Edit Sucessful", "green");
    changeItemInLocalStorage(ID, item)
  } else {
    const list = document.createElement("div");
    list.classList.add("items");
    const ID = Math.round(Math.random() * 10000);
    list.id = ID
    list.innerHTML = `<div>
    <input type="checkbox" name=${item} id=${list.id}-${item}>
    <label for=${list.id}-${item}>${item}</label></div>
    <div>
        <button id="edit-btn"><img src="images/edit.png" alt="edit"></button>
        <button id="delete-btn"><img src="images/delete.png" alt="delete"></button>
    </div>`;
    listContainer.appendChild(list);
    list.querySelector(`#edit-btn`).addEventListener("click", editHandler);
    list.querySelector(`#delete-btn`).addEventListener("click", deleteHandler);
    list.querySelector(`input`).addEventListener("click", checkHandler);

    clear.classList.remove("hidden");
    displayAlert("Added Sucessful", "green");
    input.value = "";

    setItemToLocalStorage(ID, item)
  }
}

function checkHandler(e){
  e.target.nextElementSibling.classList.toggle("marked-done")
  if(e.target.nextElementSibling.classList.contains("marked-done")){
    displayAlert("marked as Done", "green")
  }else{
    displayAlert("marked Not as Done", "red")
  }
}

function editHandler(e) {
  document.querySelector(".input-container button").innerText = "Edit item";
  editFlag = true;
  ID = e.currentTarget.parentElement.parentElement.id;
  input.value = document.getElementById(ID).firstChild.innerText;
}
function deleteHandler(e) {
  let ID = e.currentTarget.parentElement.parentElement.id
    e.currentTarget.parentElement.parentElement.remove();
    displayAlert("Deleted", "red");
    if(listContainer.childNodes.length === 1){
        displayAlert("List is Empty", "red")
        clear.classList.add("hidden")
    }
    editFlag = false
    document.querySelector(".input-container button").innerText = "Add item";
    input.value = "";
    
    items = getlocalStorage()
    items = items.filter((itemsObj) => {
      if (itemsObj.id != ID){
        return itemsObj
      }
    })
    localStorage.setItem("list", JSON.stringify(items))

}

function clearHandler() {
  listContainer.innerHTML = "";
  clear.classList.add("hidden");
  displayAlert("All Items Deleted", "red");
  localStorage.removeItem("list")
}

function setItemToLocalStorage(id, value){
  const grocery = {id, value}
  let items = getlocalStorage()
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items))
}

function getlocalStorage(){
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function changeItemInLocalStorage(id, value){
  items= getlocalStorage()
  items = items.map((obj) =>{
    if (obj.id == ID){
      obj.value = value
    }
    return obj
  })

  localStorage.setItem("list", JSON.stringify(items))
}

function addOldItemToList(item, ID){
  const list = document.createElement("div");
    list.classList.add("items");
    list.id = ID
    list.innerHTML = `<div>
    <input type="checkbox" name=${item} id=${list.id}-${item}>
    <label for=${list.id}-${item}>${item}</label></div>
    <div>
        <button id="edit-btn"><img src="/images/edit.png" alt="edit"></button>
        <button id="delete-btn"><img src="/images/delete.png" alt="delete"></button>
    </div>`;
    listContainer.appendChild(list);
    list.querySelector(`#edit-btn`).addEventListener("click", editHandler);
    list.querySelector(`#delete-btn`).addEventListener("click", deleteHandler);
    list.querySelector(`input`).addEventListener("click", checkHandler);

    clear.classList.remove("hidden");
    displayAlert("Item Restored", "green");
    input.value = "";
}
clear.addEventListener("click", clearHandler);
form.addEventListener("submit", formSubmitHandler);
