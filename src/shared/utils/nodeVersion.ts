export const isNodeVersionGreaterThanOrEqualTo = (
    version: string,
    requiredVersion: string,
): boolean => {
    // Split versions and pad with zeros if parts are missing
    const normalize = (ver: string) => {
        const parts = ver.split('.').map((part) => parseInt(part, 10))
        return [parts[0] || 0, parts[1] || 0, parts[2] || 0]
    }

    const [major, minor, patch] = normalize(version)
    const [requiredMajor, requiredMinor, requiredPatch] = normalize(requiredVersion)

    // Handle invalid inputs
    if (isNaN(major) || isNaN(requiredMajor)) {
        return false
    }

    return (
        major > requiredMajor ||
        (major === requiredMajor &&
            (minor > requiredMinor ||
                (minor === requiredMinor && patch >= requiredPatch)))
    )
}
