#!/bin/bash

set -e  # Exit on error

# === Config ===
BRANCH_NAME="legendlist"
UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"
BUILD_COMMAND="yarn build"
FORK_REPO="TowhidKashem/react-native-collapsible-tab-view"
APP_PATH="../../apps/client"  # From submodule to root, then to app
INSTALL_TARGET="$FORK_REPO#$BRANCH_NAME"

echo ""
echo "🔄 Fetching latest from $UPSTREAM_REMOTE/$UPSTREAM_BRANCH..."
git fetch $UPSTREAM_REMOTE

echo "🌳 Checking out local branch: $BRANCH_NAME"
git checkout $BRANCH_NAME

echo "🔀 Merging upstream/$UPSTREAM_BRANCH into $BRANCH_NAME..."
git merge "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"

echo "🏗️  Running build: $BUILD_COMMAND"
$BUILD_COMMAND

echo "📦 Staging build output..."
git add lib

echo "💾 Committing changes (if any)..."
git commit -m "chore: sync with upstream/$UPSTREAM_BRANCH and rebuild" || echo "📝 No changes to commit."

echo "🚀 Pushing to origin/$BRANCH_NAME..."
git push origin $BRANCH_NAME

echo ""
echo "📍 Installing updated fork into app at $APP_PATH..."
cd "$APP_PATH"

echo "📦 Installing $INSTALL_TARGET..."
yarn add "$INSTALL_TARGET" || npm install "$INSTALL_TARGET"

echo "✅ Sync and install complete!"
