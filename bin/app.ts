#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import HostingStack from '../lib/hosting-stack';
import VpcStack from '../lib/vpc-stack';

const app = new cdk.App();
new HostingStack(app, 'HostingStack', { env: { 'region': 'eu-west-1' } });
new VpcStack(app, 'VpcStack', { env: { 'region': 'eu-west-1' } });