# Control Validation

This document records adversarial and negative tests used to verify that repository security controls are enforced as intended.

The general validation process is:

1. Define the expected security behavior.
2. Attempt a controlled violation or bypass.
3. Observe the enforcement result.
4. Record the evidence.
5. Restore the repository to a clean state.

Only synthetic, non-sensitive test data is used for negative testing.

---

## CV-001 — Direct Push Protection

**Control:** Changes to `main` must be made through a pull request.

**Expected result:**  
A direct push to the protected `main` branch is rejected by GitHub.

**Test procedure:**

1. Created a harmless test commit directly on local `main`.
2. Attempted to push the commit directly to `origin/main`.

**Observed result:**

GitHub rejected the push with repository rule enforcement:

    GH013: Repository rule violations found for refs/heads/main.
    Changes must be made through a pull request.

**Result:** `PASS`

**Security conclusion:**  
The repository ruleset prevents developers from bypassing the pull-request workflow by directly pushing changes to `main`.

**Cleanup:**  
The local test commit was removed and local `main` was restored to match `origin/main`.

---

## CV-002 — Repository Hygiene Enforcement

**Control:** Prohibited sensitive-file types tracked by Git must fail the required Repository Hygiene check.

**Expected result:**  
A pull request containing a prohibited tracked file fails the required CI check and cannot satisfy the requirements for merging into `main`.

**Test procedure:**

1. Created the synthetic file `fake-test-key.pem`.
2. Confirmed that `.gitignore` normally ignored the file.
3. Deliberately bypassed `.gitignore` using `git add -f fake-test-key.pem`.
4. Committed the synthetic file on the controlled test branch.
5. Opened a pull request targeting `main`.

The file contained only non-secret test data.

**Observed result:**

The required check reported:

    CI Baseline / Repository Hygiene — FAILURE

GitHub reported the pull request as:

    mergeable = MERGEABLE
    mergeStateStatus = BLOCKED

`MERGEABLE` indicated that Git detected no merge conflict. `BLOCKED` indicated that GitHub policy prevented the pull request from satisfying the requirements for merge because a required security check failed.

**Result:** `PASS`

**Security conclusion:**  
`.gitignore` is a developer convenience, not a security boundary. A developer can deliberately force an ignored file into Git, but the independent CI control detects the prohibited tracked file and prevents the change from satisfying the protected-branch requirements.

**Cleanup:**  
The controlled test pull request was closed without merging and its test branch was deleted.
---

## CV-003 — Secret Content Detection

**Control:** Pull requests must pass content-aware secret scanning before they can be merged into `main`.

**Expected result:**  
A pull request containing the project's synthetic secret pattern causes the required Secret Scan check to fail and cannot satisfy the protected-branch merge requirements.

**Test procedure:**

1. Created a normal text file:

   `fixtures/secret-scan-negative-test.txt`

2. Added the synthetic test pattern:

   `LAB_SECRET_0123456789ABCDEF0123456789ABCDEF`

3. Committed the file on the controlled test branch.
4. Opened a pull request targeting `main`.

The value was synthetic and was not a real credential for any provider or service.

**Observed result:**

Gitleaks detected the synthetic pattern using:

`RuleID: lab-synthetic-secret`

The pull request checks reported:

- `Repository Hygiene` — SUCCESS
- `Secret Scan` — FAILURE

GitHub reported:

- `mergeable = MERGEABLE`
- `mergeStateStatus = BLOCKED`

**Result:** `PASS`

**Security conclusion:**  
The content-aware scanning control detects prohibited secret-like content independently of the filename or file extension. Because Secret Scan is a required status check, detection prevents the pull request from satisfying the protected-branch merge requirements.

**Cleanup:**  
The controlled test pull request was closed without merging and its test branch was deleted.

---

## Validated Controls

| ID | Control | Expected | Result |
| --- | --- | --- | --- |
| CV-001 | Direct Push Protection | Direct push to `main` is rejected | PASS |
| CV-002 | Repository Hygiene Enforcement | Prohibited tracked file causes required CI failure and blocks compliant merge | PASS |
| CV-003 | Secret Content Detection | Synthetic secret content causes required secret scan failure and blocks compliant merge | PASS |
