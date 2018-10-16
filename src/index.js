'use strict';

const util = require('util');
const assert = require('assert');
const merge = require('lodash.merge');

const Role = require('./autoscaling/role');
const Target = require('./autoscaling/target');
const Policy = require('./autoscaling/policy');

const message = {
  CLI_DONE: 'Added DynamoDB Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building configuration for resource "table/%s%s"',
  CLI_SKIP: 'Skipping DynamoDB Auto Scaling: %s!',
  CLI_START: 'Configure DynamoDB Auto Scaling …',
  INVALID_CONFIGURATION: 'Invalid serverless configuration',
  NO_AUTOSCALING_CONFIG: 'Not Auto Scaling configuration found',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provicer'
};

class DynamoDBAutoscalingPlugin {

  constructor(serverless) {
    this.serverless = serverless;

    this.hooks = {
      'package:compileEvents': this.beforeDeployResources.bind(this)
    };
  }

  validate() {
    assert(this.serverless, message.INVALID_CONFIGURATION)
    assert(this.serverless.service, message.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider, message.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider.name, message.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider.name === 'aws', message.ONLY_AWS_SUPPORT)

    assert(this.serverless.service.custom, message.NO_AUTOSCALING_CONFIG)
    assert(this.serverless.service.custom.capacities, message.NO_AUTOSCALING_CONFIG)
  }

  defaults(config) {
    return {
      read: {
        maximum: config.read && config.read.maximum ? config.read.maximum : 200,
        minimum: config.read && config.read.minimum ? config.read.minimum : 5,
        usage: config.read && config.read.usage ? config.read.usage : 0.75
      },
      write: {
        maximum: config.write && config.write.maximum ? config.write.maximum : 200,
        minimum: config.write && config.write.minimum ? config.write.minimum : 5,
        usage: config.write && config.write.usage ? config.write.usage : 0.75
      }
    }
  }

  resources(table, index, config) {
    const data = this.defaults(config)

    const options = {
      index,
      region: this.serverless.getProvider('aws').getRegion(),
      service: this.serverless.service.getServiceName(),
      stage: this.serverless.getProvider('aws').getStage(),
      table
    }

    this.serverless.cli.log(
      util.format(message.CLI_RESOURCE, table, (index ? ('/index/' + index) : ''))
    )

    const resources = [
      new Role(options)
    ]

    if (config.read) {
      resources.push(...this.getPolicyAndTarget(options, data.read, true))
    }

    if (config.write) {
      resources.push(...this.getPolicyAndTarget(options, data.write, false))
    }

    return resources;
  }

  getPolicyAndTarget(options, data, read) {
    return [
      new Policy(options, read, data.usage, 60, 60),
      new Target(options, read, data.minimum, data.maximum)
    ];
  }

  generate(table, config) {
    let resources = []
    let lastRessources = []

    const indexes = this.normalize(config.index);

    if (!config.indexOnly) {
      indexes.unshift('') // Horrible solution
    }

    indexes.forEach(
      (index) => {
        const current = this.resources(table, index, config).map(
          (resource) => resource.setDependencies(lastRessources).toJSON()
        )

        resources = resources.concat(current)
        lastRessources = current.map((item) => Object.keys(item).pop())
      }
    )

    return resources
  }

  normalize(data) {
    if (data && data.constructor !== Array) {
      return [ data ];
    }

    return (data || []).slice(0)
  }

  process() {
    this.serverless.service.custom.capacities.filter(
      (config) => !!config.read || !!config.write
    ).forEach(
      (config) => this.normalize(config.table).forEach(
        (table) => this.generate(table, config).forEach(
          (resource) => merge(
            this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
            resource
          )
        )
      )
    )
  }

  beforeDeployResources() {
    return Promise.resolve()
      .then(() => this.validate())
      .then(() => this.serverless.cli.log(util.format(message.CLI_START)))
      .then(() => this.process())
      .then(() => this.serverless.cli.log(util.format(message.CLI_DONE)))
      .catch((err) => this.serverless.cli.log(util.format(message.CLI_SKIP, err.message)))
  }
}

module.exports = DynamoDBAutoscalingPlugin;
