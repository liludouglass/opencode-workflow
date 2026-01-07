---
name: wf-orchestrate
description: Orchestrate spec implementation with dedicated agents per task group
---

# Process for Orchestrating a Spec's Implementation

Now that we have a spec and tasks list ready for implementation, we will proceed with orchestrating implementation of each task group by a dedicated agent using the following MULTI-PHASE process.

Follow each of these phases and their individual workflows IN SEQUENCE:

## Multi-Phase Process

### FIRST: Get tickets for this spec

IF you already know which spec we're working on, query its tickets using `tk ready` to see what's available for implementation, then skip to the NEXT phase.

IF you don't already know which spec we're working on or IF no tickets exist yet, THEN output the following request to the user:

```
Please point me to a spec that you want to orchestrate implementation for.

If you don't have tickets yet, then run any of these commands first:
/skill wf-initialize-spec
/skill wf-write-spec
/skill wf-create-tasks

Once tickets are created, use `tk ready` to see available tickets.
```

### NEXT: Create orchestration.yml to serve as a roadmap for orchestration of task groups

In this spec's folder, create this file: `.opencode/spec/[this-spec]/orchestration.yml`.

Run `tk ready` to get available tickets, then populate this file with ticket IDs grouped by their task group. Use this EXACT structure for the content of `orchestration.yml`:

```yaml
task_groups:
  - name: [task-group-name]
    tickets: [ticket-id-1, ticket-id-2]
  - name: [task-group-name]
    tickets: [ticket-id-3]
  - name: [task-group-name]
    tickets: [ticket-id-4, ticket-id-5, ticket-id-6]
  # Repeat for each task group returned by `tk ready`
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
    tickets: [ticket-id-1, ticket-id-2]
    subagent: [subagent-name]
  - name: [task-group-name]
    tickets: [ticket-id-3]
    subagent: [subagent-name]
  - name: [task-group-name]
    tickets: [ticket-id-4, ticket-id-5]
    subagent: [subagent-name]
  # Repeat for each task group returned by `tk ready`
```

For example, after this step, the `orchestration.yml` file might look like this (exact names will vary):

```yaml
task_groups:
  - name: authentication-system
    tickets: [TK-001, TK-002]
    subagent: backend-specialist
  - name: user-dashboard
    tickets: [TK-003, TK-004, TK-005]
    subagent: frontend-specialist
  - name: api-endpoints
    tickets: [TK-006]
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
    tickets: [ticket-id-1, ticket-id-2]
    standards:
      - [users' 1st response for this task group]
      - [users' 2nd response for this task group]
      - [users' 3rd response for this task group]
      # Repeat for all standards that the user specified for this task group
  - name: [task-group-name]
    tickets: [ticket-id-3]
    standards:
      - [users' 1st response for this task group]
      - [users' 2nd response for this task group]
      # Repeat for all standards that the user specified for this task group
  # Repeat for each task group returned by `tk ready`
```

For example, after this step, the `orchestration.yml` file might look like this (exact names will vary):

```yaml
task_groups:
  - name: authentication-system
    tickets: [TK-001, TK-002]
    standards:
      - all
  - name: user-dashboard
    tickets: [TK-003, TK-004, TK-005]
    standards:
      - global/*
      - frontend/*
  - name: task-group-with-no-standards
    tickets: [TK-007]
  - name: api-endpoints
    tickets: [TK-006]
    standards:
      - backend/*
      - global/*
```

Note: If subagents are enabled, the final `orchestration.yml` would include BOTH `subagent` assignments AND `standards` for each task group.

### NEXT: Delegate task groups implementations to assigned subagents

Loop through each task group's tickets via `tk ready` and delegate implementation to the assigned subagent specified in `orchestration.yml`.

For each delegation, provide the subagent with:
- The ticket IDs for this task group (from `orchestration.yml`)
- The spec file: `.opencode/spec/[this-spec]/spec.md`
- Instruct subagent to:
  - Load the implementation workflow: `/skill wf-implement-tasks`
  - Perform their implementation
  - Close completed tickets using `tk close <id>`

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

**Tickets:** [ticket-id-1, ticket-id-2, ...]
Use `tk show <id>` to view each ticket's details.

**Spec:** Read `.opencode/spec/[this-spec]/spec.md`

**Standards:** Load the following before implementing:
[List of /skill std-* commands]

**Workflow:** Load `/skill wf-implement-tasks` for implementation guidance.

**When complete:** Close tickets using `tk close <id>` for each completed ticket.
```

Provide all of the above to the subagent when delegating tasks for it to implement.

### FINAL: Verify All Task Groups Complete

After all subagents have completed their work:

1. Run `tk query --status=closed` to verify all tickets have been closed
2. Run `tk ready` to confirm no pending tickets remain
3. Run any integration tests if applicable
4. Report completion status to the user

```
Implementation orchestration complete!

✅ Task Group 1: [name] - Completed by @[subagent] (TK-001, TK-002 closed)
✅ Task Group 2: [name] - Completed by @[subagent] (TK-003, TK-004, TK-005 closed)
✅ Task Group 3: [name] - Completed by @[subagent] (TK-006 closed)

All tickets have been implemented and closed according to spec.
```
