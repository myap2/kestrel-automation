namespace Kestrel.Automation.Support;

public static class Config
{
    public static string BaseUrl =>
        Environment.GetEnvironmentVariable("BASE_URL")?.TrimEnd('/') ?? "http://localhost:3000";

    public static bool Headless =>
        !string.Equals(Environment.GetEnvironmentVariable("HEADED"), "1", StringComparison.OrdinalIgnoreCase);

    public static TimeSpan Timeout => TimeSpan.FromSeconds(10);

    public static class Accounts
    {
        public const string StandardEmail = "standard@kestrel.test";
        public const string StandardPassword = "Trailhead!23";
        public const string StandardName = "Mara Ellison";
        public const string LockedEmail = "locked@kestrel.test";
        public const string LockedPassword = "Trailhead!23";
        public const string InvalidEmail = "nobody@kestrel.test";
        public const string InvalidPassword = "wrong-password";
    }
}
