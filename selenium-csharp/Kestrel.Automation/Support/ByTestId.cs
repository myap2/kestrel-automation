using OpenQA.Selenium;

namespace Kestrel.Automation.Support;

public static class ByTestId
{
    public static By Id(string testId) => By.CssSelector($"[data-testid='{testId}']");
}
