class Counter {
  constructor() {
    this.state = {
      number: 0
    }
  }
  createDOMFromDOMString(domString) {
    const div = document.createElement('div')
    div.innerHTML = domString
    return div.children[0]
  }
  add() {
    this.state = {
      number: this.state.number + 1
    }
    const oldElement = this.domElement
    const newElement = this.render()
    this.domElement = newElement
    oldElement.parentElement.replaceChild(newElement, oldElement)
  }
  render() {
    this.domElement = this.createDOMFromDOMString(`
      <button >${this.state.number}</button>
    `)
    this.domElement.addEventListener('click', this.add.bind(this))
    return this.domElement
  }
}

