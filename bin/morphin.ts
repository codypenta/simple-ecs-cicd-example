#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AssetStack } from '../lib/assets-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
const assetStack = new AssetStack(app, 'AssetStack');
const pipelineStack = new PipelineStack(app, 'PipelineStack');
