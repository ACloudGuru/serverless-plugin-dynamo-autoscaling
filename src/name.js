const util = require('util')
const { clean, ucfirst } = require('./utility')

const TEXT = {
  DIMENSION: 'dynamodb:%s:%sCapacityUnits',
  METRIC: 'DynamoDB%sCapacityUtilization',
  POLICYROLE: 'DynamoDBAutoscalePolicy',
  POLICYSCALE: 'TableScalingPolicy-%s',
  ROLE: 'DynamoDBAutoscaleRole',
  TARGET: 'AutoScalingTarget-%s'
}

class Name {
  constructor(options) {
    this.options = options
  }

  policyRole() {
    return clean(this.build(TEXT.POLICYROLE))
  }

  dimension(scaling) {
    const type = this.options.index === '' ? 'table' : 'index'

    return util.format(TEXT.DIMENSION, type, scaling)
  }

  role() {
    return clean(this.build(TEXT.ROLE))
  }

  target(scaling) {
    return clean(this.build(TEXT.TARGET, scaling))
  }

  policyScale(scaling) {
    return clean(this.build(TEXT.POLICYSCALE, scaling))
  }

  metric(scaling) {
    return clean(util.format(TEXT.METRIC, scaling))
  }

  build(data, ...args) {
    return [
      this.prefix(),
      args ? util.format(data, ...args) : data,
      this.suffix()
    ].join('')
  }

  prefix() {
    return this.options.service
  }

  suffix() {
    return [
      this.options.table,
      this.options.index,
      this.options.stage,
      this.options.region
    ].map(ucfirst).join('')
  }
}

module.exports = Name
