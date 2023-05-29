export default (uri: string) => new Promise<Blob>((resolve, reject) => {
	const xhr = new XMLHttpRequest()
	xhr.onload = () => resolve(xhr.response)
	xhr.onerror = () => reject('uriToBlob failed.')

	xhr.responseType = 'blob'
	xhr.open('GET', uri, true)

	xhr.send(null)
})