using Kestrel.Automation.Pages;

namespace Kestrel.Automation.Tests;

public class ContactTests : TestBase
{
    [Test]
    public void Sends_a_message_to_the_shop_desk()
    {
        var contact = new ContactPage(Driver, El).Open();
        contact.Send("Jonah Pike", "jonah@example.com", "Do the Granite Trail Boots run true to size?", "Fit advice");
        contact.FlashText().Should().Contain("Message sent");
        contact.Reference.Should().MatchRegex(@"NOTE-\d+");
    }
}
