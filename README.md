# ⚡️ Serverless Plugin for DynamoDB Auto Scaling
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![npm][npm-image]][npm-url]
[![GitHub license][license-image]][license-url]
[![dependencies Status][dependencies-image]][dependencies-url]

Serverless Plugin to enable autoscaling for dynamodb tables and its GSI.

## Installation


```bash
# Via yarn
$ yarn add serverless-plugin-dynamo-autoscaling

# Via npm
$ npm install serverless-plugin-dynamo-autoscaling
```

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-dynamo-autoscaling
```

## Configuration


```yaml
custom:
  autoscaling:
    - table: CustomTable  # DynamoDB Resource
      index:              # List or single index name - Optional
        - custom-index-name
      roleArn:            # Arn of the role to be associated - Optional
      read:
        minimum: 5        # Minimum read capacity
        maximum: 1000     # Maximum read capacity
        targetUsage: 75   # Targeted usage percentage
      write:
        minimum: 40       # Minimum write capacity
        maximum: 200      # Maximum write capacity
        targetUsage: 50   # Targeted usage percentage
```

### Defaults

```yaml
maximum: 200
minimum: 5
targetUsage: 75
```

If no `roleArn` is specified, plugin will automatically create one and use it.

### Index Only

If you only want to enable Auto Scaling for the index, use `indexOnly: true` to skip Auto Scaling for the general DynamoDB table.


## DynamoDB

The example serverless configuration above works fine for a DynamoDB table CloudFormation resource like this:

```yaml
resources:
  Resources:
    CustomTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: custom-table
        AttributeDefinitions:
          - AttributeName: key
            AttributeType: S
        KeySchema:
          - AttributeName: key
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
        GlobalSecondaryIndexes:
          - IndexName: custom-index-name
            KeySchema:
              - AttributeName: key
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            ProvisionedThroughput:
              ReadCapacityUnits: 5
              WriteCapacityUnits: 5
```


## Thanks

- [Sebastian Müller](https://github.com/sbstjn) This repo is rewrite of Sebastian's [serverless plugin](https://github.com/sbstjn/serverless-dynamodb-autoscaling).


## License

Feel free to use the code, it's released using the [MIT license](LICENSE.md).

[npm-image]:https://img.shields.io/npm/v/serverless-plugin-dynamo-autoscaling.svg
[npm-url]:https://www.npmjs.com/package/serverless-plugin-dynamo-autoscaling
[license-image]:https://img.shields.io/github/license/ACloudGuru/serverless-plugin-dynamo-autoscaling.svg
[license-url]:https://github.com/ACloudGuru/serverless-plugin-dynamo-autoscaling/blob/master/LICENSE
[travis-image]: https://travis-ci.org/ACloudGuru/serverless-plugin-dynamo-autoscaling.svg?branch=master
[travis-url]: https://travis-ci.org/ACloudGuru/serverless-plugin-dynamo-autoscaling
[dependencies-image]:https://david-dm.org/ACloudGuru/serverless-plugin-dynamo-autoscaling/status.svg
[dependencies-url]:https://david-dm.org/ACloudGuru/serverless-plugin-dynamo-autoscaling
[coverage-image]:https://coveralls.io/repos/github/ACloudGuru/serverless-plugin-dynamo-autoscaling/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/ACloudGuru/serverless-plugin-dynamo-autoscaling?branch=master
