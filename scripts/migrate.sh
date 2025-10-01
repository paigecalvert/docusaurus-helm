#!/bin/bash

: "${VERSION_DIR:=versioned_docs/version-3.0}"
: "${BLOG_DIR:=blog}"

# Check if rules file exists, return 0 if found, 1 if not found
function is_rules_file() {
    local rules_file="$1"
    local calling_function="$2"
    if [[ ! -f "$rules_file" ]]; then
        echo "Warning: Rules file $rules_file not found, skipping $calling_function"
        return 1
    fi
    return 0
}

# run before renaming categories
# arg 1 (optional): helm binary version (eg, v3.19.0, v4.0.0-alpha.1, etc). defaults to latest
function regenerate_docs() {
    local version="${1:-}"
    if [[ -n $version ]]; then
        export DESIRED_VERSION=$version
    fi
    local tmpdir=$(mktemp -d)
    pushd $tmpdir
    export HELM_INSTALL_DIR=$(pwd)
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod +x get_helm.sh
    ./get_helm.sh
    # set env vars to match linux environments (the helm-www docs default)
    export HOME='~'
    export HELM_CACHE_HOME='~/.cache/helm'
    export HELM_CONFIG_HOME='~/.config/helm'
    export HELM_DATA_HOME='~/.local/share/helm'
    popd
    pushd "$VERSION_DIR/helm"
    "$tmpdir/helm" docs --type markdown --generate-headers
    popd
}

function rename_categories() {
    local rules_file="${1:-scripts/rules/docs_rename_categories.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"
        mv "$VERSION_DIR/$old" "$VERSION_DIR/$new" 2>/dev/null
    done < "$rules_file"
}

function rename_files() {
    local rules_file="${1:-scripts/rules/docs_rename_files.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"
        # Find and rename in all subdirectories
        find "$VERSION_DIR" -type f -name "$old" -execdir mv "$old" "$new" \;
    done < "$rules_file"
}

function rename_files_per_category() {
    local rules_file="${1:-scripts/rules/docs_rename_files_per_category.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local category="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"
        local dir="$VERSION_DIR/$category"
        if [ -f "$dir/$old" ]; then
            mv "$dir/$old" "$dir/$new"
        fi
    done < "$rules_file"
}

function remove_lines() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_remove_lines.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r pattern || [[ -n "$pattern" ]]; do
        [[ -z "$pattern" || "$pattern" == \#* ]] && continue
        find "$basedir" -type f \( -name "*.md" -o -name "*.mdx" \) -exec sed -i '' "/$pattern/d" {} +
    done < "$rules_file"
}

function replace_text() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_replace_text.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local old="${entry%%|*}"
        local new="${entry#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, %)
        find "$basedir" -type f \( -name "*.md" -o -name "*.mdx" \) -exec perl -0777 -pi -e "s%$old%$new%g" {} +
    done < "$rules_file"
}

function replace_text_per_file() {
    local basedir="${1:-$VERSION_DIR}"
    local rules_file="${2:-scripts/rules/docs_replace_text_per_file.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
        local file="${entry%%|*}"
        local rest="${entry#*|}"
        local old="${rest%%|*}"
        local new="${rest#*|}"

        # Convert \n to actual newlines for old and new
        old=$(printf '%b' "${old//\\n/$'\n'}")
        new=$(printf '%b' "${new//\\n/$'\n'}")

        # Use a delimiter unlikely to appear in your patterns (here, %)
        perl -0777 -pi -e "s%$old%$new%g" "$basedir/$file"
    done < "$rules_file"
}

function add_metadata_lines() {
    local rules_file="${1:-scripts/rules/docs_add_metadata_lines.txt}"
    is_rules_file "$rules_file" "${FUNCNAME[0]}" || return 0

    while IFS= read -r entry || [[ -n "$entry" ]]; do
        [[ -z "$entry" || "$entry" == \#* ]] && continue
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
    done < "$rules_file"
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

function delete_deprecated_files() {
    grep -rl 'section: deprecated' "$VERSION_DIR" --include="*.md" --include="*.mdx" | while read -r file; do
        rm "$file"
    done
}

# run before removing aliases field
function blog_save_aliases() {
    grep -r aliases: blog/ > scripts/blog_aliases.txt
}

# examples:
#   generate_netlify_redirects redirects.yaml > _redirects
#   generate_netlify_redirects redirects.yaml 301 > _redirects
generate_netlify_redirects() {
  local input="${1:-/dev/stdin}"
  local code="${REDIRECT_CODE:-302}"

  if ! [[ "$code" =~ ^[0-9]{3}$ ]]; then
    echo "Error: invalid status code '$code'. Set REDIRECT_CODE to a 3-digit HTTP code." >&2
    return 1
  fi
  if ! command -v yq >/dev/null 2>&1; then
    echo "Error: mikefarah yq v4 not found in PATH." >&2
    return 1
  fi

  # Convert properties-like lines to valid YAML sequence with items:
  # - path: "<path>"
  # - aliases: <string|array>
  REDIRECT_CODE="$code" awk '
    function trim(s) { sub(/^[ \t\r\n]+/, "", s); sub(/[ \t\r\n]+$/, "", s); return s }
    {
      # skip empty/comment lines
      if ($0 ~ /^[ \t\r\n]*$/) next
      if ($0 ~ /^[ \t]*#/) next

      sep = ":aliases:"
      idx = index($0, sep)
      if (idx == 0) next

      path = substr($0, 1, idx - 1)
      val  = substr($0, idx + length(sep))

      path = trim(path)
      val  = trim(val)

      print "- path: \"" path "\""
      print "  aliases: " val
    }
  ' "$input" | yq -o=tsv '
    .[] |
    .path as $to |
    .aliases as $aliases |
    (
      # string aliases -> one record
      (select(($aliases | type) == "string") | [$aliases, $to, strenv(REDIRECT_CODE)])
      ,
      # array aliases -> expand each item
      (select(($aliases | type) == "array") | ($aliases | map([., $to, strenv(REDIRECT_CODE)])[]))
    )
    | @tsv
  ' | awk -F'\t' 'NF>=2 { printf "%s %s %s\n", $1, $2, (ENVIRON["REDIRECT_CODE"] ? ENVIRON["REDIRECT_CODE"] : "302") }'
}

function blog_apply_patch() {
    git apply --reverse scripts/blog-import-reverse-diff.patch
}

# regenerate_docs
delete_deprecated_files
rename_categories
rename_files
rename_files_per_category
remove_lines "$VERSION_DIR" "scripts/rules/docs_remove_lines.txt"
replace_text "$VERSION_DIR" "scripts/rules/docs_replace_text.txt"
replace_text_per_file "$VERSION_DIR" "scripts/rules/docs_replace_text_per_file.txt"
add_metadata_lines
import_sdk
blog_save_aliases
# TODO: change to 301 (permanent) when we know we're happy with the redirects
generate_netlify_redirects scripts/blog_aliases.txt > _redirects
blog_apply_patch
