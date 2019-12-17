import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');

export default class HostingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostingBucket = new s3.Bucket(this, 'web-hosting', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html'
    });
    hostingBucket.grantPublicAccess('*', 's3:GetObject');
  }
}
