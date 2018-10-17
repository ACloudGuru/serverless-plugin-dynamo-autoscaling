const output = require('./__mocks__/cloudformation')
const outputNoRole = require('./__mocks__/cloudformation-no-role')
const Plugin = require('./index')

const PluginFactory = (autoscaling, stage) => {
  stage = stage || 'dev'

  const serverless = {
    cli: {
      log: console.log
    },
    service: {
      custom: { autoscaling },
      getServiceName: () => this.service,
      provider: {
        name: 'aws',
        compiledCloudFormationTemplate: {
          Resources: {}
        }
      },
      service: 'fooservice'
    },
    getProvider: () => {
      return {
        getRegion: () => 'fooregion',
        getStage: () => stage,
      }
    },
  }

  return new Plugin(serverless, stage)
}

describe('#AutoScalingPlugin', () => {

  it('should set defaults', () => {
    const config = {}
    const plugin = PluginFactory(config)

    expect(plugin.defaults(config)).toEqual({
      read: {
        maximum: 200,
        minimum: 5,
        usage: 75
      },
      write: {
        maximum: 200,
        minimum: 5,
        usage: 75
      }
    })
  })

  it('should not create new roles if arn is already provided', () => {
    const config = [{
      roleArn: 'foorolearn',
      table: 'footable',
      index: ['fooindex'],
      write: {
        minimum: 1,
        maximum: 10,
        usage: 70
      },
      read: {
        minimum: 1,
        maximum: 10,
        usage: 70
      }
    }]

    const plugin = PluginFactory(config)
    const resources = plugin.serverless.service.provider.compiledCloudFormationTemplate.Resources

    expect(resources).toEqual({})

    return plugin.beforeDeployResources().then(() => {
      expect(resources).toEqual(outputNoRole)
    })
  })

  it('should generate cloudformation json', () => {
    const config = [{
      table: 'footable',
      index: ['fooindex'],
      write: {
        minimum: 1,
        maximum: 10,
        usage: 70
      },
      read: {
        minimum: 1,
        maximum: 10,
        usage: 70
      }
    }]

    const plugin = PluginFactory(config)
    const resources = plugin.serverless.service.provider.compiledCloudFormationTemplate.Resources

    expect(resources).toEqual({})

    return plugin.beforeDeployResources().then(() => {
      expect(resources).toEqual(output)
    })
  })
})
