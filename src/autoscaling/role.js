class Role {

  constructor (options) {
    this.options = options;

    this.type = 'AWS::IAM::Role';
    this.version = '2012-10-17';

    this.actions = {
      CloudWatch: [
        'cloudwatch:PutMetricAlarm',
        'cloudwatch:DescribeAlarms',
        'cloudwatch:DeleteAlarms',
        'cloudwatch:GetMetricStatistics',
        'cloudwatch:SetAlarmState'
      ],
      DynamoDB: [
        'dynamodb:DescribeTable',
        'dynamodb:UpdateTable'
      ]
    };
  }

  toJSON() {
    const RoleName = this.name.role()
    const PolicyName = this.name.policyRole()

    const DependsOn = [ this.options.table ].concat(this.dependencies)
    const Principal = this.principal()
    const Version = this.version
    const Type = this.type

    return {
      [RoleName]: {
        DependsOn,
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              { Action: 'sts:AssumeRole', Effect: 'Allow', Principal }
            ],
            Version
          },
          Policies: [
            {
              PolicyDocument: {
                Statement: [
                  { Action: this.actions.CloudWatch, Effect: 'Allow', Resource: '*' },
                  { Action: this.actions.DynamoDB, Effect: 'Allow', Resource: this.resource() }
                ],
                Version
              },
              PolicyName
            }
          ],
          RoleName
        },
        Type
      }
    };
  }

  resource() {
    return {
      'Fn::Join': [ '', [ 'arn:aws:dynamodb:*:', { Ref: 'AWS::AccountId' }, ':table/', { Ref: this.options.table } ] ]
    };
  }

  principal() {
    return { Service: 'application-autoscaling.amazonaws.com' };
  }
}

module.exports = Role;
