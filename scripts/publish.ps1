param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$MessageParts
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$message = ($MessageParts -join ' ').Trim()

if (-not $message) {
  Write-Error 'Commit message is required. Example: npm run publish -- "Add new post"'
}

$insideRepo = git rev-parse --is-inside-work-tree
if ($insideRepo -ne 'true') {
  Write-Error 'This script must be run inside the web git repository.'
}

$branch = (git branch --show-current).Trim()
if (-not $branch) {
  Write-Error 'Cannot publish from a detached HEAD state. Please switch to a branch first.'
}

Write-Host "Building site before publishing..."
npm run build

$changes = git status --porcelain
if (-not $changes) {
  Write-Host 'No changes to commit. The site is already up to date.'
  exit 0
}

Write-Host 'Staging changes...'
git add -A

$stagedFiles = git diff --cached --name-only
if (-not $stagedFiles) {
  Write-Host 'No staged changes to commit.'
  exit 0
}

Write-Host "Creating commit on $branch..."
git commit -m $message

Write-Host "Pushing to origin/$branch..."
git push origin $branch

Write-Host 'Publish complete. GitHub Pages deployment will start from the pushed commit.'
