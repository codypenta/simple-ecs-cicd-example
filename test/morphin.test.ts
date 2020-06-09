import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Morphin from '../lib/morphin-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Morphin.MorphinStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
