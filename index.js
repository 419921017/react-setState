class Component {
  constructor(props) {
    this.props = props

  }
  createDOMFromDOMString(domString) {
    const div = document.createElement('div');
    div.innerHTML = domString;
    return div.children[0];
  }

  setState(intrinsicState) {
    this.state = Object.assign(this.state, intrinsicState);
    let oldElement = this.domElement;
    let newElement = this.render();
    oldElement.parentElement.replaceChild(newElement, oldElement);
  }

  renderElement() {
    let renderString = this.render();
    this.domElement = this.createDOMFromDOMString(renderString);
    return this.domElement;
  }

  mount(container) {
    container.appendChild(this.renderElement());
  }
}

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0,
    };
  }
  add() {
    this.setState({ number: this.state.number + 1 });
    // this.state = {
    //   number: this.state.number + 1,
    // };
    // const oldElement = this.domElement;
    // const newElement = this.render();
    // this.domElement = newElement;
    // oldElement.parentElement.replaceChild(newElement, oldElement);
  }
  render() {
    console.log(this.mount);
    return `
    <button >${this.state.number}</button>
  `;
  }
}
