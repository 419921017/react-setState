function setState() {
  console.log("setState");
}

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

let transaction = new Transaction([
  {
    initialize() {
      console.log("initialise1");
    },
    close() {
      console.log("close1");
    },
  },
  {
    initialize() {
      console.log("initialise2");
    },
    close() {
      console.log("close2");
    },
  },
]);

transaction.perform(setState);
