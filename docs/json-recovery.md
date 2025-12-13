# Conversation Recovery Method

## The Problem

Pneuma's memory depends on `data/conversations.json`, but this file contains private conversations that shouldn't be tracked on GitHub. The file is gitignored (`data/*.json`), which means:

- Private conversations stay private
- But if the file gets lost/corrupted, Pneuma loses all memory

## The Solution: Snapshot Backups

We periodically force-commit the conversations file despite the gitignore. This creates a recoverable snapshot in git history without continuously tracking every change.

### How It Works

1. **Gitignore is always active** — `data/*.json` is ignored by default
2. **Force-add when you want a backup** — `git add -f` overrides the gitignore once
3. **Commit and push** — the snapshot is now in git history on GitHub
4. **Recover anytime** — pull that specific commit's version of the file

### Commands

#### Create a Backup

```bash
git add -f data/conversations.json data/vector_memory.json
git commit -m "Backup memory files - $(date +%b\ %d)"
git push
```

#### Recover from Backup

First, find the commit hash:

```bash
git log --oneline -- data/conversations.json
```

Then restore:

```bash
git show <commit-hash>:data/conversations.json > data/conversations.json
git show <commit-hash>:data/vector_memory.json > data/vector_memory.json
```

Example:

```bash
git show 7299a3b:data/conversations.json > data/conversations.json
```

### Current Backup Commits

| Date         | Commit    | Notes                                        |
| ------------ | --------- | -------------------------------------------- |
| Dec 11, 2025 | `7299a3b` | Latest backup with full conversation history |
| Dec 11, 2025 | `25f2685` | Time Machine recovery backup                 |

### Why This Works

- **Privacy**: Conversations aren't continuously tracked — only snapshots exist
- **Recovery**: Git history preserves the file even though it's gitignored
- **Control**: You decide when to take snapshots (after important conversations)
- **Remote backup**: Pushed to GitHub, so it survives local disasters

### Best Practices

1. **Backup after meaningful conversations** — especially philosophical ones Pneuma should remember
2. **Use dated commit messages** — makes it easy to find the right backup
3. **Don't push sensitive content** — even in snapshots, remember this goes to GitHub
4. **Keep this doc updated** — add new backup commits to the table above

### Emergency Recovery

If you lose conversations.json and don't remember the commit hash:

```bash
# List all commits that touched conversations.json
git log --all --oneline -- data/conversations.json

# Pick the most recent one and restore
git show <hash>:data/conversations.json > data/conversations.json
```

If the file was never committed (new machine, fresh clone):

- Check Time Machine backups
- The file starts empty and rebuilds through new conversations
