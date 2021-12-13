import Imagemin from 'imagemin-web'

export function CheckValueLength(text, name = text, min = 4, max = 32) {
    if (text && (text.length <= min || text.length >= max)) {
        return {code: false, word: `${name}过短或过长，它的长度应该小于${max}同时大于${min}`}
    }
    return {code: true}
}

export function CheckValueIsNumber(text, name = text) {
    if (typeof text != "number") {
        return {code: false, word: `${name}不是数字，请改为数字`}
    }
    return {code: true}
}

export function ToLink(url) {
    window.open(url, "_blank");
}

export function MyImagemin(file, size = 50) {
    return new Promise(resolve => {
        // https://npm.io/package/imagemin-web
        new Imagemin(file, {
            maxSize: size,   // kb
            maxWidth: 300,
            success(result) {
                let resultFile = new window.File([result], file.name, {type: file.type})
                resolve({code: true, file: resultFile})
            },
            fail: error => {
                resolve({code: false, error})
            }
        })
    })
}

