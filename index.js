
//Global variables
let todoInput = document.getElementById('todoInput');
let body = document.getElementById('body');
let ongoing = document.getElementById('ongoing');
let instructions = document.getElementById('instructions');
let trash = document.getElementById('trash');
let todoArr = [];
let index = 0;
let customID = 0;

//main listeners creator
function eventListenersMang(element, event, handler){
  element.addEventListener(event, handler);
}
//end of main listeners creator
//global todo object creator
function constructorObject(value, state){
  this.innerValue = value;
  this.state = state;
}
//End of global variables
//Main functions
let hideShowFunction =(element, state) => {
  if(state == 'hide'){
    element.classList.add('hidden');
  }
  else if(state == 'show'){
    element.classList.remove('hidden');
  }
}

  //LocalStorage check functions

function getLocalStorage(){
  if (localStorage.getItem('ongoing') && index == 0) {
    todoArr = JSON.parse(localStorage.getItem('ongoing'));
    todoArr.forEach((element) => {
      renderToPage(element.innerValue);
      checkState(element);
      index++;
      todoInput.classList = 'pushUp focus';
    });
  }
}
getLocalStorage();

function setLocalStorage(objectValue, state){
  if(state == 'enable'){ //addition
  let objectToBeStored = new constructorObject(objectValue, 'enabled');
  todoArr.push(objectToBeStored);
  localStorage.setItem('ongoing', JSON.stringify(todoArr));
  index++;
}
else if(state == 'disabled'){
  localStorage.setItem('ongoing', JSON.stringify(todoArr));
}
  else{ //removal
    localStorage.setItem('ongoing', JSON.stringify(todoArr));
    index--;
  }
}
//End of localStorage check functions
//state global check
function checkState(object){
  if(object.state == 'enabled') return;
  else{disableState(object);}
}
//state controllers
function enableState(object){
  renderStyling(object, 'enable');
}
function disableState(object){
  renderStyling(object, 'disable');
}
//end of state controllers
//Render engine
  //render elements
function renderToPage(elementToRender){
  let newElement = document.createElement('li');
  newElement.setAttribute('id', `listItem#${index}`);
  newElement.setAttribute('class', 'listItem');
  newElement.setAttribute('data-customID', customID);
  customID++;
  let text = document.createTextNode(elementToRender);
  newElement.appendChild(text);
  ongoing.appendChild(newElement);
  elementToRender = "";//Reset field value
}
  //render elements styling
function renderStyling(object, change){
  let element = document.getElementById(`listItem#${todoArr.indexOf(object)}`);
  if(change == 'enable'){
    element.style.textDecoration = 'none';
  }
  else{
    element.style.textDecoration = 'line-through';
  }
}
//End of rendering function
//Remove task function
function remove(eventTarget){
  let valueOfTarget = eventTarget.firstChild.nodeValue;
  todoArr.splice(eventTarget.attributes[2].nodeValue, 1);
  eventTarget.parentNode.removeChild(eventTarget);
  setLocalStorage(undefined, 'disable');
}
//End of remove task function
//End of main functions
//Main listeners
//Remove element
eventListenersMang(ongoing, 'dblclick', (e)=>{
  remove(e.target);
});
//End of remove element

//addElement
eventListenersMang(todoInput, 'keypress', (e)=>{
  let pressed = e.key;
  if (pressed == 'Enter') {
    //hideShow('show');
    renderToPage(todoInput.value);
    setLocalStorage(todoInput.value, 'enable');
    todoInput.value = '';
    disableInstruct();
  }
});
//end of add element
eventListenersMang(todoInput, 'focus', (e)=>{
  todoInput.classList = 'focus lightBottom pushUp';
  let liList = document.getElementsByTagName('li');
  if(liList.length == 0){
    enableInstruct();
  }
  todoInput.placeholder = 'What to do?';
});

eventListenersMang(todoInput, 'blur', e=>{
  let liList = document.getElementsByTagName('li');
  if(liList.length != 0){
    todoInput.classList = 'pushUp focus';
    instructions.classList.add('hidden');
    disableInstruct();
  }
  else{
    todoInput.classList = '';
    disableInstruct();
    instructions.classList.add('hidden');
  }

});
//Check task as done
eventListenersMang(ongoing, 'click', (e)=>{
  let target = e.target
  console.log(target);
  let indexOfTarget = target.attributes[2].value;
  console.log(indexOfTarget);
  if(target != ongoing){
    if (target.style.textDecoration == 'line-through') {
      target.style.textDecoration = 'none';
      todoArr[indexOfTarget].state = 'enabled'
      setLocalStorage(undefined, 'disabled');
    }
    else {
      target.style.textDecoration = 'line-through';
      todoArr[indexOfTarget].state = 'disabled';
      setLocalStorage(undefined, 'disabled');
    }
  }
});
//End of task check

//Instructions
function enableInstruct(){
  let liList = document.getElementsByTagName('li');
  if(liList.length == 0){
    hideShowFunction(instructions, 'show');
  }
}
function disableInstruct(){
  hideShowFunction(instructions, 'hide');
}

function emptyList(){
  todoArr = [];
  setLocalStorage();
  ongoing.childNodes.forEach((element)=>{
    ongoing.removeChild(element);
  });
  window.location.reload();
}

body.addEventListener('keypress', (e)=>{
  if(e.key == 'Delete'){
    emptyList();
  }
});
