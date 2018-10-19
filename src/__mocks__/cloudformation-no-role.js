const cloudformation = {
  TableScalingPolicyReadFootableDevFooregion: {
      DependsOn: ['footable', 'AutoScalingTargetReadFootableDevFooregion'],
      Properties: {
          PolicyName: 'TableScalingPolicyReadFootableDevFooregion',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: {
              Ref: 'AutoScalingTargetReadFootableDevFooregion'
          },
          TargetTrackingScalingPolicyConfiguration: {
              PredefinedMetricSpecification: {
                  PredefinedMetricType: 'DynamoDBReadCapacityUtilization'
              },
              ScaleInCooldown: 60,
              ScaleOutCooldown: 60,
              TargetValue: 70
          }
      },
      Type: 'AWS::ApplicationAutoScaling::ScalingPolicy'
  },
  AutoScalingTargetReadFootableDevFooregion: {
      DependsOn: ['footable'],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }]]
          },
          RoleARN: "foorolearn",
          ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  },
  TableScalingPolicyWriteFootableDevFooregion: {
      DependsOn: ['footable', 'AutoScalingTargetWriteFootableDevFooregion'],
      Properties: {
          PolicyName: 'TableScalingPolicyWriteFootableDevFooregion',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: {
              Ref: 'AutoScalingTargetWriteFootableDevFooregion'
          },
          TargetTrackingScalingPolicyConfiguration: {
              PredefinedMetricSpecification: {
                  PredefinedMetricType: 'DynamoDBWriteCapacityUtilization'
              },
              ScaleInCooldown: 60,
              ScaleOutCooldown: 60,
              TargetValue: 70
          }
      },
      Type: 'AWS::ApplicationAutoScaling::ScalingPolicy'
  },
  AutoScalingTargetWriteFootableDevFooregion: {
      DependsOn: ['footable'],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }]]
          },
          RoleARN: "foorolearn",
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  },
  TableScalingPolicyReadFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'AutoScalingTargetReadFootableFooindexDevFooregion',
          'TableScalingPolicyReadFootableDevFooregion',
          'AutoScalingTargetReadFootableDevFooregion',
          'TableScalingPolicyWriteFootableDevFooregion',
          'AutoScalingTargetWriteFootableDevFooregion'
      ],
      Properties: {
          PolicyName: 'TableScalingPolicyReadFootableFooindexDevFooregion',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: {
              Ref: 'AutoScalingTargetReadFootableFooindexDevFooregion'
          },
          TargetTrackingScalingPolicyConfiguration: {
              PredefinedMetricSpecification: {
                  PredefinedMetricType: 'DynamoDBReadCapacityUtilization'
              },
              ScaleInCooldown: 60,
              ScaleOutCooldown: 60,
              TargetValue: 70
          }
      },
      Type: 'AWS::ApplicationAutoScaling::ScalingPolicy'
  },
  AutoScalingTargetReadFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'TableScalingPolicyReadFootableDevFooregion',
          'AutoScalingTargetReadFootableDevFooregion',
          'TableScalingPolicyWriteFootableDevFooregion',
          'AutoScalingTargetWriteFootableDevFooregion'
      ],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }, '/index/', 'fooindex']]
          },
          RoleARN: "foorolearn",
          ScalableDimension: 'dynamodb:index:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  },
  TableScalingPolicyWriteFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'AutoScalingTargetWriteFootableFooindexDevFooregion',
          'TableScalingPolicyReadFootableDevFooregion',
          'AutoScalingTargetReadFootableDevFooregion',
          'TableScalingPolicyWriteFootableDevFooregion',
          'AutoScalingTargetWriteFootableDevFooregion'
      ],
      Properties: {
          PolicyName: 'TableScalingPolicyWriteFootableFooindexDevFooregion',
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: {
              Ref: 'AutoScalingTargetWriteFootableFooindexDevFooregion'
          },
          TargetTrackingScalingPolicyConfiguration: {
              PredefinedMetricSpecification: {
                  PredefinedMetricType: 'DynamoDBWriteCapacityUtilization'
              },
              ScaleInCooldown: 60,
              ScaleOutCooldown: 60,
              TargetValue: 70
          }
      },
      Type: 'AWS::ApplicationAutoScaling::ScalingPolicy'
  },
  AutoScalingTargetWriteFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'TableScalingPolicyReadFootableDevFooregion',
          'AutoScalingTargetReadFootableDevFooregion',
          'TableScalingPolicyWriteFootableDevFooregion',
          'AutoScalingTargetWriteFootableDevFooregion'
      ],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }, '/index/', 'fooindex']]
          },
          RoleARN: "foorolearn",
          ScalableDimension: 'dynamodb:index:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  }
};

module.exports = cloudformation;
