const Name = require('../name');

class Target {

  constructor (options, read, min, max) {
    this.options = options;
    this.read = read;
    this.min = min;
    this.max = max;
    this.type = 'AWS::ApplicationAutoScaling::ScalableTarget';
    this.dependencies = [];
    this.name = new Name(options);
  }

  toJSON() {
    const resource = [ 'table/', { Ref: this.options.table } ]

    if (this.options.index !== '') {
      resource.push('/index/', this.options.index)
    }

    const nameTarget = this.name.target(this.read)
    const nameRole = this.name.role()
    const nameDimension = this.name.dimension(this.read)

    const DependsOn = [ this.options.table, nameRole ].concat(this.dependencies)

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: { 'Fn::Join': [ '', resource ] },
          RoleARN: { 'Fn::GetAtt': [ nameRole, 'Arn' ] },
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    };
  }
}

module.exports = Target;
