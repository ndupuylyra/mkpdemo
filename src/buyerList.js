export function buyerListFunction() {
    // CONSTANT
    const mkpUUID = '57595c55-b096-41d8-9287-b98640de3f25';
    const proxy = 'https://lyramkpproxy.herokuapp.com/';
    const mkpEndpoint = 'https://secure.lyra.com/marketplace-test/';
    // INIT
    $('.admin-buyers').show();
    $('.reload-admin-buyers').hide();
    console.log('Fetch buyer list - Client API');
    var buyerList = {
        "async": true,
        "crossDomain": true,
        "url": proxy + mkpEndpoint + "marketplaces/" + mkpUUID + "/sellers", // To replace with correct endpoint
        "headers": {
            "accept": "application/json",
            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
            "content-Type": "application/json",
            "method": "GET",
        }
    }
    /** On request response */
    $.ajax(buyerList).done(function(response) {
        $('.admin-buyers').hide();
        $('.reload-admin-buyers').show();
        console.log("Fetch buyer list - Client API (DONE)");
        var buyerListData = response;
    });
}