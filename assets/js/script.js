function setRandomColor() {
    return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
}
window.addEventListener('click', event => {
    document.body.style.backgroundColor = setRandomColor();
});
window.addEventListener('keypress', event => {
    document.body.style.backgroundColor = setRandomColor();
});