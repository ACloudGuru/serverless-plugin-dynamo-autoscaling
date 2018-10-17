const output = require('./__mocks__/cloudformation');
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

  describe('#resources', () => {

    it('should create resources', () => {
      const config = {
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
      };

      const plugin = PluginFactory();
      const resources = plugin.resources('table', 'index', config);

      console.log(resources);
    });

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
      }];

      const plugin = PluginFactory(config);
      const resources = plugin.serverless.service.provider.compiledCloudFormationTemplate.Resources;

      expect(resources).toEqual({});

      plugin.process();

      expect(resources).toEqual(output);
    });
  });
});
