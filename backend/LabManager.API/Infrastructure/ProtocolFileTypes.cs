using System.Collections.ObjectModel;

namespace LabManager.API.Infrastructure;

public static class ProtocolFileTypes
{
    private static readonly ReadOnlyDictionary<string, string> CanonicalContentTypes =
        new(new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = "application/pdf",
            [".doc"] = "application/msword",
            [".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            [".xls"] = "application/vnd.ms-excel",
            [".xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            [".png"] = "image/png",
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".webp"] = "image/webp",
            [".gif"] = "image/gif",
            [".bmp"] = "image/bmp",
        });

    private static readonly ReadOnlyDictionary<string, HashSet<string>> AllowedContentTypes =
        new(new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = new(StringComparer.OrdinalIgnoreCase) { "application/pdf" },
            [".doc"] = new(StringComparer.OrdinalIgnoreCase) { "application/msword", "application/doc", "application/vnd.ms-word" },
            [".docx"] = new(StringComparer.OrdinalIgnoreCase) { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            [".xls"] = new(StringComparer.OrdinalIgnoreCase) { "application/vnd.ms-excel", "application/msexcel" },
            [".xlsx"] = new(StringComparer.OrdinalIgnoreCase) { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            [".png"] = new(StringComparer.OrdinalIgnoreCase) { "image/png", "image/x-png" },
            [".jpg"] = new(StringComparer.OrdinalIgnoreCase) { "image/jpeg", "image/jpg", "image/pjpeg" },
            [".jpeg"] = new(StringComparer.OrdinalIgnoreCase) { "image/jpeg", "image/jpg", "image/pjpeg" },
            [".webp"] = new(StringComparer.OrdinalIgnoreCase) { "image/webp" },
            [".gif"] = new(StringComparer.OrdinalIgnoreCase) { "image/gif" },
            [".bmp"] = new(StringComparer.OrdinalIgnoreCase) { "image/bmp" },
        });

    private static readonly HashSet<string> GenericContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "",
        "application/octet-stream",
    };

    public static bool TryNormalize(string? fileName, string? contentType, out string normalizedContentType)
    {
        normalizedContentType = "application/octet-stream";

        var extension = Path.GetExtension(fileName ?? string.Empty);
        if (string.IsNullOrWhiteSpace(extension) || !CanonicalContentTypes.TryGetValue(extension, out var canonicalContentType))
        {
            return false;
        }

        var candidateContentType = (contentType ?? string.Empty).Split(';', 2)[0].Trim();
        if (!GenericContentTypes.Contains(candidateContentType) &&
            (!AllowedContentTypes.TryGetValue(extension, out var allowedContentTypes) || !allowedContentTypes.Contains(candidateContentType)))
        {
            return false;
        }

        normalizedContentType = canonicalContentType;
        return true;
    }

    public static string GetContentType(string? fileName, string? storedContentType)
    {
        if (TryNormalize(fileName, storedContentType, out var normalizedContentType))
        {
            return normalizedContentType;
        }

        var extension = Path.GetExtension(fileName ?? string.Empty);
        if (!string.IsNullOrWhiteSpace(extension) && CanonicalContentTypes.TryGetValue(extension, out var canonicalFromExtension))
        {
            return canonicalFromExtension;
        }

        return string.IsNullOrWhiteSpace(storedContentType) ? "application/octet-stream" : storedContentType;
    }
}
