using OpenQA.Selenium.Support.UI;

namespace Kestrel.Automation.Pages;

public class ContactPage
{
    private readonly IWebDriver _driver;
    private readonly Func<string, IWebElement> _el;

    public ContactPage(IWebDriver driver, Func<string, IWebElement> el)
    {
        _driver = driver;
        _el = el;
    }

    public ContactPage Open()
    {
        _driver.Navigate().GoToUrl($"{Config.BaseUrl}/contact.html");
        _el("contact-form");
        return this;
    }

    public void Send(string name, string email, string message, string? topic = null)
    {
        _el("contact-name").SendKeys(name);
        _el("contact-email").SendKeys(email);
        if (topic is not null)
        {
            new SelectElement(_el("contact-topic")).SelectByText(topic);
        }
        _el("contact-message").SendKeys(message);
        _el("contact-submit").Click();
    }

    public string FlashText() => _el("flash").Text;
    public string Reference => _el("contact-reference").Text;
}
