# ⚡️ Serverless Plugin for DynamoDB Auto Scaling
[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/ACloudGuru/serverless-plugin-dynamodb-autoscaling/badge.svg?branch=master)](https://coveralls.io/github/ACloudGuru/serverless-plugin-dynamodb-autoscaling?branch=master)

Serverless Plugin to enable autoscaling for dynamodb tables and its GSI.

## Installation


```bash
# Via yarn
$ yarn add serverless-plugin-dynamodb-autoscaling

# Via npm
$ npm install serverless-plugin-dynamodb-autoscaling
```

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-dynamodb-autoscaling
```

## Configuration


```yaml
custom:
  autoscaling:
    - table: CustomTable  # DynamoDB Resource 
      index:              # List or single index name - Optional
        - custom-index-name
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

[travis-image]: https://travis-ci.org/ACloudGuru/serverless-plugin-dynamodb-autoscaling.svg?branch=master
[travis-url]: https://travis-ci.org/ACloudGuru/serverless-plugin-dynamodb-autoscaling
