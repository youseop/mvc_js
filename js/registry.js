const registry = {};

export const renderWrapper = (component) => {
  return (targetElement, state) => {
    const element = component(targetElement, state);
    const childComponents = element.querySelector("[data-component]");
    Array.from(childComponents).forEach((target) => {
      const name = target.dataset.component;
      const child = registry[name];
      if (!child) {
        return;
      }

      target.replaceWith(child(target, state));
    });

    return element;
  };
};

export const add = (name, component) => {
  registry[name] = renderWrapper(component);
};

export const renderRoot = (root, state) => {
  const cloneComponent = (root) => {
    return root.cloneNode(true);
  };
  return renderWrapper(cloneComponent)(root, state);
};
