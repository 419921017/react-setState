/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-01-18 18:32:19
 * @LastEditors: power_840
 * @LastEditTime: 2021-01-18 19:42:15
 */

class Transaction {
  constructor(wrappers) {
    this.wrappers = wrappers;
  }
  perform(anyMethod) {
    this.wrappers.forEach((wrapper) => wrapper.initialize());
    anyMethod.call();
    this.wrappers.forEach((wrapper) => wrapper.close());
  }
}
let batchingStrategy = {
  isBatchingUpdates: false,
  dirtyComponents: [],
  bacthedUpdates() {
    this.dirtyComponents.forEach((component) => component.updateComponent());
  },
};

class Updater {
  constructor(component) {
    this.component = component;
    this.pendingStates = [];
  }
  addState(particalState) {
    this.pendingStates.push(particalState);
    // 如果不是批量更新的, 直接更新
    if (!batchingStrategy.isBatchingUpdates) {
      this.component.updateComponent();
    }
    // 是批量更新的话就加入脏组件队列
    batchingStrategy.dirtyComponents.push(this.component);
  }
}

class Component {
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
  }
  createDOMFromDOMString(domString) {
    const div = document.createElement("div");
    div.innerHTML = domString;
    return div.children[0];
  }

  updateComponent() {
    this.updater.pendingStates.forEach((particalState) =>
      Object.assign(this.state, particalState)
    );
    this.updater.pendingStates.length = 0;
    let oldElement = this.domElement;
    let newElement = this.renderElement();
    oldElement.parentElement.replaceChild(newElement, oldElement);
  }

  setState(particalState) {
    this.updater.addState(particalState);
  }

  renderElement() {
    let renderString = this.render();
    this.domElement = this.createDOMFromDOMString(renderString);
    // dom节点的component属性 = 当前组件实例
    this.domElement.component = this;
    return this.domElement;
  }

  mount(container) {
    container.appendChild(this.renderElement());
  }
}

let transaction = new Transaction([
  {
    initialize() {
      // 开启批量更新模式
      batchingStrategy.isBatchingUpdates = true;
    },
    close() {
      // 关闭批量更新模式
      batchingStrategy.isBatchingUpdates = false;
      // 开始批量更新, 所有的脏组件根据自己的state和props进行更新
      batchingStrategy.bacthedUpdates();
    },
  },
]);

window.trigger = function (event, methodName, ...other) {
  transaction.perform(
    event.target.component[methodName].bind(
      event.target.component,
      event,
      ...other
    )
  );
};

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  add() {
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);

    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    });
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    });
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);

    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);

    // this.state = {
    //   number: this.state.number + 1,
    // };
    // const oldElement = this.domElement;
    // const newElement = this.render();
    // this.domElement = newElement;
    // oldElement.parentElement.replaceChild(newElement, oldElement);
  }
  render() {
    return `
    <button onClick="trigger(event, 'add')">${this.state.number}</button>
  `;
  }
}
