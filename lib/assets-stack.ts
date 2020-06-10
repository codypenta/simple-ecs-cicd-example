import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ecr from '@aws-cdk/aws-ecr';

export class AssetStack extends cdk.Stack {
    public readonly repo: codecommit.Repository
    public readonly imageRepo: ecr.Repository
    
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.repo = new codecommit.Repository(this, 'Repo', {
            repositoryName: 'MorphinTime',
            description: "Code repo holding morphin code"
        })

        this.imageRepo = new ecr.Repository(this, 'ImageRepo')

        new cdk.CfnOutput(this, 'Code Repo URI', { value: this.repo.repositoryCloneUrlHttp })
        new cdk.CfnOutput(this, 'Image Repo URI', { value: this.imageRepo.repositoryUri })
  }
}
