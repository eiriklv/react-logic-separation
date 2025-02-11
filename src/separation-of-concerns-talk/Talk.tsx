/* eslint-disable @typescript-eslint/no-unused-vars */
import { RemindersFeature as Step1 } from "./1-naive-approach-with-no-tests-for-container";
import { RemindersFeature as Step3 } from "./3-introduce-bug-in-caching-strategy";
import { RemindersFeature as Step4 } from "./4-create-custom-hooks-with-business-logic";
import { RemindersFeature as Step5 } from "./5-add-unit-tests-to-view-and-custom-hooks";
import { RemindersFeature as Step6 } from "./6-moving-business-logic-into-separate-model";
import { RemindersFeature as Step7 } from "./7-add-tests-to-expose-our-caching-strategy-bug";
import { RemindersFeature as Step8 } from "./8-fix-the-caching-strategy-bug";
import { RemindersFeature as Step9 } from "./9-dependency-injection-via-context-to-avoid-filesystem-mocking";
import { RemindersFeature as Step10 } from "./10-introduce-view-model-to-map-between-domain-models-and-view";
import { RemindersFeature as Step11 } from "./11-show-that-we-can-implement-business-logic-using-signals";

import "../App.css";

function Talk() {
  return <Step1 />;
}

export default Talk;
