// new cards create krne h, data local storage mein save krna h
// local storage se hi cards show krne h
// buttons ko handle krna h
// filters ko add krna h

let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");

const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");

const form = document.querySelector("form");
const imageUrlInput = document.querySelector("#imageUrl");
const fullNameInput = document.querySelector("#fullName");
const homeTownInput = document.querySelector("#homeTown");
const purposeInput = document.querySelector("#purpose");
const categoryInputs = document.querySelectorAll("input[name='category']");
const submitBtn = document.querySelector(".submit-btn");


function saveToLocalStorage(obj){
    // Purane local storage data nikaalo
    if(localStorage.getItem("tasks") === null){
        let oldTasks = [];
        oldTasks.push(obj);
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
    }
    else{
        let oldTasks = localStorage.getItem("tasks");
        oldTasks = JSON.parse(oldTasks);
        oldTasks.push(obj);
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
    }
}

addNote.addEventListener("click", function(){
    formContainer.style.display = "initial";
})

closeForm.addEventListener("click", function(){
    formContainer.style.display = "none";
})

form.addEventListener("submit", function(evt){
    evt.preventDefault();
    const imageUrl = imageUrlInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const homeTown = homeTownInput.value.trim();
    const purpose = purposeInput.value.trim();

    let selected = "";
    
    categoryInputs.forEach(function(cat){
        if(cat.checked) selected = cat.value;
    });
    
    if(imageUrl === ""){
        alert("Please enter an image URL.");
        return;
    }
    if(fullName === ""){
        alert("Please enter your Full Name.");
        return;
    }
    if(homeTown === ""){
        alert("Please enter your Home Town.");
        return;
    }
    if(purpose === ""){
        alert("Please enter the Purpose.");
        return;
    }
    if(!selected){
        alert("Please select a category.");
        return;
    }

    saveToLocalStorage({
        imageUrl,
        fullName,
        purpose,
        homeTown,
        selected,
    });
    
    form.reset();
    formContainer.style.display = "none";
    showCards();
});

function showCards(){
    stack.innerHTML = "";
    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    allTasks.forEach(function(task,index){
        //Create card container
        const card = document.createElement("div");
        card.classList.add("card");

        //avatar image
        const avatar = document.createElement("img");
        avatar.src = task.imageUrl;
        avatar.alt = "profile";
        avatar.classList.add("avatar");
        card.appendChild(avatar);
        
        //name
        const name = document.createElement("h2");
        name.textContent = task.fullName;
        card.appendChild(name);

        //Info: Home town
        const hometownInfo = document.createElement("div");
        hometownInfo.classList.add("info");
        
        const hometownLabel = document.createElement("span");
        hometownLabel.textContent = "Home Town";
        const hometownValue = document.createElement("span");
        hometownValue.textContent = task.homeTown;

        hometownInfo.appendChild(hometownLabel);
        hometownInfo.appendChild(hometownValue);
        card.appendChild(hometownInfo);

        // Info: Bookings
        const bookingsInfo = document.createElement("div");
        bookingsInfo.classList.add("info");
        
        const bookingsLabel = document.createElement("span");
        bookingsLabel.textContent = "Purpose";
        const bookingsValue = document.createElement("span");
        bookingsValue.textContent = task.purpose;

        bookingsInfo.appendChild(bookingsLabel);
        bookingsInfo.appendChild(bookingsValue);
        card.appendChild(bookingsInfo);
        
        // Buttons container
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");
        
        // Call button
        const callBtn = document.createElement("button");
        callBtn.classList.add("call");
        callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';
        
        // Message button
        const msgBtn = document.createElement("button");
        msgBtn.classList.add("msg");
        msgBtn.textContent = "Message";
        
        //Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("deleteBtn");

        deleteBtn.addEventListener("click", function(){
            deleteTask(index);
        });
        
        // Append buttons
        buttonsDiv.appendChild(callBtn);
        buttonsDiv.appendChild(msgBtn);
        buttonsDiv.appendChild(deleteBtn);
        
        // Append buttonsDiv to card
        card.appendChild(buttonsDiv);
        
        // Finally, add the card to the DOM (for example, inside a container)
        stack.appendChild(card); // or any container of your choice
    });
}
showCards();
updateStack();

function updateStack(){
    const cards = document.querySelectorAll(".stack .card");
    cards.forEach(function(card, i) {
        card.style.display = i < 3 ? "block" : "none";
        if (i < 3) {
            card.style.zIndex = 3 - i;
            card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
            card.style.opacity = `${1 - i * 0.1}`;
        } else {
            card.style.zIndex = 0;
            card.style.opacity = "0";
        }
    });
}
function deleteTask(index){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.splice(index, 1); // remove that item

    localStorage.setItem("tasks", JSON.stringify(tasks));

    showCards();     // re-render
    updateStack();   // fix stack UI
}

upBtn.addEventListener("click",function(){
    let lastChild = stack.lastElementChild;
    if(lastChild){
        stack.insertBefore(lastChild, stack.firstElementChild);
        updateStack();
    }
});

downBtn.addEventListener("click",function(){
    let firstChild = stack.firstElementChild;
    if(firstChild){
        stack.appendChild(firstChild);
        updateStack();
    }
});