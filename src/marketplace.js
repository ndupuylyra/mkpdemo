export function marketplace() {
    // CONSTANT
    const mkpUUID = '57595c55-b096-41d8-9287-b98640de3f25';
    const proxy = 'https://lyramkpproxy.herokuapp.com/';
    const mkpEndpoint = 'https://secure.lyra.com/marketplace-test/';
    // INIT
    $('.marketplaceDescription').html('');
    $('.section-title-mkpuuid').html('');
    $('.section-title-reference').html('');
    $('.mkpReference').html('');
    $('.section-title-status').html('');
    $('.mkpStatus').html('');
    $('.section-title-tvaRate').html('');
    $('.mkpTvaRate').html('');
    $('.section-title-billingMethod').html('');
    $('.mkpTBillingMethod').html('');
    $('.section-title-vouchers').html('');
    $('.mkpVouchers').html('');
    $('.section-title-currencies').html('');
    $('.currenciesTitle').html('');
    $('.currenciesData').html('');
    $('.marketplaceLoading').html('Chargement...');
    $('.mkpuuid').html('');
    $('.reload-admin-settings').hide();
    $('.admin-settings').show();
    console.log("Fetch marketplace details");
    var marketplace = {
        "async": true,
        "crossDomain": true,
        "url": proxy + mkpEndpoint + "marketplaces/" + mkpUUID,
        "headers": {
            "accept": "application/json",
            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
            "content-Type": "application/json",
            "method": "GET",
        }
    }
    /** On request response */
    $.ajax(marketplace).done(function (response) {
        console.log("Fetch marketplace details (DONE)");
        $('.marketplaceLoading').html('');
        $('.admin-settings').hide();
        $('.reload-admin-settings').show();
        var marketplaceDescription = 'Marketplace ' + response.description;
        var marketplaceUUID = response.uuid;
        var marketplaceReference = response.reference;
        var marketplaceStatus = response.status;
        if ( marketplaceStatus == 'ACTIVE' ) {
            var cssStatus = 'active';
        } else {
            var cssStatus = 'inactive';
        }
        var marketplaceTVARate = response.tva_rate;
        var marketplaceBillingMethod = response.billing_method;
        var marketplaceVouchers = response.vouchers;
        var marketplaceCurrencies = response.currencies;
        // Title
        $('.marketplaceDescription').html(marketplaceDescription);
        // UUID
        $('.section-title-mkpuuid').html('API UUID');
        $('.mkpuuid').html(marketplaceUUID);
        // Reference
        $('.section-title-reference').html('Référence');
        $('.mkpReference').html(marketplaceReference);
        // Status
        $('.section-title-status').html('Statut');
        $('.mkpStatus').html('<span class="is_' + cssStatus + '">' + marketplaceStatus + '</span>');
        // TVA Rate
        $('.section-title-tvaRate').html('Taux de TVA');
        $('.mkpTvaRate').html(marketplaceTVARate + ' %');
        // Billing Method
        $('.section-title-billingMethod').html('Mode de prélèvement');
        $('.mkpTBillingMethod').html(marketplaceBillingMethod);
        // Vouchers
        if ( marketplaceVouchers.length > 0 ) {
            console.log(marketplaceVouchers.length);
            for ( var v = 0; v < marketplaceVouchers.length; v++ ) {
                var vouchersHTML = '<span class="vouchers">' + marketplaceVouchers[v].contract_type + '</span>';
                $('.mkpVouchers').append(vouchersHTML);
            }
            $('.section-title-vouchers').html('Eligible aux contrats');
        }
        // Currencies
        if ( marketplaceCurrencies.length > 0 ) {
            $('.section-title-currencies').html('Devises');
            $('.currenciesTitle').html(
                '<div class="container" style="background:#e9ecef;font-size:16px;font-weight:600;color:#495057;padding:12px">' +
                    '<div class="row">' +
                        '<div class="col-2">Devise</div>' +
                        '<div class="col-8" style="text-align:center">Paramètres de commission minimale</div>' +
                        '<div class="col-2" style="text-align:center">Actif</div>' +
                    '</div>' +
                    '<div class="row" style="padding-top:12px">' +
                        '<div class="col-2"></div>' +
                        '<div class="col-4" style="text-align:center">au prorata du montant total</div>' +
                        '<div class="col-4" style="text-align:center">+ fixe par transaction</div>' +
                        '<div class="col-2"></div>' +
                    '</div>' +
                '</div>');
            for ( var c = 0; c < marketplaceCurrencies.length; c++ ) {
                if ( marketplaceCurrencies[c].is_active === true ) {
                    var currencyActiveHTML = '<span class="is_active">ACTIVE</span>'; 
                } else {
                    var currencyActiveHTML = '<span class="is_inactive">INACTIVE</span>';
                }
                $('.currenciesData').append(
                    '<div class="row" style="padding-top:12px;padding-bottom:12px">' + 
                        '<div class="col-2" style="font-weight:600">' + marketplaceCurrencies[c].currency + '</div>' +
                        '<div class="col-4" style="text-align:center">' + marketplaceCurrencies[c].commission_prorata + ' %</div>' +
                        '<div class="col-4" style="text-align:center">' + marketplaceCurrencies[c].commission_fix + ' ct</div>' +
                        '<div class="col-2" style="text-align:center">' + currencyActiveHTML + '</div>'+ 
                    '</div>');
            }
        }
    });
}