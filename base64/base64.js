
const original = document.getElementById("original")
const base64 = document.getElementById("base64")

const idDecode = document.getElementById("id-decode")
idDecode.addEventListener("click", e => {
  let decoded = atob(base64.value)
  original.value = decoded
})

const idEncode = document.getElementById("id-encode")
idEncode.addEventListener("click", e => {
  let encoded = btoa(original.value)
  base64.value = encoded
})
