window.addEventListener('load', function () {
    let logoImage = document.getElementById('logoImage');
    let logo = document.getElementById('logo');
    let docHeight = document.documentElement.offsetHeight;

    window.addEventListener('scroll', function () {
        // normalize scroll position as percentage
        let scrolled = (window.innerHeight - window.scrollY) / (docHeight - window.innerHeight);

        if (scrolled < 0.2) {
            scrolled = 0.2;
        } else {
            logoImage.style.position = "absolute";
        }
        let transformValue = 'scale(' + scrolled + ') translateY(' + (scrolled) + 'em)';


        logoImage.style.WebkitTransform = transformValue;
        logoImage.style.MozTransform = transformValue;
        logoImage.style.OTransform = transformValue;
        logoImage.style.transform = transformValue;

    }, false);

}, false);

Splitting();