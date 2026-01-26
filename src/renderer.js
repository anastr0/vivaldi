const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${vivaldi.chrome()}), Node.js (v${vivaldi.node()}), and Electron (v${vivaldi.electron()})`

window.addEventListener('DOMContentLoaded', async () => {
  const imageListElement = document.getElementById('image-list')

  try {
    const images = await vivaldi.getDockerImages()

    // Update your UI
    images.forEach((img) => {
      const li = document.createElement('li')
      li.textContent = `${img.tags[0]} (${img.id}) - ${img.size}`
      imageListElement.appendChild(li)
    })
  } catch (err) {
    alert(err.message)
  }
})
