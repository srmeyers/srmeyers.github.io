const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}


const uuidInput = document.getElementById("uuid")
uuidInput.value = uuidv4()

const idNew = document.getElementById("id-new")
idNew.addEventListener("click", e => {
  uuidInput.value = uuidv4()
})

const idCopy = document.getElementById("id-copy")
idCopy.addEventListener("click", e => {
  var copyText = uuidInput.value
  navigator.clipboard.writeText(copyText)

})
