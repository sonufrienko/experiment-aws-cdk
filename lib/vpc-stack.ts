import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

export default class VpcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'Web',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        }, {
          name: 'Application',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 24
        }
      ]
    });

    const webSecurityGroup = new ec2.SecurityGroup(this, 'WebSG', {
      vpc,
      description: 'Allow http(s) traffic',
      allowAllOutbound: true
    });

    webSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow http');
    webSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow https');
  }
}
