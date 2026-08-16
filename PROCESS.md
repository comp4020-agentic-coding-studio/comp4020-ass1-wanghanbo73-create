# Process overview

## What I built

I built **“90% Full Is Almost Broken”**, a single-page interactive explainer showing how waiting time grows non-linearly as a system approaches full utilisation. The visitor changes one utilisation slider from 10% to 99%, while the queue, estimated waiting time, spare capacity, and chart update together. I deliberately kept the prototype to one mechanic rather than adding multiple examples or controls, because I wanted the interaction itself to carry the explanation.

## The moments that mattered

### 1. Making the model the source of truth

For the first working prototype, I chose not to hard-code example wait times separately into the interface and chart. Instead, I separated the queueing model into `queue-model.ts` and made the UI and tests depend on the same functions ([`4e63f1e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-wanghanbo73-create/commit/4e63f1e)). This gave the interaction one source of truth and reduced the risk that displayed values, the curve, and tests would drift apart. Before accepting the version, I checked the slider across its range, operated it with the keyboard, viewed it at desktop and phone widths, and ran the automated checks. The contrast I wanted was visible in both the values and the visualisation: moving from 50% to 70% changed the wait only slightly, while 90% to 98% caused a much larger increase.

### 2. Correct mathematics was not enough

Browser verification exposed something the automated tests did not. At low utilisation, the queue could appear as a single blue dot floating inside a card, and the chart showed the correct curve without enough visual context to explain what it meant. The obvious response would have been to ask Claude to make those two elements clearer. Instead, I changed the harness by adding visual-explanation rules to `CLAUDE.md` ([`25270ee`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-wanghanbo73-create/commit/25270ee)). The new rules required abstract visuals to explain themselves, required minimal chart context, and prevented communication problems from being solved by adding more controls. The resulting iteration added clearer queue semantics, a service endpoint, chart context, near-capacity shading, and overload colour feedback ([`25270ee...9a1f1a7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-wanghanbo73-create/compare/25270ee...9a1f1a7)). I checked ordinary and near-capacity states again at both marking viewports before accepting it.

### 3. Showing the result was still not explaining the cause

The second version clearly showed that waiting time became extreme near 100%, but it still mainly communicated **what** happened rather than **why**. I did not add a paragraph or second slider. Instead, I added another harness rule requiring the interface to show causes where possible and to make directional process visuals natural ([`28859ed`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-wanghanbo73-create/commit/28859ed)). The next implementation added derived spare capacity, changed the queue to read as people moving toward service, and clarified the chart's near-capacity region ([`28859ed...3a20fc1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-wanghanbo73-create/compare/28859ed...3a20fc1)). This kept the same single interaction while making the mechanism clearer: 98% utilisation now also means only 2% spare capacity.

The final `pnpm check` passed all 33 tests, and I rechecked responsive and keyboard behaviour before treating the prototype as finished.
