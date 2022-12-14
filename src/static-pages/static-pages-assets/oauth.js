var Main = {
    run: function () {
        Main.OAuthLogin();
    },
    OAuthLogin: function () {
        var qs = location.search.trim();

        if (qs.length <= 1)
            return alert('Error');

        var provider = 'google';
        if (qs.indexOf('state=Facebook') > -1)
            provider = 'facebook';
        else if (qs.indexOf('state=microsoft') > -1)
            provider = 'microsoft';

        $.ajax({
            url: 'https://leitordenotas3.herokuapp.com/oauth/' + provider + '/callback' + qs + '&domain=' + location.hostname,
            contentType: "application/json",
            type: 'POST'
        }).fail(function () {
            alert('❌ Erro inesperado!');
        }).done(function (data) {
            localStorage.setItem('bgggSessionId', data.session);
            localStorage.setItem('bgggSessionExpires', (Date.now() + 1000 * 60 * 60 * 24 * 14).toString());

            if (localStorage.getItem('bgggSessionIframe') === 'yes') {
                localStorage.removeItem('bgggSessionIframe');
                alert('✅ Sucesso! Você já pode fechar esta aba.');
                window.close();
            }
            else
                location.href = '/';
        });
    }
};

Main.run();