clean:

stage:
	@echo "====== Staging Repositories ======"
	cdk deploy AssetStack

prime:
	@echo "====== Priming The Line ======"
	