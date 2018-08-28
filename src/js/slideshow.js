export default function(document) {
    const imageNodeArray = document.querySelectorAll(
        '.slideshow-container > .slide'
    );

    let currentSlide = 0;

    const numOfSlides = imageNodeArray.length - 1;

    imageNodeArray[0].classList.add('show-image');

    const _nextSlide = function() {
        if (currentSlide < numOfSlides) {
            imageNodeArray[currentSlide + 1].classList.add('show-image');
            imageNodeArray[currentSlide].classList.remove('show-image');

            currentSlide += 1;
        }
    };

    const _prevSlide = function() {
        if (currentSlide > 0) {
            imageNodeArray[currentSlide - 1].classList.add('show-image');
            imageNodeArray[currentSlide].classList.remove('show-image');

            currentSlide -= 1;
        }
    };

    return {
        nextSlide: _nextSlide,
        prevSlide: _prevSlide
    }
}