const registry = {};

export const renderWrapper = (component) => {
  return (targetElement, state, events) => {
    const element = component(targetElement, state, events);
    const childComponents = element.querySelectorAll("[data-component]");
    Array.from(childComponents).forEach((target) => {
      const name = target.dataset.component;
      const child = registry[name];
      if (!child) {
        return;
      }
      target.replaceWith(child(target, state, events));
    });

    return element;
  };
};

/* 
1. renderRoot로 div.root가 반영된다.
2. div.root내부의 app component에 appView로 노드를 형성하고 추가할 준비를 한다.
3. 이 과정에서 appView에 의해 만들어진 노드 하위에 
    counter, filter, todos componet가 존재하기 때문에
    다시 재귀적으로 각컴포넌트에 ~~View로 노드를 형성하고 추가할 준비를 한다.
4. appView로 형성된 노드 내에 각각의 컴포넌트를 추가하면 app component 가 완성된다.
5. app component를 루트에 추가한다.
*/

export const add = (name, component) => {
  registry[name] = renderWrapper(component);
};

export const renderRoot = (root, state, events) => {
  const cloneComponent = (root) => {
    return root.cloneNode(true);
  };
  return renderWrapper(cloneComponent)(root, state, events);
};
