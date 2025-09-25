#!/bin/bash

: "${VERSION_DIR:=versioned_docs/version-3.0}"

# TODO add the correct HOME string
function generate_docs() {
    local HOME='~'
    helm docs --type markdown --generate-headers
}

function rename_categories() {
    local renames=(
        "helm|commands"
    )

    for entry in "${renames[@]}"; do
        local old="${entry%%|*}"
        local new="${entry#*|}"
        mv "$VERSION_DIR/$old" "$VERSION_DIR/$new" 2>/dev/null
    done
}

function rename_files() {
    local renames=(
        "_index.md|index.md"
    )

    for entry in "${renames[@]}"; do
        local old="${entry%%|*}"
        local new="${entry#*|}"
        # Find and rename in all subdirectories
        find "$VERSION_DIR" -type f -name "$old" -execdir mv "$old" "$new" \;
    done
}

function rename_files_per_category() {
    local renames=(
        "sdk|examples.md|examples.mdx"
    )

    for entry in "${renames[@]}"; do
        local category="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"
        local dir="$VERSION_DIR/$category"
        if [ -f "$dir/$old" ]; then
            mv "$dir/$old" "$dir/$new"
        fi
    done
}

function remove_lines() {
    local patterns=(
        "^[[:space:]]*slug:"
    )

    for pattern in "${patterns[@]}"; do
        find "$VERSION_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i '' "/$pattern/d" {} +
    done
}

function replace_text() {
    # Each entry: "old_text|new_text". Use "\n" for multiline
    local replacements=(
        "weight:|sidebar_position:"
    )

    for entry in "${replacements[@]}"; do
        local old="${entry%%|*}"
        local new="${entry#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, @)
        find "$VERSION_DIR" -type f \( -name "*.md" -o -name "*.mdx" \) -exec perl -0777 -pi -e "s@\Q$old\E@$new@g" {} +
    done
}

function replace_text_per_file() {
    # Each entry: "category/filename|old_text|new_text". Use "\n" for multiline
    local replacements=(
        'chart_best_practices/dependencies.md|{{< ref "../topics/plugins#downloader-plugins" >}}|../topics/plugins.md#downloader-plugins'
        'chart_template_guide/accessing_files.md|{{< ref\n"/docs/chart_template_guide/subcharts_and_globals.md" >}}|subcharts_and_globals.md'
        'chart_template_guide/builtin_objects.md|{{< ref\n    "/docs/topics/charts.md#the-chartyaml-file" >}}|../topics/charts.md#the-chartyaml-file'
        'chart_template_guide/builtin_objects.md|{{< ref\n    "/docs/chart_template_guide/accessing_files.md" >}}|accessing_files.md'
        'chart_template_guide/getting_started.md|../../topics/charts|../topics/charts'
        'chart_template_guide/getting_started.md|(_index.md)|(../)'
        'chart_template_guide/subcharts_and_globals.md|{{< ref\n"/docs/topics/library_charts.md" >}}|../topics/library_charts.md'
        'chart_template_guide/subcharts_and_globals.md|{{< ref "../topics/charts.md" >}}|../topics/charts.md'
        'chart_template_guide/wrapping_up.md|../../topics/charts/|../topics/charts.md'
        'chart_template_guide/wrapping_up.md|../../topics/charts_hooks/|../topics/charts_hooks.md'
        'chart_template_guide/wrapping_up.md|../../howto/charts_tips_and_tricks/|../howto/charts_tips_and_tricks.md'
        'chart_template_guide/function_list.md|functions_and_pipelines.md/#using-the-lookup-function|functions_and_pipelines.md#using-the-lookup-function'
        'howto/chart_repository_sync_example.md|{{< ref\n"/docs/topics/chart_repository.md" >}}|../topics/chart_repository.md'
        'howto/chart_repository_sync_example.md|{{< ref "/docs/topics/chart_repository.md" >}}|../topics/chart_repository.md'
        'intro/quickstart.md|{{< ref\n"install.md" >}}|install.md'
        'intro/quickstart.md|{{< ref "using_helm.md">}}|using_helm.md'
        'intro/quickstart.md|{{< ref "using_helm.md"\n>}}|using_helm.md'
        'intro/using_helm.md|{{< ref\n"install.md" >}}|install.md'
        'intro/using_helm.md|{{< ref "quickstart.md" >}}|quickstart.md'
        'intro/using_helm.md|{{< ref "../topics/charts.md" >}}|../topics/charts.md'
        'intro/using_helm.md|{{< ref "/docs/topics/chart_repository.md" >}}|../topics/chart_repository.md'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/install.go" >}}|<Install />'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/upgrade.go" >}}|<Upgrade />'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/uninstall.go" >}}|<Uninstall />'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/list.go" >}}|<List />'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/pull.go" >}}|<Pull />'
        'sdk/examples.mdx|{{< highlightexamplego file="sdkexamples/main.go" >}}|<Main />'
        'sdk/gosdk.md|./examples.md|examples.mdx'
        'topics/advanced.md|/docs/permissions_sql_storage_backend/|permissions_sql_storage_backend.md'
        'topics/chart_repository.md|{{< ref "/docs/topics/registries.md" >}}|registries.md'
        'topics/chart_repository.md|{{< ref "quickstart.md" >}}|../intro/quickstart.md'
        'topics/chart_repository.md|{{< ref "/docs/topics/charts.md" >}}|charts.md'
        'topics/chart_repository.md|{{< ref "provenance.md" >}}|provenance.md'
        'topics/chart_repository.md|{{< ref "/docs/howto/chart_releaser_action.md" >}}|../howto/chart_releaser_action.md'
        'topics/chart_repository.md|{{< ref "/docs/howto/chart_repository_sync_example.md" >}}|../howto/chart_repository_sync_example.md'
        'topics/chart_tests.md|/docs/helm/helm_create|../commands/helm_create.md'
        'topics/chart_tests.md|/docs/charts_hooks/|charts_hooks.md'
        'topics/charts.md|{{< ref\n"/docs/topics/library_charts.md" >}}|library_charts.md'
        'topics/charts.md|{{< ref "/docs/howto/charts_tips_and_tricks.md" >}}|../howto/charts_tips_and_tricks.md'
        'topics/charts.md|{{< ref\n"/docs/howto/charts_tips_and_tricks.md" >}}|../howto/charts_tips_and_tricks.md'
        'topics/charts_hooks.md|/docs/chart_tests/|chart_tests.md'
        'topics/library_charts.md|{{< ref "/docs/topics/charts.md" >}}|charts.md'
        'topics/library_charts.md|{{< ref\n"/docs/topics/charts.md" >}}|charts.md'
        'topics/library_charts.md|{{< ref\n"/docs/chart_template_guide/named_templates.md" >}}|../chart_template_guide/named_templates.md'
        'topics/library_charts.md|{{< ref\n"/docs/chart_template_guide/subcharts_and_globals.md" >}}|../chart_template_guide/subcharts_and_globals.md'
        'topics/plugins.md|{{< ref "related.md#helm-plugins"\n>}}|../community/related.md#helm-plugins'
        'topics/provenance.md|{{< ref "registries.md" >}}|registries.md'
        'topics/registries.md|{{< ref "chart_repository.md" >}}|chart_repository.md'
        'topics/registries.md|{{< ref "provenance.md" >}}|provenance.md'
        'topics/registries.md|{{< ref "chart_repository.md" >}}|chart_repository.md'
    )

    for entry in "${replacements[@]}"; do
        local file="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, @)
        perl -0777 -pi -e "s@\Q$old\E@$new@g" "$VERSION_DIR/$file"
    done
}

