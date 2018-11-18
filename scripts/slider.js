function slideMaker(url, txt)
{
    var newSlide = document.createElement("li");
    newSlide.classList.add("slide");
    newSlide.style.backgroundImage = "url(" + url + ")";

    var textElt = document.createElement("p");
    textElt.textContent = txt;
    textElt.classList.add("caption");

    newSlide.appendChild(textElt);
    document.querySelector("#slider ul").appendChild(newSlide);
}

slideMaker("slides/01.jpg", "blabla");