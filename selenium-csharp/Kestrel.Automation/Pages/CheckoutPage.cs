namespace Kestrel.Automation.Pages;

public class CheckoutPage
{
    private readonly Func<string, IWebElement> _el;

    public CheckoutPage(Func<string, IWebElement> el)
    {
        _el = el;
    }

    public void FillShipping(string address = "412 Hood Street", string city = "Portland", string region = "OR", string postal = "97214")
    {
        Type("checkout-address", address);
        Type("checkout-city", city);
        Type("checkout-region", region);
        Type("checkout-postal", postal);
    }

    public void PlaceOrder() => _el("place-order").Click();

    private void Type(string testId, string value)
    {
        var field = _el(testId);
        field.Clear();
        field.SendKeys(value);
    }
}
