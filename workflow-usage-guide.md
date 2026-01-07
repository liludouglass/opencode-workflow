# How to Use the New Workflow

1. **Start a new project:**
   ```
   /plan-product     # Creates product docs + memory structure
   ```

2. **Create a master spec (optional but recommended):**
   - Write master-spec.md with your requirements
   - Coverage will be auto-tracked

3. **Start a feature:**
   ```
   /feature Add user authentication
   ```

4. **The enhanced workflow will:**
   - Check master spec for relevant sections
   - Create deferred tickets for out-of-scope items
   - Generate tickets instead of tasks.md
   - Track coverage in master-spec-coverage.md
   - Alert on deferred items when their target feature starts

5. **Check status anytime:**
   ```
   tk ready          # What can I work on?
   tk blocked        # What's waiting?
   tk dep tree       # See dependencies
   ```