import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as pipelineactions from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecspatterns from '@aws-cdk/aws-ecs-patterns';
import * as path from 'path'

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ====================== Source ================================
    const repo = codecommit.Repository.fromRepositoryName(this, 'CodeRepo', 'MorphinTime')
    const imageRepo = ecr.Repository.fromRepositoryName(this, 'ImageRepo', 'asset-image-3x1istwbfihr')

    // ====================== Build =================================
    const builder = new codebuild.Project(this, 'BuilderBox', {
      source: codebuild.Source.codeCommit({ repository: repo }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
        privileged: true
      },
      environmentVariables: {
        'APP_REPOSITORY_URI': {
          value: imageRepo.repositoryUri
        }
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('lib/buildspec.yml')
    })

    imageRepo.grantPullPush(builder)

    // ====================== Pipeline ===============================================
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline')
    pipeline.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role'))

    const outputSource = new codepipeline.Artifact('OutputSource')
    const outputDockerBuild = new codepipeline.Artifact('OutputDockerBuild')

    // ====================== Link Source and Build ==================================
    const sourceStage = pipeline.addStage({
      stageName: 'Source',
      actions: [
        new pipelineactions.CodeCommitSourceAction({
          actionName: 'CodeCommit',
          repository: repo,
          output: outputSource
        })
      ]
    })

    const buildStage = pipeline.addStage({
      stageName: 'Build',
      actions: [
        new pipelineactions.CodeBuildAction({
          actionName: 'DockerBuild',
          project: builder,
          input: outputSource,
          outputs: [outputDockerBuild]
        })
      ]
    })

    // ====================== Link Service and Deploy ==================================
    const service = new ecspatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: new ecs.Cluster(this, 'Cluster'),
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(imageRepo),
      }
    })

    const deployStage = pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new pipelineactions.EcsDeployAction({
          actionName: 'DeployContainer',
          service: service.service,
          // input: outputDockerBuild,
          imageFile: new codepipeline.ArtifactPath(outputDockerBuild, 'imagedefinition.json')
        })
      ]
    })
  }
}
