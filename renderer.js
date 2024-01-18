const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  const information2 = document.getElementById('info2')
  information2.innerText = response
  console.log('response', response) // 打印 'pong'
}

func()
