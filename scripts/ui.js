var loader = document.querySelector(".loader")

window.addEventListener("load", hide)

function hide() {
    setTimeout(
        function () {
            loader.classList.add("ausblenden")
        }, 1000);
}