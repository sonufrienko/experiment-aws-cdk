import cdk = require('@aws-cdk/core');
import { Duration } from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

const SSH_KEY_NAME = 'my-eu-west-1';

export default class VpcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    /**
     * VPC
     */
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


    /**
     * Security Group
     */
    const webSecurityGroup = new ec2.SecurityGroup(this, 'WebSG', {
      vpc,
      description: 'Allow public access',
      allowAllOutbound: true
    });

    webSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow http');
    webSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow https');
    webSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH');


    /**
     * Use Ubuntu AMI
     * Ubuntu Server 18.04 LTS (HVM), SSD Volume Type
     */
    const ubuntuAmi = new ec2.GenericLinuxImage({
      'eu-west-1': 'ami-02df9ea15c1778c9c',
      'us-east-1': 'ami-04b9e92b5572fa0d1'
    });
    

    /**
     * Auto Scaling Group
     */
    const asg = new autoscaling.AutoScalingGroup(this, 'WebASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.NANO),
      machineImage: ubuntuAmi,
      minCapacity: 2,
      maxCapacity: 6,
      cooldown: Duration.seconds(360),
      vpcSubnets: { subnetGroupName: 'Web' },
      keyName: SSH_KEY_NAME
    });

    // Scale policy
    asg.scaleOnCpuUtilization('CPU70', {
      targetUtilizationPercent: 70,
      estimatedInstanceWarmup: Duration.seconds(60)
    });

    // Attach Security Group to Auto Scale Group
    asg.addSecurityGroup(webSecurityGroup);
    
    // EC2 bootstrap script - install NGINX
    asg.addUserData('sudo apt update; sudo apt install nginx-light -y');


    /**
     * Application Load Balancer
     */
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: vpc,
      vpcSubnets: { subnetGroupName: 'Web' },
      internetFacing: true
    });

    const listener = alb.addListener('WebListeners', {
      port: 80,
      open: true,
    });
  
    listener.addTargets('ApplicationFleet', {
      port: 80,
      targets: [asg]
    });

    // Create new Security Group to ALB
    listener.connections.allowFromAnyIpv4(ec2.Port.tcp(80), 'Allow inbound HTTP');
  }
}
