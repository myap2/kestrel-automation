namespace Kestrel.Automation.Pages;

public class ShopPage
{
    private readonly IWebDriver _driver;
    private readonly Func<string, IWebElement> _el;

    public ShopPage(IWebDriver driver, Func<string, IWebElement> el)
    {
        _driver = driver;
        _el = el;
    }

    public ShopPage Open()
    {
        _driver.Navigate().GoToUrl($"{Config.BaseUrl}/shop.html");
        _el("product-grid");
        return this;
    }

    public void Search(string term)
    {
        var input = _el("search-input");
        input.Clear();
        input.SendKeys(term);
    }

    public void FilterCategory(string name)
    {
        _driver.FindElements(ByTestId.Id("category-chip"))
            .First(chip => chip.Text.Equals(name, StringComparison.OrdinalIgnoreCase))
            .Click();
    }

    public IList<IWebElement> Cards() => _driver.FindElements(ByTestId.Id("product-card"));

    public IWebElement EmptyCatalog() => _el("empty-catalog");
}
