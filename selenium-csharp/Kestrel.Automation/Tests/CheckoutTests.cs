using Kestrel.Automation.Pages;
using OpenQA.Selenium.Support.UI;

namespace Kestrel.Automation.Tests;

public class CheckoutTests : TestBase
{
    [Test]
    public void Adds_a_tent_and_places_an_order()
    {
        new LoginPage(Driver, El).Open().SignIn(Config.Accounts.StandardEmail, Config.Accounts.StandardPassword);
        El("account-name");

        var product = new ProductPage(Driver, El).Open("ridgeline-2p");
        product.Title.Should().Be("Ridgeline 2P Tent");
        product.AddToCart();

        var cart = new CartPage(Driver, El).Open();
        cart.Rows().Should().Contain(row => row.Text.Contains("Ridgeline 2P Tent"));
        cart.Subtotal.Should().Be("$289.00");
        cart.ContinueToCheckout();

        var checkout = new CheckoutPage(El);
        checkout.FillShipping();
        checkout.PlaceOrder();

        Wait.Until(driver => driver.Url.Contains("order.html"));
        El("order-heading").Displayed.Should().BeTrue();
        El("order-id").Text.Should().MatchRegex(@"KES-\d+");
        El("order-total").Text.Should().Be("$289.00");
        El("cart-count").Text.Should().Be("0");
    }
}
