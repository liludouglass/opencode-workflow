---
name: wf-orchestrate
description: Orchestrate spec implementation with dedicated agents per task group
---

# Process for Orchestrating a Spec's Implementation

Now that we have a spec and tasks list ready for implementation, we will proceed with orchestrating implementation of each task group by a dedicated agent using the following MULTI-PHASE process.

Follow each of these phases and their individual workflows IN SEQUENCE:

## Multi-Phase Process

### FIRST: Get tasks.md for this spec

IF you already know which spec we're working on and IF that spec folder has a `tasks.md` file, then use that and skip to the NEXT phase.

IF you don't already know which spec we're working on and IF that spec folder doesn't yet have a `tasks.md` THEN output the following request to the user:

```
Please point me to a spec's `tasks.md` that you want to orchestrate implementation for.

If you don't have one yet, then run any of these commands first:
/skill wf-initialize-spec
/skill wf-write-spec
/skill wf-create-tasks
```

### NEXT: Create orchestration.yml to serve as a roadmap for orchestration of task groups

In this spec's folder, create this file: `.opencode/spec/[this-spec]/orchestration.yml`.

Populate this file with with the names of each task group found in this spec's `tasks.md` and use this EXACT structure for the content of `orchestration.yml`:

```yaml
task_groups:
  - name: [task-group-name]
  - name: [task-group-name]
  - name: [task-group-name]
  # Repeat for each task group found in tasks.md
```

### NEXT: Ask user to assign subagents to each task group

Next we must determine which subagents should be assigned to which task groups.  Ask the user to provide this info using the following request to user and WAIT for user's response:

```
Please specify the name of each subagent to be assigned to each task group:

1. [task-group-name]
2. [task-group-name]
3. [task-group-name]
[repeat for each task-group you've added to orchestration.yml]

Simply respond with the subagent names and corresponding task group number and I'll update orchestration.yml accordingly.
```

Using the user's responses, update `orchestration.yml` to specify those subagent names.  `orchestration.yml` should end up looking like this:

```yaml
task_groups:
  - name: [task-group-name]
    subagent: [subagent-name]
  - name: [task-group-name]
    subagent: [subagent-name]
  - name: [task-group-name]
    subagent: [subagent-name]
  # Repeat for each task group found in tasks.md
```

For example, after this step, the `orchestration.yml` file might look like this (exact names will vary):

```yaml
task_groups:
  - name: authentication-system
    subagent: backend-specialist
  - name: user-dashboard
    subagent: frontend-specialist
  - name: api-endpoints
    subagent: backend-specialist
```

### NEXT: Ask user to assign standards to each task group

Next we must determine which standards should guide the implementation of each task group.  Ask the user to provide this info using the following request to user and WAIT for user's response:

```
Please specify the standard(s) that should be used to guide the implementation of each task group:

1. [task-group-name]
2. [task-group-name]
3. [task-group-name]
[repeat for each task-group you've added to orchestration.yml]

For each task group number, you can specify any combination of the following:

"all" to include all of your standards
"global/*" to include all global standards
"frontend/*" to include all frontend standards
"backend/*" to include all backend standards
"none" to include no standards for this task group.
```

Using the user's responses, update `orchestration.yml` to specify those standards for each task group.  `orchestration.yml` should end up having AT LEAST the following information added to it:

```yaml
task_groups:
  - name: [task-group-name]
    standards:
      - [users' 1st response for this task group]
      - [users' 2nd response for this task group]
      - [users' 3rd response for this task group]
      # Repeat for all standards that the user specified for this task group
  - name: [task-group-name]
    standards:
      - [users' 1st response for this task group]
      - [users' 2nd response for this task group]
      # Repeat for all standards that the user specified for this task group
  # Repeat for each task group found in tasks.md
```

For example, after this step, the `orchestration.yml` file might look like this (exact names will vary):

```yaml
task_groups:
  - name: authentication-system
    standards:
      - all
  - name: user-dashboard
    standards:
      - global/*
      - frontend/*
  - name: task-group-with-no-standards
  - name: api-endpoints
    standards:
      - backend/*
      - global/*
```

Note: If subagents are enabled, the final `orchestration.yml` would include BOTH `subagent` assignments AND `standards` for each task group.

### NEXT: Delegate task groups implementations to assigned subagents

Loop through each task group in `.opencode/spec/[this-spec]/tasks.md` and delegate its implementation to the assigned subagent specified in `orchestration.yml`.

For each delegation, provide the subagent with:
- The task group (including the parent task and all sub-tasks)
- The spec file: `.opencode/spec/[this-spec]/spec.md`
- Instruct subagent to:
  - Load the implementation workflow: `/skill wf-implement-tasks`
  - Perform their implementation
  - Check off the task and sub-task(s) in `.opencode/spec/[this-spec]/tasks.md`

In addition to the above items, also instruct the subagent to closely adhere to the user's standards & preferences. To build the list of standards to give to the subagent, follow these instructions:

#### Compile Implementation Standards

Use the following logic to compile a list of `/skill std-*` commands that should guide implementation:

##### Steps to Compile Standards List

1. Find the current task group in `orchestration.yml`
2. Check the list of `standards` specified for this task group in `orchestration.yml`
3. Compile the list of `/skill std-*` commands to load, using this logic:
   a. If the value for `standards` is simply `all`, then instruct the subagent to load all available standards skills.
   b. If the item under standards ends with "*" then it means all standards in that category should be loaded. For example, `frontend/*` means load `/skill std-frontend`.
   c. If a specific standard is mentioned, map it to the appropriate `/skill std-*` command.
   d. De-duplicate the list of skill commands.

##### Output Format

The compiled list of standards should look something like this:

```
Load the following standards before implementing:
/skill std-global
/skill std-backend
/skill std-frontend
```

#### Delegate Using @mention Syntax

To delegate to a subagent in OpenCode, use the @mention syntax:

```
@[subagent-name] Please implement the following task group:

**Task Group:** [task-group-name]

**Tasks:**
[Copy the task group content from tasks.md]

**Spec:** Read `.opencode/spec/[this-spec]/spec.md`

**Standards:** Load the following before implementing:
[List of /skill std-* commands]

**Workflow:** Load `/skill wf-implement-tasks` for implementation guidance.

**When complete:** Mark tasks as done in `.opencode/spec/[this-spec]/tasks.md`
```

Provide all of the above to the subagent when delegating tasks for it to implement.

### FINAL: Verify All Task Groups Complete

After all subagents have completed their work:

1. Review `.opencode/spec/[this-spec]/tasks.md` to verify all tasks are checked off
2. Run any integration tests if applicable
3. Report completion status to the user

```
Implementation orchestration complete!

✅ Task Group 1: [name] - Completed by @[subagent]
✅ Task Group 2: [name] - Completed by @[subagent]
✅ Task Group 3: [name] - Completed by @[subagent]

All tasks have been implemented according to spec.
```
