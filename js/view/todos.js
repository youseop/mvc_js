let template;

const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById("todo-item");
  }
  return template.content.firstElementChild.cloneNode(true);
};

const getTodoElement = (todo, index) => {
  const { text, completed } = todo;

  const element = createNewTodoNode();

  element.querySelector("input.edit").value = text;
  element.querySelector("label").textContent = text;

  if (completed) {
    element.classList.add("completed");
    element.querySelector("input.toggle").checked = true;
  }

  element.querySelector("button.destroy").dataset.index = index;
  element.querySelector("input.toggle").dataset.index = index;
  element.id = index;

  return element;
};

export default (targetElement, state, events) => {
  const { todos } = state;
  const { deleteItem, toggleItemCompletion } = events;
  const newTodoList = targetElement.cloneNode(true);
  newTodoList.innerHTML = "";

  todos
    .map((todo, index) => getTodoElement(todo, index, events))
    .forEach((element) => {
      newTodoList.appendChild(element);
    });

  newTodoList.addEventListener("click", (e) => {
    if (e.target.matches("button.destroy")) {
      const targetIndex = e.target.dataset.index;
      deleteItem(targetIndex);
    } else if (e.target.matches("input.toggle")) {
      const targetIndex = e.target.dataset.index;
      toggleItemCompletion(targetIndex);
    }
  });

  return newTodoList;
};
