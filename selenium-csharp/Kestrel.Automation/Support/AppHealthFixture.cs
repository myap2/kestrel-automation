namespace Kestrel.Automation;

[SetUpFixture]
public class AppHealthFixture
{
    [OneTimeSetUp]
    public void EnsureApplicationIsUp()
    {
        using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
        var url = $"{Config.BaseUrl}/api/health";
        for (var attempt = 0; attempt < 20; attempt++)
        {
            try
            {
                var response = client.GetAsync(url).GetAwaiter().GetResult();
                if (response.IsSuccessStatusCode)
                {
                    return;
                }
            }
            catch (Exception)
            {
                // The storefront may still be booting.
            }
            Thread.Sleep(500);
        }

        Assert.Fail($"Kestrel Outfitters was not reachable at {url}. Start it with `npm run app`.");
    }
}
