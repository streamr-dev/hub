const normalizeVersion = (ver: string) => {
    if (!ver) return [NaN, NaN, NaN]

    const parts = ver.split('.').map((part) => {
        const num = parseInt(part, 10)
        return isNaN(num) ? NaN : num
    })

    // Check if any part is invalid first
    if (parts.some(isNaN)) return [NaN, NaN, NaN]

    // Then pad missing parts with 0
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0]
}

export const isNodeVersionGreaterThanOrEqualTo = (
    version: string,
    requiredVersion: string,
): boolean => {
    const [major, minor, patch] = normalizeVersion(version)
    const [requiredMajor, requiredMinor, requiredPatch] =
        normalizeVersion(requiredVersion)

    // Handle invalid inputs
    if (
        isNaN(major) ||
        isNaN(minor) ||
        isNaN(patch) ||
        isNaN(requiredMajor) ||
        isNaN(requiredMinor) ||
        isNaN(requiredPatch)
    ) {
        return false
    }

    // Compare each part sequentially
    if (major !== requiredMajor) {
        return major > requiredMajor
    }
    if (minor !== requiredMinor) {
        return minor > requiredMinor
    }
    return patch >= requiredPatch
}
