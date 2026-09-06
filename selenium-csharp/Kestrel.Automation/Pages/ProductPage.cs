namespace Kestrel.Automation.Pages;

public class ProductPage
{
    private readonly IWebDriver _driver;
    private readonly Func<string, IWebElement> _el;

    public ProductPage(IWebDriver driver, Func<string, IWebElement> el)
    {
        _driver = driver;
        _el = el;
    }

    public ProductPage Open(string id)
    {
        _driver.Navigate().GoToUrl($"{Config.BaseUrl}/product.html?id={id}");
        _el("product-title");
        return this;
    }

    public string Title => _el("product-title").Text;

    public void AddToCart(int quantity = 1)
    {
        var qty = _el("quantity-input");
        qty.Clear();
        qty.SendKeys(quantity.ToString());
        _el("add-to-cart").Click();
        _el("flash").Text.Should().Contain("added to cart");
    }
}
