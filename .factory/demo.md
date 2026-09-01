# Demo sandbox

Open <https://self-study-checkpoints.sociobot.in/demo> or use `/demo` locally.

The demo starts with Maya Chen’s eight-week finite-groups checkpoint. It includes two linked problems, a four-part rubric, a named reviewer, and one draft evidence link. The yellow banner remains visible while the sample is active.

Demo state lives only in page memory. It does not read or write the real `self-study-checkpoints:v1` local-storage key and creates no `demo:` keys. “Reset demo” restores the bundled sample. “Start for real” returns to the separate real workspace, and leaving or reloading the demo discards changes.

When a review link is copied from the sample, it stays under `/demo?review=…` so both sides of the example review remain inside the isolated demo namespace.
