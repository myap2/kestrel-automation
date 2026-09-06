using Kestrel.Automation.Pages;

namespace Kestrel.Automation.Tests;

public class LoginTests : TestBase
{
    [Test]
    public void Signs_in_with_a_standard_account()
    {
        var login = new LoginPage(Driver, El);
        login.Open().SignIn(Config.Accounts.StandardEmail, Config.Accounts.StandardPassword);
        El("account-name").Text.Should().Be(Config.Accounts.StandardName);
        El("account-email").Text.Should().Be(Config.Accounts.StandardEmail);
    }

    [Test]
    public void Rejects_a_bad_password()
    {
        var login = new LoginPage(Driver, El);
        login.Open().SignIn(Config.Accounts.InvalidEmail, Config.Accounts.InvalidPassword);
        login.FlashText().Should().Contain("Email or password is incorrect.");
        Driver.Url.Should().Contain("login.html");
    }

    [Test]
    public void Blocks_a_locked_account()
    {
        var login = new LoginPage(Driver, El);
        login.Open().SignIn(Config.Accounts.LockedEmail, Config.Accounts.LockedPassword);
        login.FlashText().Should().Contain("account is locked");
    }
}
