#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HostingStack } from '../lib/hosting-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const env = { region: 'us-west-2' };

const hosting = new HostingStack(app, 'EcSiteHostingStack', { env });

new PipelineStack(app, 'EcSitePipelineStack', {
  env,
  siteBucket: hosting.siteBucket,
  distribution: hosting.distribution,
});
