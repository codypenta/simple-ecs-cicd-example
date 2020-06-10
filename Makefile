clean:

stage:
	@echo "====== Staging Repositories ======"
	cdk deploy AssetStack

prime:
	@echo "====== Priming The Line ======"
	git add .
	git commit -m "initial commit"
	# git remote add origin https://git-codecommit.us-east-1.amazonaws.com/v1/repos/MorphinTime
	# git push -u origin master
	# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 728666980118.dkr.ecr.us-east-1.amazonaws.com
	# docker build lib/service/ -t 728666980118.dkr.ecr.us-east-1.amazonaws.com/asset-image-3x1istwbfihr:latest
	# docker push 728666980118.dkr.ecr.us-east-1.amazonaws.com/asset-image-3x1istwbfihr:latest

make deploy:
	@echo "====== Deploying the Pipeline Infrastructure and Fargate Service ======"
	cdk deploy PipelineStack

