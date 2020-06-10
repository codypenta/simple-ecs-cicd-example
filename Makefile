clean:

stage:
	@echo "====== Staging Repositories ======"
	cdk deploy AssetStack

configure:
	@echo "====== Configuring Git and ECR ======"
	git config --global credential.helper 'cache --timeout=3600'

troubleshoot-pipeline:
	@echo "====== Troubleshooting Pipeline and Buildspec ======"
	git add .
	git commit -m "troubleshooting pipeline and buildspec file"
	git push

prime:
	@echo "====== Priming The Line ======"
	git add .
	git commit -m "initial commit"
	# git remote add origin https://git-codecommit.us-east-1.amazonaws.com/v1/repos/MorphinTime
	# git push -u origin master
	# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account id>.dkr.ecr.us-east-1.amazonaws.com
	# docker build lib/service/ -t <account id>.dkr.ecr.us-east-1.amazonaws.com/asset-image-3x1istwbfihr:latest
	# docker push <account id>.dkr.ecr.us-east-1.amazonaws.com/asset-image-3x1istwbfihr:latest

make deploy:
	@echo "====== Deploying the Pipeline Infrastructure and Fargate Service ======"
	cdk deploy PipelineStack

