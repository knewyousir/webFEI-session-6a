import dep1 from './dep-1.js';

function getComponent () {
  var element = document.createElement('div');
  element.innerHTML = dep1();
  return element;
}

document.body.appendChild(getComponent());