import "./style.css"
import { marketplace } from "./marketplace.js"
import { sellerListFunction } from "./sellerList.js"
import { buyerListFunction } from "./buyerList.js"
import { orderListFunction } from "./orderList.js"
// CONSTANT
const mkpUUID = '57595c55-b096-41d8-9287-b98640de3f25';
const proxy = 'https://lyramkpproxy.herokuapp.com/';
const mkpEndpoint = 'https://secure.lyra.com/marketplace-test/';

// APP INITIALIZATION
$(document).ready(function() {

    $.when( marketplace() ).done(function() {
        $.when( sellerListFunction() ).done(function() {
            $.when( buyerListFunction() ).done(function() {
                orderListFunction()
            });
        });
    });
        
});


// RELOADING ACTIONS
$('.reload-admin-settings').on('click', function() { 
    marketplace();
});
$('.reload-admin-sellers').on('click', function() { 
    if ( $('ul.pagination li:first-child').attr('class') === 'page-item first disabled' ) {
        $('ul.pagination li:nth-child(4)').trigger( "click" );
        setTimeout(
            function() 
            {
                $('ul.pagination li:nth-child(3)').trigger( "click" );
            }, 200);
    } else {
        $('.first').trigger( "click" );
    }
});
$('.reload-admin-buyers').on('click', function() { 
    buyerListFunction();
});
$('.reload-admin-orders').on('click', function() { 
    orderListFunction();
});