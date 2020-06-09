#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MorphinStack } from '../lib/morphin-stack';

const app = new cdk.App();
new MorphinStack(app, 'MorphinStack');
