import re

def get_commit_type(original_message, file_changes):
    """Determine the commit type based on the original message and file changes."""
    original_message_lower = original_message.lower()
    
    if re.search(r'\b(fix|bug|correct|repair)\b', original_message_lower):
        return 'fix'
    if re.search(r'\b(feat|feature|add|implement)\b', original_message_lower):
        return 'feat'
    if re.search(r'\b(refactor|restructure|rewrite)\b', original_message_lower):
        return 'refactor'
    if any(f.endswith('.md') for f in file_changes):
        return 'docs'
    if any(f.endswith(('.css', '.scss', '.less')) or 'style' in f for f in file_changes):
        return 'style'
    if any(f in ['package.json', 'Makefile', 'vite.config.js', 'eslint.config.js'] for f in file_changes):
        return 'chore'
    if re.search(r'\b(test|spec)\b', original_message_lower):
        return 'test'
    
    # Default types based on file changes
    if any(f.startswith('client/') for f in file_changes):
        return 'feat'
    if any(f.startswith('server/') for f in file_changes):
        return 'refactor'
        
    return 'chore' # Default fallback

def rewrite_message(commit):
    """Callback to rewrite the commit message."""
    original_message = commit.message.decode('utf-8', 'replace')
    
    # Extract file paths from file_changes
    file_changes = [
        item.filename.decode('utf-8', 'replace')
        for item in commit.file_changes
    ]

    commit_type = get_commit_type(original_message, file_changes)
    
    # Create a new concise message from the first line of the original message
    first_line = original_message.splitlines()[0].strip()
    # Remove existing conventional commit prefixes if any
    first_line = re.sub(r'^\w+(\(.+\))?:\s*', '', first_line)
    
    new_message = f"{commit_type}: {first_line}"
    
    # Truncate if too long
    if len(new_message) > 72:
        new_message = new_message[:69] + '...'

    commit.message = new_message.encode('utf-8')
