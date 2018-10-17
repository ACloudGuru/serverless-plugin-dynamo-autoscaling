# serverless-dynamodb-autoscaling

# ⚡️ Serverless Plugin for DynamoDB Auto Scaling with Cloudformation

With this plugin for [serverless](https://serverless.com), you can enable DynamoDB Auto Scaling for tables and **Global Secondary Indexes** easily in your `serverless.yml` configuration file. The plugin supports multiple tables and indexes, as well as separate configuration for `read` and `write` capacities using Amazon's [native DynamoDB Auto Scaling](https://aws.amazon.com/blogs/aws/new-auto-scaling-for-amazon-dynamodb/).

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
