const Plugin = require('./index');

const PluginFactory = (capacities, stage) => {
  stage = stage || 'dev';

  const serverless = {
    cli: {
      log: console.log
    },
    service: {
      custom: { capacities },
      getServiceName: () => this.service,
      provider: {
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
      };
    },
  };

  return new Plugin(serverless, stage);
};

describe('#AutoScalingPlugin', () => {

  it('should generate cloudformation resources', () => {
    const capacities = [{
      table: 'footable',
      index: [ 'fooindex' ],
      read: {
        minimum: 1,
        maximum: 10,
        usage: 70
      },
      write: {
        minimum: 1,
        maximum: 10,
        usage: 70
      },
    }];

    const plugin = PluginFactory(capacities);

    plugin.process();
  });
});
