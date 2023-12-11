$(function () {

    /* faq toggle */
    $(function () {
        $(".faq__question").on('click', function () {
            let box = $(this).closest(".faq");
            if (box.hasClass('faq_active')) {
                box.find('.faq__answer').slideUp(300);
                box.removeClass('faq_active');
            } else {
                box.find('.faq__answer').slideDown(300);
                box.addClass('faq_active');
            }
        });
    });
});




$(window).scroll(function () {

    if (this.scrollY > 100) {
        $('header').addClass("sticky");
    } else {
        $('header').removeClass("sticky");
    }

    if (this.scrollY > 500) {
        $('.scroll-up-btn').addClass("show");
    } else {
        $('.scroll-up-btn').removeClass("show");
    }
});


// Default language
let currentLanguage = 'english';

function changeLanguage() {
    const langSelect = document.getElementById('lang');
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerSubtitle = document.getElementById('bannerSubtitle');
    const messageContainer = document.getElementById('messageContainer');
    const bannerpara = document.getElementById('bannerpara');
    const bannerbtn = document.getElementById('bannerbtn');
    const bannerbtn1 = document.getElementById('bannerbtn1');
    

    currentLanguage = langSelect.value;

    if (currentLanguage === 'hindi') {
        bannerTitle.innerText = 'अनगिनत फिल्में, टीवी शो और बहुत कुछ';
        bannerSubtitle.innerText = 'अनगिनत मनोरंजन, सिर्फ ₹ 149 में शुरू होता है। कभी भी रद्द करें।';
        bannerpara.innerText= 'तैयार हैं देखने के लिए? अपनी ईमेल दर्ज करें और अपनी सदस्यता बनाएं या पुनः आरंभ करें।'
        bannerbtn.innerText = 'साइन इन'
        bannerbtn1.innerText ='शुरू हो जाओ'
    } else {
        bannerTitle.innerText = 'Unlimited movies, TV shows and more';
        bannerSubtitle.innerText = 'Endless entertainment starts at just ₹ 149. Cancel anytime.';
        bannerpara.innerText = 'Ready to watch? Enter your email to create or restart your membership.'
        bannerbtn.innerText='sign in'
        bannerbtn1.innerText = 'get started'
    }

    messageContainer.innerHTML = '';
}

