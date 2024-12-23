let slideIndex = 0;

function showSlides() {
    const slides = document.getElementsByClassName("image-slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("show");  
    }
    slideIndex++;
    if (slideIndex > slides.length) { 
        slideIndex = 1; 
    }
    slides[slideIndex - 1].classList.add("show");
    setTimeout(showSlides, 5000); // 3000 ms = 3 seconds
}

showSlides();