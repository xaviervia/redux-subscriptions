module.exports = () =>
  function self (args) {
    self.newState = args.newState
    self.prevState = args.prevState
    self.getDiff = args.getDiff
    self.dispatch = args.dispatch
  }
