import appView from "./view/app.js";
import todosView from "./view/todos.js";
import counterView from "./view/counter.js";
import filtersView from "./view/filters.js";
import { applyDiff } from "./applyDiff.js";

import * as registry from "./registry.js";
import { all } from "./constant.js";

registry.add("app", appView);
registry.add("todos", todosView);
registry.add("counter", counterView);
registry.add("filters", filtersView);

const state = {
  todos: [],
  currentFilter: all,
};

const events = {
  deleteItem: (index) => {
    state.todos.splice(index, 1);
    render();
  },
  addItem: (text) => {
    state.todos.push({
      text,
      completed: false,
    });
    render();
  },
};

//모든 dom조작이나 애니메이션은 이 DOM API를 기반으로 해야 한다.
/*이 API는 메인 스레드를 차단하지 않으며 
repaint가 이벤트 루프에서 스케줄링 되기 직전에 실행된다.*/
const render = () => {
  requestAnimationFrame(() => {
    const main = document.querySelector("#root");
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

render();
