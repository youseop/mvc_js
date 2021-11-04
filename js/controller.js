import getTodos from "./getTodos.js";
import todosView from "./view/todos.js";
import counterView from "./view/counter.js";
import filtersView from "./view/filters.js";

import * as registry from "./registry.js";
import { all } from "./constant.js";

registry.add("todos", todosView);
registry.add("counter", counterView);
registry.add("filters", filtersView);

const state = {
  todos: getTodos(),
  currentFilter: all,
};

//모든 dom조작이나 애니메이션은 이 DOM API를 기반으로 해야 한다.
/*이 API는 메인 스레드를 차단하지 않으며 
repaint가 이벤트 루프에서 스케줄링 되기 직전에 실행된다.*/
const render = () => {
  requestAnimationFrame(() => {
    const main = document.querySelector(".todoapp");
    const newMain = registry.renderRoot(main, state);
    applyDiff(document.body, main, newMain);
  });
};

render();

/*
applyDiff function
1. 새 노드가 정의되지 않은 경우 실제 노드를 삭제한다.
2. 실제 노드가 정의되지 않았지만 가상노드가 존재하는 경우 부모 노드에 추가한다.
3. 두 노드가 모두 정의된 경우 두 노드 간에 차이가 있는지 확인한다.
*/
const applyDiff = (parentNode, realNode, virtualNode) => {
  if (realNode && !virtualNode) {
    realNode.remove();
    return;
  }

  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode);
    return;
  }

  if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode);
    return;
  }

  const realChildren = Array.from(realNode.children);
  const virtualChildren = Array.from(virtualNode.children);

  const max = Math.max(realChildren.length, virtualChildren.length);
  for (let i = 0; i < max; i++) {
    applyDiff(realNode, realChildren[i], virtualChildren[i]);
  }
};

const isNodeChanged = (node1, node2) => {
  const n1Attributes = node1.attributes;
  const n2Attributes = node1.attributes;
  if (n1Attributes.length !== n2Attributes.length) {
    return true;
  }

  const differentAttribute = Array.from(n1Attributes).find((attribute) => {
    const { name } = attribute;
    const attribute1 = node1.getAttribute(name);
    const attribute2 = node2.getAttribute(name);
    return attribute1 !== attribute2;
  });

  if (differentAttribute) {
    return true;
  }

  if (
    node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent
  ) {
    return true;
  }

  return false;
};
