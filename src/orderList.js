export function orderListFunction() {
    // CONSTANT
    const mkpUUID = '57595c55-b096-41d8-9287-b98640de3f25';
    const proxy = 'https://lyramkpproxy.herokuapp.com/';
    const mkpEndpoint = 'https://secure.lyra.com/marketplace-test/';
    // INIT
    // GET ORDER LIST
    console.log("Get order list");
    $('.admin-orders').show();
    $('.reload-admin-orders').hide();
    var orderList = {
        "async": true,
        "crossDomain": true,
        "url": proxy + mkpEndpoint + "marketplaces/" + mkpUUID + "/orders",
        "headers": {
            "accept": "application/json",
            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
            "content-Type": "application/json",
            "method": "GET",
        }
    }
    /** On request response */
    $.ajax(orderList).done(function(response) {
        console.log("Get order list (DONE)");
        console.log(response.results);
        $('.admin-orders').hide();
        $('.reload-admin-orders').show();
        $('.orderList').html(
            '<div class="container" style="background:#e9ecef;font-size:16px;font-weight:600;color:#495057;padding:12px">' +
                '<div class="row">' +
                    '<div class="col-1">Créée le</div>' +
                    '<div class="col-2">Référence</div>' +
                    '<div class="col-3">Description</div>' +
                    '<div class="col-2" style="text-align:center">Montant</div>' +
                    '<div class="col-2" style="text-align:center">Statut</div>' +
                    '<div class="col-1" style="text-align:center">...</div>' +
                    '<div class="col-1" style="text-align:center"></div>' +
                '</div>' +
            '</div>'
        );
        var orderCount = response.results.length;
        for ( var o = 0; o < orderCount; o++ ) {
            /** Transform date */
            var orderDate = response.results[o].created_at;
            var newOrderDate = new Date(orderDate);
            var dd = String(newOrderDate.getDate()).padStart(2, '0');
            var mm = String(newOrderDate.getMonth() + 1).padStart(2, '0');
            var yyyy = newOrderDate.getFullYear();
            var HH = String(newOrderDate.getHours()).padStart(2, '0');
            var MM = String(newOrderDate.getMinutes()).padStart(2, '0');
            var SS = String(newOrderDate.getSeconds()).padStart(2, '0');
            var fetchDate = dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + MM + ':' + SS;
            /** Check amount */
            if ( response.results[o].amount === null ) {
                var orderAmount = '-';
            } else {
                if ( response.results[o].currency === 'EUR' ) {
                    var orderAmount = (response.results[o].amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: response.results[o].currency });
                }
                else if ( response.results[o].currency === 'GBP' ) {
                    var orderAmount = (response.results[o].amount / 100).toLocaleString('en-EN', { style: 'currency', currency: response.results[o].currency });
                }
                else if ( response.results[o].currency === 'CHF' ) {
                    var orderAmount = (response.results[o].amount / 100).toLocaleString('fr-CH', { style: 'currency', currency: response.results[o].currency });
                }
            }
            /** Check status */
            if ( response.results[o].status === 'PENDING' ) {
                var orderStatus = '<span class="orderPending">EN ATTENTE</span>';
                //var orderDelete = '<span class="orderCancel" title="Annuler la commande"><i class="fa-solid fa-trash-can"></i></span>';
            }
            else if ( response.results[o].status === 'ABANDONED' ) {
                var orderStatus = '<span class="orderAbandoned">ABANDONNÉE</span>';
                //var orderDelete = '';
            }
            else if ( response.results[o].status === 'SUCCEEDED' ) {
                var orderStatus = '<span class="orderSucceeded">TERMINÉE</span>';
                //var orderDelete = '<span class="orderRefund" title="Rembourser la commande"><i class="fa-solid fa-circle-left"></i></span>';
            }
            else if ( response.results[o].status === 'CANCELLED' ) {
                var orderStatus = '<span class="orderCancelled">ANNULÉE</span>';
                //var orderDelete = '';
            }
            else if ( response.results[o].status === 'CREATED' ) {
                var orderStatus = '<span class="orderCreated">CRÉÉE</span>';
                //var orderDelete = '';
            }
            else if ( response.results[o].status === 'FAILED' ) {
                var orderStatus = '<span class="orderFailed">REFUSÉE</span>';
                //var orderDelete = '';
            }
            /** Check to validate */
            if ( response.results[o].awaiting_validation === true && response.results[o].status != 'CANCELLED' && response.results[o].status != 'CREATED' && response.results[o].status != 'ABANDONED' ) {
                var toValidate = '<span class="orderToValidate clickValidate-' + o + '" title="La commande est en attente de validation manuelle. Cliquez pour valider."><i class="fa-solid fa-clipboard-check"></i></span>';
            } else {
                var toValidate = '';
            }
            /** Check to cancel */
            if ( response.results[o].status != 'CANCELLED' && response.results[o].status != 'ABANDONED' && response.results[o].status != 'SUCCEEDED' && response.results[o].status != 'CREATED' ) {
                var orderDelete = '<span class="orderToCancel clickDelete-' + o + '" title="Cliquez pour annuler la commande."><i class="fa-solid fa-trash-can"></i></span>';
            } else {
                var orderDelete = '';
            }
            /** Check to refund  */
            if ( response.results[o].status === 'SUCCEEDED' ) {
                var orderRefund = '<span class="orderToRefund clickRefund-' + o + '" title="Cliquez pour rembourser la commande."><i class="fa-solid fa-circle-left"></i></span>';
            } else {
                var orderRefund = '';
            }
            $('.orderList').append(
                '<div class="container orderRow orderRow-' + o + '" style="border-top:1px solid #e9ecef;padding:12px">' +
                    '<div class="row">' +
                        '<div class="col-1">' + fetchDate + '</div>' +
                        '<div class="col-2">' + response.results[o].reference + '</div>' +
                        '<div class="col-3">' + response.results[o].description + '</div>' +
                        '<div class="col-2" style="text-align:center">' + orderAmount + '</div>' +
                        '<div class="col-2" style="text-align:center">' + orderStatus + '</div>' +
                        '<div class="col-1" style="text-align:center">' + toValidate + '</div>' +
                        '<div class="col-1" style="text-align:center">' + orderDelete + orderRefund + '</div>' +
                    '</div>' +
                '</div'
            );
            /** Click validate */
            $('.clickValidate-' + o).on('click', function() {
                var clickClassname = $(this).attr('class').slice(30, 31);
                $('.mask').show();
                $('.modalValidate').show();
                var modalValidateContent = 
                    '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                        '<div class="row">'+
                            '<div class="col">' +
                                '<h5 style="font-size:20px;padding:0;margin:0">' +
                                    'Valider la commande' +
                                '</h5>' +
                                '<span class="closeModalValidate closeModalButton">X</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                        '<div class="row">'+
                            '<div class="col">' +
                                'Êtes-vous sûr de vouloir valider la commande ' + response.results[clickClassname].reference + ' (' + response.results[clickClassname].description + ') ?' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="container" style="padding:16px">' +
                        '<div class="row">'+
                            '<div class="col" style="text-align:right">' +
                                '<button type="button" class="btn btn-secondary modalValidateCancel">Annuler</button>' +
                                '<button type="button" class="btn btn-danger modalValidateConfirm">Confirmer la validation</button>' +   
                            '</div>' +
                        '</div>' +
                    '</div>'
                ;
                $('.modalValidate').html(modalValidateContent);
                $('.closeModalValidate').on('click', function() {
                    $('.mask').hide();
                    $('.modalValidate').hide();
                });
                $('.modalValidateCancel').on('click', function() {
                    $('.mask').hide();
                    $('.modalValidate').hide();
                });
                $('.modalValidateConfirm').on('click', function() {
                    var modalValidateContentConfirm = 
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col">' +
                                    '<h5 style="font-size:20px;padding:0;margin:0">' +
                                        'Valider la commande' +
                                    '</h5>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col" style="text-align:center">' +
                                    '... VALIDATION EN COURS ...' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px">' +
                            '<div class="row">'+
                                '<div class="col" style="text-align:center">' +
                                    '<div class="text-center">' +
                                        '<div class="spinner-border confirmLoading" style="width: 6rem; height: 6rem;" role="status">' +
                                            '<span class="sr-only">Loading...</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    ;
                    $('.modalValidate').html(modalValidateContentConfirm);
                    // Order validation
                    var orderValidation = {
                        "async": true,
                        "crossDomain": true,
                        "method": "POST",
                        "url": proxy + mkpEndpoint + "orders/" + response.results[clickClassname].uuid + "/validate",
                        "headers": {
                            "accept": "application/json",
                            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
                            "content-Type": "application/json"
                        }
                    }
                    $.ajax(orderValidation).done(function(responseValidation) {
                        var modalValidateContentConfirmOK = 
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col">' +
                                    '<h5 style="font-size:20px;padding:0;margin:0">' +
                                        'Valider la commande' +
                                    '</h5>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col">' +
                                    'La commande ' + responseValidation.reference + ' (' + responseValidation.description + ') a bien été validée.' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px">' +
                            '<div class="row">'+
                                '<div class="col" style="text-align:right">' +
                                    '<button type="button" class="btn btn-danger modalValidateConfirmOK">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>' +   
                                '</div>' +
                            '</div>' +
                        '</div>'
                        ;
                        $('.modalValidate').html(modalValidateContentConfirmOK);
                        $('.modalValidateConfirmOK').on('click', function() {
                            $('.mask').hide();
                            $('.modalValidate').hide();
                            orderListFunction();
                        });
                    });
                });
            });
            /** Click delete */
            $('.clickDelete-' + o).on('click', function() {
                var clickDeleteClassname = $(this).attr('class').slice(26, 27);
                $('.mask').show();
                $('.modalDelete').show();
                var modalDeleteContent = 
                    '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                        '<div class="row">'+
                            '<div class="col">' +
                                '<h5 style="font-size:20px;padding:0;margin:0">' +
                                    'Annuler la commande' +
                                '</h5>' +
                                '<span class="closeModalDelete closeModalButton">X</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                        '<div class="row">'+
                            '<div class="col">' +
                                'Êtes-vous sûr de vouloir annuler la commande ' + response.results[clickDeleteClassname].reference + ' (' + response.results[clickDeleteClassname].description + ') ?' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="container" style="padding:16px">' +
                        '<div class="row">'+
                            '<div class="col" style="text-align:right">' +
                                '<button type="button" class="btn btn-secondary modalDeleteCancel">Annuler</button>' +
                                '<button type="button" class="btn btn-danger modalDeleteConfirm">Confirmer l\'annulation</button>' +   
                            '</div>' +
                        '</div>' +
                    '</div>'
                ;
                $('.modalDelete').html(modalDeleteContent);
                $('.closeModalDelete').on('click', function() {
                    $('.mask').hide();
                    $('.modalDelete').hide();
                });
                $('.modalDeleteCancel').on('click', function() {
                    $('.mask').hide();
                    $('.modalDelete').hide();
                });
                // Order cancellation
                $('.modalDeleteConfirm').on('click', function() {
                    var modalDeleteContent = 
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col">' +
                                    '<h5 style="font-size:20px;padding:0;margin:0">' +
                                        'Annuler la commande' +
                                    '</h5>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                            '<div class="row">'+
                                '<div class="col" style="text-align:center">' +
                                    '... ANNULATION EN COURS ...' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container" style="padding:16px">' +
                            '<div class="row">'+
                                '<div class="col" style="text-align:center">' +
                                    '<div class="text-center">' +
                                        '<div class="spinner-border confirmLoading" style="width: 6rem; height: 6rem;" role="status">' +
                                            '<span class="sr-only">Loading...</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    ;
                    $('.modalDelete').html(modalDeleteContent);
                    var orderCancellation = {
                        "async": true,
                        "crossDomain": true,
                        "method": "DELETE",
                        "url": proxy + mkpEndpoint + "orders/" + response.results[clickDeleteClassname].uuid,
                        "headers": {
                            "accept": "application/json",
                            "authorization": "Basic " + process.env.MKP_API_SECRET_AUTH_KEY,
                            "content-Type": "application/json"
                        }
                    }
                    $.ajax(orderCancellation).done(function(responseCancellation) {
                        if ( responseCancellation === undefined ) {
                            var modalDeleteContentConfirmOK = 
                            '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                                '<div class="row">'+
                                    '<div class="col">' +
                                        '<h5 style="font-size:20px;padding:0;margin:0">' +
                                            'Annuler la commande' +
                                        '</h5>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="container" style="padding:16px;border-bottom:1px solid #dee2e6">' +
                                '<div class="row">'+
                                    '<div class="col">' +
                                        'La commande a bien été annulée.' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="container" style="padding:16px">' +
                                '<div class="row">'+
                                    '<div class="col" style="text-align:right">' +
                                        '<button type="button" class="btn btn-danger modalDeleteConfirmOK">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>' +   
                                    '</div>' +
                                '</div>' +
                            '</div>'
                            ;
                            $('.modalDelete').html(modalDeleteContentConfirmOK);
                            $('.modalDeleteConfirmOK').on('click', function() {
                                $('.mask').hide();
                                $('.modalDelete').hide();
                                orderListFunction();
                            });
                        }
                    });
                });
            });
        }
        // Oder click detail
        $('.orderRow').on('click', function() {
            $('.admin-orders').show();
            $('.reload-admin-orders').hide();
            var rowClass = $(this).attr('class').slice(28, 29);
            alert(response.results[rowClass].uuid);
            
        });
    });
}