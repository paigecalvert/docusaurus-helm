#!/bin/bash

# copy sdk example go files to partials
function import_sdk() {
    for old in sdkexamples/*.go; do
        # get filename without extention
        name=$(basename ${old%.*})
        new="versioned_docs/version-3.0/sdk/_$name.mdx"
        cp $old $new
        # wrap partial in codeblock with Go syntax highlighting
        { echo '```go'; cat $new; } > $new.tmp && mv $new.tmp $new
        echo '```' >> $new
    done
}

function sidebar_position() {
    find versioned_docs/version-3.0/ -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i '' 's/weight:/sidebar_position:/g' {} +
}

## TODO: 
# mv versioned_docs/version-3.0/helm/helm.md versioned_docs/version-3.0/helm/root.md
# add `sidebar_position: 1` to root.md (so helm command shows at the top)
# why? in docusaurous a file with the same name as the section take precedent over index.md
# INSTEAD we could rename the section from "helm" to "commands" -- we'd just need to set up aliases

## TODO
# replace "<" with "\<"
# replace "{" with "\{"
# BUT NOT IN CODEBLOCKS ARGHHHH
# why? for mdx
## BETTER add the sepecific escape characters needed upstream in `helm docs` command
## include `sidebar_position` in the --include-headers flag (see above)

import_sdk
sidebar_position

