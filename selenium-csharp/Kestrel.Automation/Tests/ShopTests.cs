using Kestrel.Automation.Pages;
using OpenQA.Selenium.Support.UI;

namespace Kestrel.Automation.Tests;

public class ShopTests : TestBase
{
    [Test]
    public void Lists_live_products_from_the_api()
    {
        var shop = new ShopPage(Driver, El).Open();
        Wait.Until(_ => shop.Cards().Count == 8);
        shop.Cards().Select(card => card.Text).Should().Contain(text => text.Contains("Ridgeline 2P Tent"));
    }

    [Test]
    public void Filters_by_search_text()
    {
        var shop = new ShopPage(Driver, El).Open();
        Wait.Until(_ => shop.Cards().Count == 8);
        shop.Search("tent");
        Wait.Until(_ => shop.Cards().Count == 1);
        shop.Cards().Single().Text.Should().Contain("Ridgeline 2P Tent");
    }

    [Test]
    public void Filters_by_category()
    {
        var shop = new ShopPage(Driver, El).Open();
        Wait.Until(_ => shop.Cards().Count == 8);
        shop.FilterCategory("Apparel");
        Wait.Until(_ => shop.Cards().Count == 2);
        var names = shop.Cards().Select(card => card.Text);
        names.Should().Contain(text => text.Contains("Summit Down Jacket"));
        names.Should().Contain(text => text.Contains("Merino Base Layer"));
    }
}
