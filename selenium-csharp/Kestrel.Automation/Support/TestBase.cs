using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Kestrel.Automation.Support;

public abstract class TestBase
{
    protected IWebDriver Driver { get; private set; } = null!;
    protected WebDriverWait Wait { get; private set; } = null!;

    [SetUp]
    public void StartBrowser()
    {
        Driver = DriverFactory.Create();
        Driver.Manage().Timeouts().ImplicitWait = TimeSpan.Zero;
        Wait = new WebDriverWait(Driver, Config.Timeout);
        Wait.IgnoreExceptionTypes(typeof(NoSuchElementException), typeof(StaleElementReferenceException));
    }

    [TearDown]
    public void QuitBrowser()
    {
        Driver.Quit();
        Driver.Dispose();
    }

    protected IWebElement El(string testId) =>
        Wait.Until(driver =>
        {
            var element = driver.FindElement(ByTestId.Id(testId));
            return element.Displayed ? element : null;
        })!;

    protected IReadOnlyList<IWebElement> All(string testId) =>
        Driver.FindElements(ByTestId.Id(testId));

    protected void Visit(string path)
    {
        var url = path.StartsWith("http", StringComparison.OrdinalIgnoreCase)
            ? path
            : $"{Config.BaseUrl}{path}";
        Driver.Navigate().GoToUrl(url);
    }
}
