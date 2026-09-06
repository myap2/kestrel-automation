using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Kestrel.Automation.Support;

public static class DriverFactory
{
    public static IWebDriver Create()
    {
        var options = new ChromeOptions();
        if (Config.Headless)
        {
            options.AddArgument("--headless=new");
        }
        options.AddArgument("--window-size=1400,900");
        options.AddArgument("--disable-gpu");
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-dev-shm-usage");
        return new ChromeDriver(options);
    }
}
