import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface PipelineStackProps extends cdk.StackProps {
  siteBucket: s3.IBucket;
  distribution: cloudfront.IDistribution;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { siteBucket, distribution } = props;

    const repo = codecommit.Repository.fromRepositoryName(
      this,
      'SourceRepo',
      'workshop-repo',
    );

    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 20,
            },
            commands: ['cd kiro-ws-ec-site', 'npm ci'],
          },
          build: {
            commands: ['npm run build'],
          },
          post_build: {
            commands: [
              `aws s3 sync dist/ s3://${siteBucket.bucketName}/ --delete`,
              `aws cloudfront create-invalidation --distribution-id ${distribution.distributionId} --paths "/*"`,
            ],
          },
        },
        artifacts: {
          'base-directory': 'kiro-ws-ec-site/dist',
          files: ['**/*'],
        },
      }),
    });

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:DeleteObject', 's3:ListBucket'],
        resources: [siteBucket.bucketArn, `${siteBucket.bucketArn}/*`],
      }),
    );

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      }),
    );

    const sourceOutput = new codepipeline.Artifact('SourceOutput');
    const buildOutput = new codepipeline.Artifact('BuildOutput');

    new codepipeline.Pipeline(this, 'DeployPipeline', {
      pipelineName: 'ec-site-deploy',
      pipelineType: codepipeline.PipelineType.V2,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: repo,
              branch: 'main',
              output: sourceOutput,
              codeBuildCloneOutput: true,
            }),
          ],
        },
        {
          stageName: 'BuildAndDeploy',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build_and_Deploy',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
      ],
    });
  }
}
