#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { ExperimentAwsCdkStack } from '../lib/experiment-aws-cdk-stack';

const app = new cdk.App();
new ExperimentAwsCdkStack(app, 'ExperimentAwsCdkStack');