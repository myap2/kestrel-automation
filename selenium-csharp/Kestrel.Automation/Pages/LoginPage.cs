namespace Kestrel.Automation.Pages;

public class LoginPage
{
    private readonly IWebDriver _driver;
    private readonly Func<string, IWebElement> _el;

    public LoginPage(IWebDriver driver, Func<string, IWebElement> el)
    {
        _driver = driver;
        _el = el;
    }

    public LoginPage Open(string? next = null)
    {
        var path = next is null ? "/login.html" : $"/login.html?next={Uri.EscapeDataString(next)}";
        _driver.Navigate().GoToUrl($"{Config.BaseUrl}{path}");
        _el("login-form");
        return this;
    }

    public void SignIn(string email, string password)
    {
        var emailField = _el("login-email");
        emailField.Clear();
        emailField.SendKeys(email);
        var passwordField = _el("login-password");
        passwordField.Clear();
        passwordField.SendKeys(password);
        _el("login-submit").Click();
    }

    public string FlashText() => _el("flash").Text;
}
