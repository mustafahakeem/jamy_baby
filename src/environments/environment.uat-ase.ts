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
        James: { domain: "https://uat-jamesapi.spenn.com"},
        Blockbonds: { domain: "https://bb-uat-ase-api.spenninternal.com"}
    },
    server:{
        IdentityServer: { domain: "https://bb-uat-ase-idsrv.spenninternal.com"}
    },
    bbAuth: {
        clientID: "James",
        clientSecret: "1234",
        audience: "AdminApi",
        redirectUrl: "https://uat-james.spenn.com"
    },
    appScopes: ["group", "customerRead", "deposit"],
    uiPermission:{
        enableMenueShowHideBasedOnUserRole: true
      }
};
