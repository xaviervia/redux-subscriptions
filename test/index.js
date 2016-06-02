const washington = require("washington")

require('./autoDispatch')
require('./getDiff')
require('./newState')
require('./passDispatch')
require('./prevState')

washington.use({
  success: function (success, report) {
    process.stdout.write(`✌ ${success.message}\n`)
  },

  pending: function (pending, report) {
    process.stdout.write(`✍ ${pending.message}\n`)
  },

  failure: function (failure, report) {
    process.stdout.write(`☞ ${failure.message}\n`)
  },

  complete: function (report, code) {
    process.exit(code)
  }
})

washington.go()
