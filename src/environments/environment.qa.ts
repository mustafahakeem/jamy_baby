/**
 * Created by Anupam on 12/28/2016.
 */
export const environment = {
    // THIS ARE TESTING CONFIG! DONT USE THAT IN PROD! CHANGE THAT!
    auth0: {
        clientID: 'HEkxSwd54g8LXfr3P8g72tvmckSIF0KC',
        domain: 'ng2-admin-lte.eu.auth0.com'
    },
    firebase: {
        apiKey: 'AIzaSyC4mOkOIiMfgzrKE5oIMvI51FJaMZ7DwKA',
        authDomain: 'ng2-admin-lte-a3958.firebaseapp.com',
        databaseURL: 'https://ng2-admin-lte-a3958.firebaseio.com',
        messagingSenderId: '201342590340',
        storageBucket: 'ng2-admin-lte-a3958.appspot.com'
    },
    production: true,
    silent: false,
    api:{
        James : { domain: "https://bb-qa-jamesapi.azurewebsites.net"},
        Blockbonds : { domain: "https://bb-qa-api.azurewebsites.net"}
    },
    server:{
        IdentityServer : { domain: "https://bb-qa-idsrv.azurewebsites.net"}
    },
    bbAuth: {
        clientID: "James",
        clientSecret: "1234",
        audience: "AdminApi",
        redirectUrl: "https://bb-qa-james.azurewebsites.net"
    },
    appScopes: ["group", "customerRead", "deposit"],
    uiPermission:{
        enableMenueShowHideBasedOnUserRole: true
      }
};
