export function sellerListFunction() {
    // CONSTANT
    const mkpUUID = '57595c55-b096-41d8-9287-b98640de3f25';
    const proxy = 'https://lyramkpproxy.herokuapp.com/';
    const mkpEndpoint = 'https://secure.lyra.com/marketplace-test/';
    // INIT
    $('.admin-sellers').show();
    $('.reload-admin-sellers').hide();
    $('#page-content').html('Chargement...');
    // FETCH SELLER LIST FIRST PAGE
    console.log("Fetch seller list");
    $('.admin-sellers').show();
    $('.reload-admin-sellers').hide();
    var sellerList = {
        "async": true,
        "crossDomain": true,
        "url": proxy + mkpEndpoint + "marketplaces/" + mkpUUID + "/sellers",
        "headers": {
            "accept": "application/json",
            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
            "content-Type": "application/json",
            "method": "GET",
        }
    }
    /** On request response */
    $.ajax(sellerList).done(function(response) {
        console.log("Fetch seller list (DONE)");
        $('.admin-sellers').hide();
        $('.reload-admin-sellers').show();
        var sellerListNumber = response.count;
        var sellerListPages = Math.ceil(sellerListNumber / 5);
        $('#page-content').html('');
        $('#page-content').append(
            '<div class="container" style="background:#e9ecef;font-size:16px;font-weight:600;color:#495057;padding:12px">' +
                '<div class="row">' +
                    '<div class="col-1">Référence</div>' +
                    '<div class="col-3">Description</div>' +
                    '<div class="col-3">UUID</div>' +
                    '<div class="col-2" style="text-align:center">Décaissement (jour)</div>' +
                    '<div class="col-3">Complément</div>' +
                '</div>' +
            '</div>'
        );
        for ( var sellerListData = 0; sellerListData < response.results.length; sellerListData++ ) {
            if ( response.results[sellerListData].is_marketplace_seller === true ) {
                var sellerComp = '<span class="isNotSeller">OPÉRATEUR MARKETPLACE</span>';
            } else {
                var sellerComp = '<span class="isSeller">SOUS-MARCHAND</span>';
            }
            if ( response.results[sellerListData].status === 'INACTIVE' ) {
                var sellerCompStatus = '<span class="isIncativeSeller">INACTIF</span>';
            } else {
                var sellerCompStatus = '';
            }
            $('#page-content').append(
                '<div class="container" style="border-top:1px solid #e9ecef;padding:12px">' +
                    '<div class="row">' +
                        '<div class="col-1">' + response.results[sellerListData].reference + '</div>' +
                        '<div class="col-3">' + response.results[sellerListData].description + '</div>' +
                        '<div class="col-3">' + response.results[sellerListData].uuid + '</div>' +
                        '<div class="col-2" style="text-align:center">' + response.results[sellerListData].cashout_delay + '</div>' +
                        '<div class="col-3">' + sellerComp + sellerCompStatus + '</div>' +
                    '</div>' +
                '</div>'
            );
            // On pagination click
            $('#pagination-demo').twbsPagination({
                totalPages: sellerListPages,
                startPage: 1,
                visiblePages: 5,
                onPageClick: function (event, page) {
                    $('.admin-sellers').show();
                    $('.reload-admin-sellers').hide();
                    $('#page-content').html('Chargement...');
                    var sellerListPageData = {
                        "async": true,
                        "crossDomain": true,
                        "url": proxy + mkpEndpoint + "/marketplaces/" + mkpUUID + "/sellers?page=" + page,
                        "headers": {
                            "accept": "application/json",
                            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
                            "content-Type": "application/json",
                            "method": "GET",
                        }
                    }
                    $.ajax(sellerListPageData).done(function(response) {
                        $('.admin-sellers').hide();
                        $('.reload-admin-sellers').show();
                        $('#page-content').html('');
                        $('#page-content').append(
                            '<div class="container" style="background:#e9ecef;font-size:16px;font-weight:600;color:#495057;padding:12px">' +
                                '<div class="row">' +
                                    '<div class="col-1">Référence</div>' +
                                    '<div class="col-3">Description</div>' +
                                    '<div class="col-3">UUID</div>' +
                                    '<div class="col-2" style="text-align:center">Décaissement (jour)</div>' +
                                    '<div class="col-3">Complément</div>' +
                                '</div>' +
                            '</div>'
                        );
                        for ( var sellerListData = 0; sellerListData < response.results.length; sellerListData++ ) {
                            if ( response.results[sellerListData].is_marketplace_seller === true ) {
                                var sellerComp = '<span class="isNotSeller">OPÉRATEUR MARKETPLACE</span>';
                            } else {
                                var sellerComp = '<span class="isSeller">SOUS-MARCHAND</span>';
                            }
                            if ( response.results[sellerListData].status === 'INACTIVE' ) {
                                var sellerCompStatus = '<span class="isIncativeSeller">INACTIF</span>';
                            } else {
                                var sellerCompStatus = '';
                            }
                            $('#page-content').append(
                                '<div class="container" style="border-top:1px solid #e9ecef;padding:12px">' +
                                    '<div class="row">' +
                                        '<div class="col-1">' + response.results[sellerListData].reference + '</div>' +
                                        '<div class="col-3">' + response.results[sellerListData].description + '</div>' +
                                        '<div class="col-3">' + response.results[sellerListData].uuid + '</div>' +
                                        '<div class="col-2" style="text-align:center">' + response.results[sellerListData].cashout_delay + '</div>' +
                                        '<div class="col-3">' + sellerComp + sellerCompStatus + '</div>' +
                                    '</div>' +
                                '</div>'
                            );
                        }
                    });
                }
            });
        }
    });
}