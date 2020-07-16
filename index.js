let add = document.querySelector(".add");
let all = document.querySelector(".all");
let active = document.querySelector(".active");
let completed = document.querySelector(".completed");
let clear = document.querySelector(".clearcompleted");
let ul = document.querySelector(".list");
let footer = document.querySelector(".footer");
let arrow= document.querySelector('.img');
let left=document.querySelector('.left');
let store = Redux.createStore(reducer);

function reducer(state = { list: [], tab: "all" }, action) {
  switch (action.type) {
    case "ADD_Todo": {
      const newTodo = {
        id: Date.now(),
        text: action.text,
        isDone: false,
      };
      return {...state,list:state.list.concat(newTodo)};
    }
    case "Delete_Todo": {
      return {...state,list:state.list.filter((todo) => !(todo.id == action.id))};
    }
    case "Toggle_Todo": {
      return {...state,list:state.list.map((todo) => {
        if (todo.id === action.id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      })};
    }
    case "All_Todo": {
      return { ...state, tab: "all" };
    }
    case "Active_Todo": {
      return { ...state, tab: "active" };
    }
    case "Completed_Todo": {
      return { ...state, tab: "complete" };
    }
    case "CLEAR_COMPLETED":{
        return {...state,list:state.list.filter(todo=> !todo.isDone)}
    }
    case 'EDIT_TODO':{
      return{...state,list:state.list.map(todo=>{
        if(todo.id == action.load.id){
          todo.text = action.load.text
          return todo
        }
        return todo
      })}
    }
    case 'ARROW_SELECT':{
     newList=state.list.filter(todo=> !todo.isDone)
     if(newList.length >0){
         console.log('we are in true')
         
        return{...state,list:state.list.map(todo=>{
            todo.isDone=true
            return todo
            
         })}
     }else{
        console.log('we are in false')

         return{...state,list:state.list.map(todo=>{
             todo.isDone=false
             return todo
         })}
     }
      
    }
  }
}

handleEdit=(event,id)=>{
  let text=event.target.innerText;
  const input=document.createElement('input');
  input.classList.add('edit-input')
  input.value=text
  event.target.parentElement.replaceChild(input,event.target)
  input.addEventListener('keyup',(event)=>{
    if(event.keyCode == 13){
      store.dispatch({
        type:'EDIT_TODO',
        load:{
          id,
          text:input.value
        }
      })
    }
  })
}

function createUi() {
    ul.innerHTML = "";
    const todos = store.getState();
    console.log(store.getState(), "here");
  let filterTodo= todos.list.filter(todo => {
      if(todos.tab == "active" && todo.isDone == false) {
          return todo

      }else if(todos.tab == "complete" && todo.isDone == true) {
        return todo

    }else if(todos.tab== 'all'){
        return todo
    }
  })
  console.log(filterTodo,"filttr")
  leftList=filterTodo.filter(todo=> !todo.isDone)
  left.innerHTML=`${leftList.length} items left`
  filterTodo.forEach((todo) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let spanX = document.createElement("span");
    let checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.checked = todo.isDone;
    p.classList.add("para");
    li.classList.add("li_styles");
    spanX.className = "remove_items";
    spanX.innerHTML = "X";
    spanX.addEventListener("click", () => {
      store.dispatch({
        type: "Delete_Todo",
        id: todo.id,
      });
    });
    if (todo.isDone) p.style.textDecoration = "line-through";
    checkInput.addEventListener("click", () => {
      console.log(todo, "todo");
      store.dispatch({
        type: "Toggle_Todo",
        id: todo.id,
        isDone: todo.isDone,
      });
    });
    p.innerHTML = todo.text;
    p.addEventListener('dblclick',()=>handleEdit(event,todo.id))
    li.append(checkInput, p, spanX);
    ul.append(li);
  });
  // if (todos.length >= 1) {
  // 	footer.style.display = "inline-block";
  // } else {
  // 	footer.style.display = "none";
  // }
}

store.subscribe(createUi);

add.addEventListener("keyup", (event) => {
  if (event.keyCode === 13 && event.target.value.trim() !== "") {
    const text = event.target.value;
    store.dispatch({
      type: "ADD_Todo",
      text,
    });
    event.target.value = "";
  }
});

all.addEventListener("click", (event) => {
  console.log("all");
  store.dispatch({
    type: "All_Todo",
  });
});

active.addEventListener("click", (event) => {
  console.log("active");
  store.dispatch({
    type: "Active_Todo",
  });
});

completed.addEventListener("click", (event) => {
  console.log("complete");
  store.dispatch({
    type: "Completed_Todo",
  });
});


clear.addEventListener('click',(event)=>{
    console.log('clear')
    store.dispatch({
        type:'CLEAR_COMPLETED'
    })
})

arrow.addEventListener('click',(event)=>{
    console.log('arrow')
    store.dispatch({
        type:'ARROW_SELECT'
    })
})