function add_metadata_lines() {
    # Each entry: 'filename|metadata_string'
    local entries=(
        'index.md|sidebar_position: 1'
        'index.md|hide_table_of_contents: true'
    )

    for entry in "${entries[@]}"; do
        local file="$VERSION_DIR/${entry%%|*}"
        local meta="${entry#*|}"

        # Skip if the metadata line already exists anywhere in the file
        if grep -Fxq "$meta" "$file"; then
            continue
        fi

        # Find the line number of the second ---
        local second_dash_line
        second_dash_line=$(grep -n '^---$' "$file" | sed -n '2p' | cut -d: -f1)

        if [[ -n "$second_dash_line" ]]; then
            # Write up to before second ---
            head -n $((second_dash_line - 1)) "$file" > "$file.tmp"
            echo "$meta" >> "$file.tmp"
            sed -n "${second_dash_line}p" "$file" >> "$file.tmp"
            tail -n +"$((second_dash_line + 1))" "$file" >> "$file.tmp"
        else
            # No metadata block, create one at the top
            {
                echo "---"
                echo "$meta"
                echo "---"
                cat "$file"
            } > "$file.tmp"
        fi

        mv "$file.tmp" "$file"
    done
}

# copy sdk example go files to partials
# this function was mildly tricky with bash to make idempotent, so adding loads of comments
import_sdk() {
    local import_lines=()
    local file="$VERSION_DIR/sdk/examples.mdx"
    for old in sdkexamples/*.go; do
        local name=$(basename "${old%.*}")
        local new="$VERSION_DIR/sdk/_$name.mdx"
        cp "$old" "$new"
        { echo '```go'; cat "$new"; } > "$new.tmp" && mv "$new.tmp" "$new"
        echo '```' >> "$new"
        local capname=$(echo "$name" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')
        import_lines+=("import $capname from './_${name}.mdx'")
    done

    local second_dash_line
    second_dash_line=$(grep -n '^---$' "$file" | sed -n '2p' | cut -d: -f1)

    # write header (up to and including the second ---)
    head -n "$second_dash_line" "$file" > "$file.tmp"

    # write import lines
    printf '%s\n' "${import_lines[@]}" >> "$file.tmp"

    # add exactly one blank line
    echo "" >> "$file.tmp"

    # now, skip any blank lines and import lines after the header in the original file
    local rest_start=$((second_dash_line + 1))
    local found_content=0
    while IFS= read -r line; do
        # skip blank lines and import lines
        if [[ -z "$line" ]] || [[ "$line" == import* ]]; then
            rest_start=$((rest_start + 1))
            continue
        fi
        break
    done < <(tail -n +"$((second_dash_line + 1))" "$file")

    # append the rest of the file, starting from the first non-import, non-blank line
    tail -n +"$rest_start" "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
}

delete_deprecated_files() {
    grep -rl 'section: deprecated' "$VERSION_DIR" --include="*.md" --include="*.mdx" | while read -r file; do
        rm "$file"
    done
}

# TODO
# are there other metadata keys from hugo that aren't used by docusaurous?

delete_deprecated_files
rename_categories
rename_files
rename_files_per_category
remove_lines
replace_text
replace_text_per_file
add_metadata_lines
import_sdk
