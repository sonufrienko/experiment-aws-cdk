#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import HostingStack from '../lib/hosting-stack';
import VpcStack from '../lib/vpc-stack';

const app = new cdk.App();
new HostingStack(app, 'HostingStack');
new VpcStack(app, 'VpcStack');