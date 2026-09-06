# Selenium / C#

NUnit 4 + Selenium 4 on .NET 8. Page objects under `Kestrel.Automation/Pages`. `TestBase` uses `WebDriverWait` only — implicit wait is zero.

Selenium Manager resolves ChromeDriver. Set `HEADED=1` to watch the browser.

```bash
# shop must be running on http://localhost:3000
dotnet test Kestrel.Automation.sln
```
