# Experiment with AWS CDK TypeScript

I will use TypeScript to create a cloud infrastructure with AWS Cloud Development Kit (AWS CDK).


## AWS Profile

You can use default profile from AWS config file `~/.aws/config` or set it explicitly by adding `--profile=sg-profile`


## How to deploy

```bash
npm run build
cdk synth
cdk deploy
```


## How to create a new project

```bash
cd experiment-aws-cdk
cdk init sample-app --language=typescript # Example CDK Application with some constructs
```


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
