using System.Net.Http.Json;
using System.Text.Json;

namespace Kestrel.Automation.Tests;

public class ApiTests
{
    [Test]
    public async Task Health_endpoint_is_up()
    {
        using var client = new HttpClient { BaseAddress = new Uri(Config.BaseUrl) };
        var payload = await client.GetFromJsonAsync<HealthResponse>(
            "/api/health",
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        payload.Should().NotBeNull();
        payload!.Ok.Should().BeTrue();
    }

    [Test]
    public async Task Locked_account_is_rejected()
    {
        using var client = new HttpClient { BaseAddress = new Uri(Config.BaseUrl) };
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = Config.Accounts.LockedEmail,
            password = Config.Accounts.LockedPassword,
        });
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }

    private sealed record HealthResponse(bool Ok, string Service);
}
