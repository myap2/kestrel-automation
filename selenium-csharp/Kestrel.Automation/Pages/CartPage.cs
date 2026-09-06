namespace Kestrel.Automation.Pages;

public class CartPage
{
    private readonly IWebDriver _driver;
    private readonly Func<string, IWebElement> _el;

    public CartPage(IWebDriver driver, Func<string, IWebElement> el)
    {
        _driver = driver;
        _el = el;
    }

    public CartPage Open()
    {
        _driver.Navigate().GoToUrl($"{Config.BaseUrl}/cart.html");
        return this;
    }

    public string Subtotal => _el("summary-subtotal").Text;

    public IList<IWebElement> Rows() => _driver.FindElements(ByTestId.Id("cart-row"));

    public void ContinueToCheckout() => _el("checkout-link").Click();
}
