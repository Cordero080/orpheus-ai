import subprocess
import sys

def get_commit_data(commit_hash):
    """Gets the author, date, and message of a commit."""
    result = subprocess.run(
        ['git', 'show', '-s', '--format=%an%n%ad%n%B', commit_hash],
        capture_output=True, text=True, check=True
    )
    lines = result.stdout.splitlines()
    author = lines[0]
    date = lines[1]
    message = "\n".join(lines[2:])
    return author, date, message

def get_commit_diff(commit_hash):
    """Gets the diff of a commit."""
    # For the root commit, we need to use a different command
    parent_count = subprocess.run(
        ['git', 'rev-list', '--count', '--max-parents=0', commit_hash],
        capture_output=True, text=True, check=True
    ).stdout.strip()

    if parent_count == '1':
        result = subprocess.run(
            ['git', 'show', commit_hash],
            capture_output=True, text=True, check=True
        )
    else:
        result = subprocess.run(
            ['git', 'diff', f'{commit_hash}^!', commit_hash],
            capture_output=True, text=True, check=True
        )
    return result.stdout

def generate_new_message(original_message, diff):
    """
    (This is a placeholder for the AI to generate a new message.)
    For now, it returns a generic message.
    """
    # In a real scenario, you would call an LLM here.
    # This is just a simplified example.
    return f"feat: Refactor based on changes"

def main():
    commit_hash = sys.argv[1]
    original_message_bytes = sys.stdin.buffer.read()
    original_message = original_message_bytes.decode('utf-8')

    diff = get_commit_diff(commit_hash)

    # Here you would call your AI model to get a new message
    # For this example, we'll just prepend "New: " to the message
    new_message = generate_new_message(original_message, diff)

    sys.stdout.buffer.write(new_message.encode('utf-8'))

if __name__ == '__main__':
    main()
