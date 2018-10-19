const Name = require('../name')

class Target {

  constructor (options, scaling, min, max) {
    this.options = options
    this.scaling = scaling
    this.min = min
    this.max = max
    this.type = 'AWS::ApplicationAutoScaling::ScalableTarget'
    this.dependencies = []
    this.name = new Name(options)
  }

  toJSON() {
    const resource = [ 'table/', { Ref: this.options.table } ]

    if (this.options.index !== '') {
      resource.push('/index/', this.options.index)
    }

    const nameTarget = this.name.target(this.scaling)
    const nameDimension = this.name.dimension(this.scaling)

    return {
      [nameTarget]: {
        DependsOn: this.dependsOn(),
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: { 'Fn::Join': [ '', resource ] },
          RoleARN: this.roleArn(),
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    }
  }

  dependsOn() {
    const dependencies = [ this.options.table ]

    if (!this.options.roleArn) {
      dependencies.push(this.name.role())
    }

    return dependencies.concat(this.dependencies)
  }

  roleArn() {
    const roleArn = this.options.roleArn

    return roleArn ? roleArn : { 'Fn::GetAtt': [ this.name.role(), 'Arn' ] }
  }
}

module.exports = Target
