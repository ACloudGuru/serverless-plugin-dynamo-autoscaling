const Name = require('../name')

class Policy {

  constructor (options, scaling, value, scaleIn, scaleOut) {
    this.options = options
    this.scaling = scaling
    this.value = value
    this.scaleIn = scaleIn
    this.scaleOut = scaleOut
    this.type = 'AWS::ApplicationAutoScaling::ScalingPolicy'
    this.dependencies = []
    this.name = new Name(options)
  }

  toJSON() {
    const PredefinedMetricType = this.name.metric(this.scaling)
    const PolicyName = this.name.policyScale(this.scaling)
    const Target = this.name.target(this.scaling)

    const DependsOn = [ this.options.table, Target ].concat(this.dependencies)

    return {
      [PolicyName]: {
        DependsOn,
        Properties: {
          PolicyName,
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: Target },
          TargetTrackingScalingPolicyConfiguration: {
            PredefinedMetricSpecification: {
              PredefinedMetricType
            },
            ScaleInCooldown: this.scaleIn,
            ScaleOutCooldown: this.scaleOut,
            TargetValue: this.value
          }
        },
        Type: this.type
      }
    }
  }
}

module.exports = Policy
