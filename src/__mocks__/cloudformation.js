const cloudformation = {
  DynamoDBAutoscaleRoleFootableDevFooregion: {
    DependsOn: ['footable'],
    Properties: {
        AssumeRolePolicyDocument: {
            Statement: [{
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                    Service: 'application-autoscaling.amazonaws.com'
                }
            }],
            Version: '2012-10-17'
        },
        Policies: [{
            PolicyDocument: {
                Statement: [{
                    Action: ['cloudwatch:PutMetricAlarm',
                        'cloudwatch:DescribeAlarms',
                        'cloudwatch:DeleteAlarms',
                        'cloudwatch:GetMetricStatistics',
                        'cloudwatch:SetAlarmState'
                    ],
                    Effect: 'Allow',
                    Resource: '*'
                }, {
                    Action: ['dynamodb:DescribeTable', 'dynamodb:UpdateTable'],
                    Effect: 'Allow',
                    Resource: {
                        'Fn::Join': ['', ['arn:aws:dynamodb:*:', {
                                Ref: 'AWS::AccountId'
                            },
                            ':table/', {
                                Ref: 'footable'
                            }
                        ]]
                    }
                }],
                Version: '2012-10-17'
            },
            PolicyName: 'DynamoDBAutoscalePolicyFootableDevFooregion'
        }],
        RoleName: 'DynamoDBAutoscaleRoleFootableDevFooregion'
    },
    Type: 'AWS::IAM::Role'
  },
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
      DependsOn: ['footable', 'DynamoDBAutoscaleRoleFootableDevFooregion'],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }]]
          },
          RoleARN: {
              'Fn::GetAtt': ['DynamoDBAutoscaleRoleFootableDevFooregion', 'Arn']
          },
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
      DependsOn: ['footable', 'DynamoDBAutoscaleRoleFootableDevFooregion'],
      Properties: {
          MaxCapacity: 10,
          MinCapacity: 1,
          ResourceId: {
              'Fn::Join': ['', ['table/', {
                  Ref: 'footable'
              }]]
          },
          RoleARN: {
              'Fn::GetAtt': ['DynamoDBAutoscaleRoleFootableDevFooregion', 'Arn']
          },
          ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  },
  DynamoDBAutoscaleRoleFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'DynamoDBAutoscaleRoleFootableDevFooregion',
          'TableScalingPolicyReadFootableDevFooregion',
          'AutoScalingTargetReadFootableDevFooregion',
          'TableScalingPolicyWriteFootableDevFooregion',
          'AutoScalingTargetWriteFootableDevFooregion'
      ],
      Properties: {
          AssumeRolePolicyDocument: {
              Statement: [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                      Service: 'application-autoscaling.amazonaws.com'
                  }
              }],
              Version: '2012-10-17'
          },
          Policies: [{
              PolicyDocument: {
                  Statement: [{
                      Action: ['cloudwatch:PutMetricAlarm',
                          'cloudwatch:DescribeAlarms',
                          'cloudwatch:DeleteAlarms',
                          'cloudwatch:GetMetricStatistics',
                          'cloudwatch:SetAlarmState'
                      ],
                      Effect: 'Allow',
                      Resource: '*'
                  }, {
                      Action: ['dynamodb:DescribeTable', 'dynamodb:UpdateTable'],
                      Effect: 'Allow',
                      Resource: {
                          'Fn::Join': ['', ['arn:aws:dynamodb:*:', {
                                  Ref: 'AWS::AccountId'
                              },
                              ':table/', {
                                  Ref: 'footable'
                              }
                          ]]
                      }
                  }],
                  Version: '2012-10-17'
              },
              PolicyName: 'DynamoDBAutoscalePolicyFootableFooindexDevFooregion'
          }],
          RoleName: 'DynamoDBAutoscaleRoleFootableFooindexDevFooregion'
      },
      Type: 'AWS::IAM::Role'
  },
  TableScalingPolicyReadFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'AutoScalingTargetReadFootableFooindexDevFooregion',
          'DynamoDBAutoscaleRoleFootableDevFooregion',
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
          'DynamoDBAutoscaleRoleFootableFooindexDevFooregion',
          'DynamoDBAutoscaleRoleFootableDevFooregion',
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
          RoleARN: {
              'Fn::GetAtt': ['DynamoDBAutoscaleRoleFootableFooindexDevFooregion', 'Arn']
          },
          ScalableDimension: 'dynamodb:index:ReadCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  },
  TableScalingPolicyWriteFootableFooindexDevFooregion: {
      DependsOn: ['footable',
          'AutoScalingTargetWriteFootableFooindexDevFooregion',
          'DynamoDBAutoscaleRoleFootableDevFooregion',
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
          'DynamoDBAutoscaleRoleFootableFooindexDevFooregion',
          'DynamoDBAutoscaleRoleFootableDevFooregion',
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
          RoleARN: {
              'Fn::GetAtt': ['DynamoDBAutoscaleRoleFootableFooindexDevFooregion', 'Arn']
          },
          ScalableDimension: 'dynamodb:index:WriteCapacityUnits',
          ServiceNamespace: 'dynamodb'
      },
      Type: 'AWS::ApplicationAutoScaling::ScalableTarget'
  }
};

module.exports = cloudformation;
